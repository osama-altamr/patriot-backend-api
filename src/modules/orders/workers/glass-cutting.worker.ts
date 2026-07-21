import { parentPort } from 'worker_threads';
import { MaxRectsPacker, Rectangle, PACKING_LOGIC } from 'maxrects-packer';

interface PackableItem {
  id: any;
  width: number;
  height: number;
}

interface PackedItem {
  id: any;
  width: number;
  height: number;
  x: number;
  y: number;
  rotated?: boolean;
}

type SortMode = 'area' | 'maxSide' | 'height' | 'width' | 'perimeter';

interface PackStrategy {
  name: string;
  sort: SortMode;
  allowRotation: boolean;
  logic: PACKING_LOGIC;
  preferOrientation?: 'landscape' | 'portrait' | 'none';
}

/** Kerf / saw gap between pieces */
const PADDING = 1;

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function fits(w: number, h: number, sheetW: number, sheetH: number): boolean {
  return w <= sheetW && h <= sheetH;
}

function sortItems(items: PackableItem[], mode: SortMode): PackableItem[] {
  const copy = items.map((item) => ({ ...item }));
  switch (mode) {
    case 'maxSide':
      return copy.sort(
        (a, b) =>
          Math.max(b.width, b.height) - Math.max(a.width, a.height) ||
          b.width * b.height - a.width * a.height,
      );
    case 'height':
      return copy.sort(
        (a, b) => b.height - a.height || b.width * b.height - a.width * a.height,
      );
    case 'width':
      return copy.sort(
        (a, b) => b.width - a.width || b.width * b.height - a.width * a.height,
      );
    case 'perimeter':
      return copy.sort(
        (a, b) =>
          b.width + b.height - (a.width + a.height) ||
          b.width * b.height - a.width * a.height,
      );
    case 'area':
    default:
      return copy.sort((a, b) => b.width * b.height - a.width * a.height);
  }
}

function applyPreferredOrientation(
  items: PackableItem[],
  sheetW: number,
  sheetH: number,
  prefer: 'landscape' | 'portrait' | 'none' = 'none',
): PackableItem[] {
  if (prefer === 'none') {
    return items.map((item) => ({ ...item }));
  }

  return items.map((item) => {
    const isLandscape = item.width >= item.height;
    const wantLandscape = prefer === 'landscape';
    if (isLandscape === wantLandscape) {
      return { ...item };
    }
    if (fits(item.height, item.width, sheetW, sheetH)) {
      return { ...item, width: item.height, height: item.width };
    }
    return { ...item };
  });
}

/**
 * Bottom-Left Fill on a SINGLE sheet (Maximal Rectangles free-list).
 * Remaining pieces that do not fit stay unpacked.
 */
function packBottomLeftFillSingle(
  sheetW: number,
  sheetH: number,
  items: PackableItem[],
  allowRotation: boolean,
): { packedItems: PackedItem[]; unpacked: PackableItem[] } {
  type FreeRect = { x: number; y: number; width: number; height: number };

  let freeRects: FreeRect[] = [{ x: 0, y: 0, width: sheetW, height: sheetH }];
  const packedItems: PackedItem[] = [];
  const unpacked: PackableItem[] = [];

  const findBottomLeft = (
    w: number,
    h: number,
  ): { x: number; y: number } | null => {
    let best: { x: number; y: number } | null = null;
    for (const fr of freeRects) {
      if (w <= fr.width && h <= fr.height) {
        if (
          !best ||
          fr.y < best.y ||
          (fr.y === best.y && fr.x < best.x)
        ) {
          best = { x: fr.x, y: fr.y };
        }
      }
    }
    return best;
  };

  const splitOnOverlap = (fr: FreeRect, used: FreeRect): FreeRect[] => {
    if (
      used.x >= fr.x + fr.width ||
      used.x + used.width <= fr.x ||
      used.y >= fr.y + fr.height ||
      used.y + used.height <= fr.y
    ) {
      return [fr];
    }

    const results: FreeRect[] = [];
    if (used.x > fr.x) {
      results.push({ x: fr.x, y: fr.y, width: used.x - fr.x, height: fr.height });
    }
    if (used.x + used.width < fr.x + fr.width) {
      results.push({
        x: used.x + used.width,
        y: fr.y,
        width: fr.x + fr.width - (used.x + used.width),
        height: fr.height,
      });
    }
    if (used.y > fr.y) {
      results.push({ x: fr.x, y: fr.y, width: fr.width, height: used.y - fr.y });
    }
    if (used.y + used.height < fr.y + fr.height) {
      results.push({
        x: fr.x,
        y: used.y + used.height,
        width: fr.width,
        height: fr.y + fr.height - (used.y + used.height),
      });
    }
    return results.filter((r) => r.width > 0 && r.height > 0);
  };

  const pruneFreeRects = () => {
    freeRects = freeRects.filter(
      (a, i) =>
        !freeRects.some(
          (b, j) =>
            i !== j &&
            a.x >= b.x &&
            a.y >= b.y &&
            a.x + a.width <= b.x + b.width &&
            a.y + a.height <= b.y + b.height,
        ),
    );
  };

  const place = (item: PackableItem, w: number, h: number, rotated: boolean) => {
    const pos = findBottomLeft(w, h);
    if (!pos) return false;

    const used: FreeRect = {
      x: pos.x,
      y: pos.y,
      width: Math.min(w + PADDING, sheetW - pos.x),
      height: Math.min(h + PADDING, sheetH - pos.y),
    };

    freeRects = freeRects.flatMap((fr) => splitOnOverlap(fr, used));
    pruneFreeRects();

    packedItems.push({
      id: item.id,
      width: w,
      height: h,
      x: pos.x,
      y: pos.y,
      rotated,
    });
    return true;
  };

  for (const item of items) {
    const orientations: Array<{ w: number; h: number; rotated: boolean }> = [
      { w: item.width, h: item.height, rotated: false },
    ];
    if (
      allowRotation &&
      item.width !== item.height &&
      fits(item.height, item.width, sheetW, sheetH)
    ) {
      orientations.push({ w: item.height, h: item.width, rotated: true });
    }

    let bestChoice: {
      w: number;
      h: number;
      rotated: boolean;
      x: number;
      y: number;
    } | null = null;

    for (const ori of orientations) {
      if (!fits(ori.w, ori.h, sheetW, sheetH)) continue;
      const pos = findBottomLeft(ori.w, ori.h);
      if (!pos) continue;
      if (
        !bestChoice ||
        pos.y < bestChoice.y ||
        (pos.y === bestChoice.y && pos.x < bestChoice.x)
      ) {
        bestChoice = { ...ori, x: pos.x, y: pos.y };
      }
    }

    if (bestChoice && place(item, bestChoice.w, bestChoice.h, bestChoice.rotated)) {
      continue;
    }
    unpacked.push(item);
  }

  return { packedItems, unpacked };
}

/**
 * Maximal Rectangles packer — only the first sheet is kept (API/UI is single-sheet).
 */
function packWithMaxRectsSingle(
  sheetW: number,
  sheetH: number,
  items: PackableItem[],
  strategy: PackStrategy,
): { packedItems: PackedItem[]; unpacked: PackableItem[] } {
  const oriented = applyPreferredOrientation(
    items,
    sheetW,
    sheetH,
    strategy.preferOrientation ?? 'none',
  );
  const sorted = sortItems(oriented, strategy.sort);

  const packer = new MaxRectsPacker(sheetW, sheetH, PADDING, {
    smart: false,
    pot: false,
    square: false,
    allowRotation: strategy.allowRotation,
    logic: strategy.logic,
  });

  packer.addArray(
    sorted.map((item) => {
      const rect = new Rectangle(item.width, item.height);
      rect.data = item;
      (rect as any).allowRotation = strategy.allowRotation;
      return rect;
    }),
  );

  const firstBin = packer.bins[0];
  const packedItems: PackedItem[] = [];
  const packedIds = new Set<any>();

  if (firstBin) {
    for (const rect of firstBin.rects) {
      if (
        rect.oversized ||
        rect.x + rect.width > sheetW ||
        rect.y + rect.height > sheetH
      ) {
        continue;
      }
      packedIds.add(rect.data.id);
      packedItems.push({
        id: rect.data.id,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        rotated: Boolean(rect.rot),
      });
    }
  }

  const unpacked = items.filter((item) => !packedIds.has(item.id));
  return { packedItems, unpacked };
}

function scoreSingleSheet(packedItems: PackedItem[]): number {
  const packedArea = packedItems.reduce((s, i) => s + i.width * i.height, 0);
  // Prefer more area packed, then more pieces
  return packedArea * 1000 + packedItems.length;
}

function runGlassCuttingAlgorithm(
  rawWidth: number,
  rawHeight: number,
  packableItems: PackableItem[],
): any {
  const width = toNumber(rawWidth);
  const height = toNumber(rawHeight);

  const items = packableItems
    .map((item) => ({
      id: item.id,
      width: toNumber(item.width),
      height: toNumber(item.height),
    }))
    .filter(
      (item) =>
        fits(item.width, item.height, width, height) ||
        fits(item.height, item.width, width, height),
    );

  const tooBig = packableItems
    .map((item) => ({
      id: item.id,
      width: toNumber(item.width),
      height: toNumber(item.height),
    }))
    .filter(
      (item) =>
        !fits(item.width, item.height, width, height) &&
        !fits(item.height, item.width, width, height),
    );

  if (items.length === 0) {
    return {
      materialDimensions: { width, height },
      packedItems: [],
      unpackedItems: packableItems.map((item) => ({
        id: item.id,
        width: toNumber(item.width),
        height: toNumber(item.height),
      })),
      utilization: 0,
    };
  }

  const strategies: PackStrategy[] = [
    {
      name: 'maxrects-area-rotate',
      sort: 'area',
      allowRotation: true,
      logic: PACKING_LOGIC.MAX_AREA,
    },
    {
      name: 'maxrects-edge-rotate',
      sort: 'area',
      allowRotation: true,
      logic: PACKING_LOGIC.MAX_EDGE,
    },
    {
      name: 'maxrects-maxside-rotate',
      sort: 'maxSide',
      allowRotation: true,
      logic: PACKING_LOGIC.MAX_AREA,
    },
    {
      name: 'maxrects-height-rotate',
      sort: 'height',
      allowRotation: true,
      logic: PACKING_LOGIC.MAX_EDGE,
    },
    {
      name: 'maxrects-area-landscape',
      sort: 'area',
      allowRotation: true,
      logic: PACKING_LOGIC.MAX_AREA,
      preferOrientation: 'landscape',
    },
    {
      name: 'maxrects-area-portrait',
      sort: 'area',
      allowRotation: true,
      logic: PACKING_LOGIC.MAX_AREA,
      preferOrientation: 'portrait',
    },
  ];

  let best: {
    packedItems: PackedItem[];
    unpacked: PackableItem[];
    strategy: string;
    score: number;
  } | null = null;

  for (const strategy of strategies) {
    const result = packWithMaxRectsSingle(width, height, items, strategy);
    const score = scoreSingleSheet(result.packedItems);
    if (!best || score > best.score) {
      best = { ...result, strategy: strategy.name, score };
    }
  }

  for (const sort of ['area', 'maxSide', 'height'] as SortMode[]) {
    for (const prefer of ['none', 'landscape', 'portrait'] as const) {
      const sorted = sortItems(
        applyPreferredOrientation(items, width, height, prefer),
        sort,
      );
      const result = packBottomLeftFillSingle(width, height, sorted, true);
      const score = scoreSingleSheet(result.packedItems);
      const name = `blf-${sort}-${prefer}`;
      if (!best || score > best.score) {
        best = { ...result, strategy: name, score };
      }
    }
  }

  const packedItems = best!.packedItems;
  const packedArea = packedItems.reduce((s, i) => s + i.width * i.height, 0);
  const unpackedItems = [...tooBig, ...best!.unpacked];

  // Same response shape as before (single sheet for the material-grid UI)
  return {
    materialDimensions: { width, height },
    packedItems: packedItems.map(({ id, width: w, height: h, x, y }) => ({
      id,
      width: w,
      height: h,
      x,
      y,
    })),
    unpackedItems: unpackedItems.map(({ id, width: w, height: h }) => ({
      id,
      width: w,
      height: h,
    })),
    utilization: packedArea / (width * height),
  };
}

export { runGlassCuttingAlgorithm };

if (parentPort) {
  parentPort.on('message', (payload) => {
    try {
      const resultData = runGlassCuttingAlgorithm(
        payload.width,
        payload.height,
        payload.packableItems,
      );
      parentPort.postMessage({
        status: 'completed',
        data: {
          ...resultData,
          originalMaterialId: payload.originalMaterialId,
        },
      });
    } catch (error) {
      parentPort.postMessage({
        status: 'error',
        error: (error as Error).message,
      });
    }
  });
}
