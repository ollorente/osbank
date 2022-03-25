// @ts-check
module.exports = (db) => {
  return {
    id: String(db.id),
    name: String(db.name ? db.name : ""),
    order: Number(db.order ? db.order : 1),
    start: Number(db.start ? db.start : 1),
    end: Number(db.end ? db.end : 30),
    isActive: Boolean(db.isActive),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
};
