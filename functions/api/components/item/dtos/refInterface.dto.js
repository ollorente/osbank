module.exports = (db) => {
  return {
    id: String(db._id),
    name: String(db.name ? db.name : ""),
    icon: String(db.icon ? db.icon : ""),
    createdAt: db.createdAt,
  };
};
