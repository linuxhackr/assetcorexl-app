const {schema} = require('normalizr');

export const system = new schema.Entity('systems')
export const location = new schema.Entity('locations')
export const asset = new schema.Entity('assets')
export const assetType = new schema.Entity('assetTypes')