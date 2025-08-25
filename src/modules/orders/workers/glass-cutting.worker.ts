import { parentPort } from 'worker_threads';
import { MaxRectsPacker, Rectangle } from 'maxrects-packer';
import  { Select1 } from 'genetic-js';
import * as Genetic from 'genetic-js';

interface PackableItem { id: any; width: number; height: number; }


function crossover(
    parent1: PackableItem[], 
    parent2: PackableItem[],
    materialWidth: number,
    materialHeight: number
): PackableItem[] {
    // أخذ 30% من العناصر من الأب الأول (على الأقل عنصر واحد)
    const segmentSize = Math.max(1, Math.floor(parent1.length * 0.3));
    const start = Math.floor(Math.random() * (parent1.length - segmentSize));
    const childPart = parent1.slice(start, start + segmentSize);
    
    // إنشاء مجموعة من المعرفات المحددة
    const selectedIds = new Set(childPart.map(item => item.id));
    
    // أخذ العناصر المتبقية من الأب الثاني مع احتمال التدوير
    const remainingFromParent2 = parent2
        .filter(item => !selectedIds.has(item.id))
        .map(item => {
            const shouldRotate = Math.random() > 0.5 && 
                              item.height <= materialWidth && 
                              item.width <= materialHeight;
            return shouldRotate 
                ? { ...item, width: item.height, height: item.width }
                : item;
        });
    
    // دمج النتائج مع التحقق من التكرار
    const result = [...childPart, ...remainingFromParent2];
    const uniqueIds = new Set(result.map(item => item.id));
    
    if (uniqueIds.size !== result.length) {
        console.warn('تم اكتشاف معرفات مكررة بعد التهجين');
        return result.filter((item, index, self) =>
            index === self.findIndex(i => i.id === item.id)
        );
    }
    
    return result;
}

function shuffleWithPriority(items: PackableItem[]): PackableItem[] {
    return [...items]
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))
        .map((item, i, arr) => 
            i > 0 && Math.random() > 0.7 && 
            (arr[i-1].width * arr[i-1].height) === (item.width * item.height)
                ? [arr[i], arr[i-1]]
                : [item, arr[i-1]]
        )
        .flat()
        .filter(Boolean);
}

function runGlassCuttingAlgorithm(width: number, height: number, packableItems: PackableItem[]): any {
    let materialWidth = width;
    let materialHeight = height;
    
    if (materialHeight > materialWidth) {
        [materialWidth, materialHeight] = [materialHeight, materialWidth];
    }

    const config = { iterations: 3000, populationSize: 500, mutationChance: 0.4, crossoverChance: 0.85, fittestAlwaysSurvives: true, eliteCount: 5 };

   let population: PackableItem[][] = [];
           for (let i = 0; i < config.populationSize; i++) {
               const individual = packableItems.map(item => {
                   const shouldRotate = item.height > item.width && 
                                      item.width <= height && 
                                      item.height <= width;
                   return shouldRotate 
                       ? { ...item, width: item.height, height: item.width } 
                       : item;
               });
               
               population.push(shuffleWithPriority(individual));
           }
       
           const calculateFitness = (chromosome: PackableItem[]) => {
               const uniqueItems = chromosome.filter((item, index, self) =>
                   index === self.findIndex(i => i.id === item.id)
               );
               
               if (uniqueItems.length !== chromosome.length) {
                   return -Infinity; // عقوبة شديدة للعناصر المكررة
               }
       
               const packer = new MaxRectsPacker(width, height, 1, {
                   smart: true,
                   pot: true,
                   square: false
               });
               
               // ترتيب حسب المساحة تنازلياً لتحسين التعبئة
               const sorted = [...chromosome].sort((a, b) => 
                   (b.width * b.height) - (a.width * a.height));
               
               const rectangles = sorted.map(item => {
                   const rect = new Rectangle(item.width, item.height);
                   rect.data = item;
                   return rect;
               });
               
               packer.addArray(rectangles);
               
               if (!packer.bins[0]) return 0;
               
               let packedArea = 0;
               let outOfBounds = false;
               let wastedSpace = 0;
               let usableGaps = 0;
               const binArea = width * height;
           
       
               packer.bins[0].rects.forEach(rect => {
                   // التحقق من الحدود
                   if (rect.x + rect.width > width || rect.y + rect.height > height) {
                       outOfBounds = true;
                       return;
                   }
                   
                   packedArea += rect.area();
                   
                   // حساب الفراغات القابلة للاستخدام
                   const rightSpace = width - (rect.x + rect.width);
                   const bottomSpace = height - (rect.y + rect.height);
                   
                   if (rightSpace >= 20) usableGaps++;
                   if (bottomSpace >= 19) usableGaps++;
               });
           
               // حساب المساحة المهدرة
               wastedSpace = binArea - packedArea;
               
               wastedSpace = binArea - packedArea - (usableGaps * 20 * 19 * 0.5);
       
               // معاملات العقاب والمكافأة
               const outOfBoundsPenalty = outOfBounds ? 0.5 : 1;
               const gapBonus = 1 + (usableGaps * 0.05);
               
               return (packedArea / binArea) * outOfBoundsPenalty * gapBonus - (wastedSpace / binArea);
           };
       
           // دالة التحول
           const mutate = (chromosome: PackableItem[]) => {
               const mutated = [...chromosome];
               
               if (Math.random() < config.mutationChance) {
                   // تبديل عنصرين عشوائيين
                   const i1 = Math.floor(Math.random() * mutated.length);
                   const i2 = Math.floor(Math.random() * mutated.length);
                   [mutated[i1], mutated[i2]] = [mutated[i2], mutated[i1]];
                   
                   // تدوير عنصر عشوائي
                   if (Math.random() < 0.5) {
                       const idx = Math.floor(Math.random() * mutated.length);
                       const item = mutated[idx];
                       if (item.height <= width && item.width <= height) {
                           mutated[idx] = { ...item, width: item.height, height: item.width };
                       }
                   }
                   
                   // نقل العناصر الكبيرة إلى المقدمة
                   if (Math.random() < 0.3) {
                       const largeItems = mutated
                           .map((item, index) => ({index, area: item.width * item.height}))
                           .sort((a, b) => b.area - a.area);
                       
                       if (largeItems.length > 0) {
                           const [largeItem] = largeItems;
                           const [item] = mutated.splice(largeItem.index, 1);
                           mutated.unshift(item);
                       }
                   }
               }
               
               return mutated;
           };
           
           // الحلقة التطورية
           let bestSolution: PackableItem[] = [];
           let bestFitness = -Infinity;
           let stagnationCount = 0;
       
           for (let gen = 0; gen < config.iterations; gen++) {
               // تقييم المجتمع
               const scored = population.map(chromosome => ({
                   entity: chromosome,
                   fitness: calculateFitness(chromosome)
               })).sort((a, b) => b.fitness - a.fitness);
       
               // التحقق من أفضل حل جديد
               if (scored[0].fitness > bestFitness) {
                   bestFitness = scored[0].fitness;
                   bestSolution = scored[0].entity;
                   stagnationCount = 0;
               } else {
                   stagnationCount++;
               }
       
               // خروج مبكر إذا لم يكن هناك تحسن
               if (stagnationCount > 50) break;
       
               // إنشاء جيل جديد
               const newPopulation: PackableItem[][] = [];
               
               // الاحتفاظ بالنخبة
               if (config.fittestAlwaysSurvives) {
                   newPopulation.push(...scored.slice(0, config.eliteCount).map(s => s.entity));
               }
       
               // ملء بقية المجتمع
               while (newPopulation.length < config.populationSize) {
                   let child: PackableItem[];
                   
                   if (Math.random() < config.crossoverChance) {
                       const parent1 = Select1.Tournament2.call(
                           { optimize: Genetic.Optimize.Maximize }, scored);
                       const parent2 = Select1.Tournament2.call(
                           { optimize: Genetic.Optimize.Maximize }, scored);
                       child = crossover(parent1, parent2, width, height);
                   } else {
                       child = Select1.Tournament2.call(
                           { optimize: Genetic.Optimize.Maximize }, scored);
                   }
                   
                   newPopulation.push(mutate(child));
               }
               
               population = newPopulation;
           }
       
           // التعبئة النهائية مع أفضل حل
           const finalPacker = new MaxRectsPacker(width, height, 1, {
               smart: true,
               pot: true,
               square: true
           });
           
           // التأكد من عدم وجود تكرار في الحل النهائي
           const uniqueBestSolution = bestSolution.filter((item, index, self) =>
               index === self.findIndex(i => i.id === item.id)
           );
           
           finalPacker.addArray(uniqueBestSolution.map(item => {
               const rect = new Rectangle(item.width, item.height);
               rect.data = item;
               return rect;
           }));
       
           // إعداد النتائج النهائية
           const packedItems = finalPacker.bins[0]?.rects
               .filter(rect => 
                   rect.x + rect.width <= width && 
                   rect.y + rect.height <= height)
               .map(rect => ({
                   id: rect.data.id,
                   width: rect.width,
                   height: rect.height,
                   x: rect.x,
                   y: rect.y,
               })) || [];
       
           const packedArea = packedItems.reduce((sum, item) => 
               sum + (item.width * item.height), 0);
           
           const packedIds = new Set(packedItems.map(p => p.id));
           const unpackedItems = packableItems.filter(item => !packedIds.has(item.id));
       
    return {
        materialDimensions: { width, height },
        packedItems,
        unpackedItems,
        utilization: packedArea / (width * height),
    };
}

parentPort.on('message', (payload) => {
    try {
        const resultData = runGlassCuttingAlgorithm(payload.width, payload.height, payload.packableItems);
        parentPort.postMessage({ status: 'completed', data: { ...resultData, originalMaterialId: payload.originalMaterialId } });
    } catch (error) {
        parentPort.postMessage({ status: 'error', error: error.message });
    }
});