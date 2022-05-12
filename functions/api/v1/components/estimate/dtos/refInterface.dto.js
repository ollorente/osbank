// @ts-check
const { MonthRefInterface } = require('../../month/dtos')

module.exports = (db) => {
  return {
    id: String(db._id),
    name: String(db.name ? db.name : ''),
    amount: Number(db.amount ? db.amount : 0),
    monthId: MonthRefInterface(db.monthId),
    year: Number(db.year ? db.year : new Date().getFullYear()),
    createdAt: db.createdAt
  }
}
