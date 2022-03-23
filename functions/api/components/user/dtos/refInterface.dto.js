// @ts-check
module.exports = (db) => {
  return {
    id: String(db.id),
    name: String(db.name ? db.name : ""),
    isActive: Boolean(db.isActive ? db.isActive : true),
    createdAt: db.createdAt,
  };
};
