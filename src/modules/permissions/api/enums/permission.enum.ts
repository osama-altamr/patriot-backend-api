
export const getKeysOf = <K extends string, V>(obj: { [key in K]: V }): K[] =>
    Object.keys(obj).filter((key): key is K => Number.isNaN(Number(key)))
  
  export const getValuesOf = <K extends string, V>(obj: { [key in K]: V }): V[] =>
    getKeysOf(obj).map((key: K) => obj[key])

  export enum PermissionFeature {
    products = 'products',
    categories = 'categories',
    orders = 'orders',
    complaint = 'complaint',
    materials = 'materials',
    permissions = 'permissions',
    stages = 'stages',
    reports = 'reports',
    users  = 'users',
  }

export const permissionFeatureValues = getValuesOf(PermissionFeature)


export enum PermissionAccessType {
  admin = 'admin',
  employee = 'employee',
  driver = 'driver',
  viewer = 'viewer',
  owner = 'owner'
}

export const permissionAccessTypeValues = getValuesOf(PermissionAccessType)


