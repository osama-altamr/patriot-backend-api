
export const getKeysOf = <K extends string, V>(obj: { [key in K]: V }): K[] =>
    Object.keys(obj).filter((key): key is K => Number.isNaN(Number(key)))
  
  export const getValuesOf = <K extends string, V>(obj: { [key in K]: V }): V[] =>
    getKeysOf(obj).map((key: K) => obj[key])

  export enum MaterialType {
    IRON = "IRON"
  }

export const materialTypeValues = getValuesOf(MaterialType)
