// @ts-check
module.exports = (db) => {
  return {
    id: String(db.id),
    name: String(db.name ? db.name : ""),
    email: String(db.email ? db.email : ""),
    phone: String(db.phone ? db.phone : ""),
    total: Number(db.total ? db.total : 0),
    estimate: Number(db.estimate ? db.estimate : 0),
    expense: Number(db.expense ? db.expense : 0),
    isActive: Boolean(db.isActive ? db.isActive : true),
    isLock: Boolean(db.isLock ? db.isLock : false),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
};
