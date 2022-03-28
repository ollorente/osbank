// @ts-check
module.exports = (db) => {
  return {
    id: String(db._id),
    name: String(db.name ? db.name : ""),
    icon: String(db.icon ? db.icon : ""),
    userId: db.userId,
    isActive: Boolean(db.isActive),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  }
};
