// @ts-check
const { ItemRefInterface } = require('../../item/dtos')
const { MonthRefInterface } = require('../../month/dtos')
const { UserRefInterface } = require('../../user/dtos')

module.exports = (db) => {
  return {
    id: String(db._id),
    name: String(db.name ? db.name : ''),
    amount: Number(db.amount ? db.amount : 0),
    itemId: ItemRefInterface(db.itemId),
    monthId: MonthRefInterface(db.monthId),
    year: Number(db.year ? db.year : new Date().getFullYear()),
    userId: UserRefInterface(db.userId),
    isActive: Boolean(db.isActive),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt
  }
}
