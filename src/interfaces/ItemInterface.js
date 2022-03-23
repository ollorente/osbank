const ID = crypto.randomUUID();
const DATE = new Date();

const Item = (db) => {
  return {
    id: String(db.id ? db.id : ID),
    name: String(db.name ? db.name : ""),
    icon: String(db.icon ? db.icon : ""),
    userId: String(db.userId ? db.userId : ""),
    isActive: Boolean(db.isActive ? db.isActive : true),
    createdAt: db.createdAt ? db.createdAt : DATE,
    updatedAt: db.updatedAt ? db.updatedAt : DATE,
  };
};

export default Item;
