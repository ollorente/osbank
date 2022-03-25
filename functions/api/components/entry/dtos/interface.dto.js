// @ts-check
const { UserDTO } = require("../../user");

module.exports = (db) => {
  return {
    id: String(db.id),
    amount: Number(db.amount ? db.amount : 0),
    detail: String(db.detail ? db.detail : ""),
    monthId: String(db.monthId ? db.monthId : ""),
    year: Number(db.year ? db.year : new Date().getFullYear()),
    userId: UserDTO.Interface(db.userId),
    isActive: Boolean(db.isActive),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
};
