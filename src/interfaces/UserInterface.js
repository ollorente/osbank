const ID = crypto.randomUUID();
const DATE = new Date();

const User = (db) => {
  return {
    id: String(db.id ? db.id : ID),
    phone: String(db.phone ? db.phone : ""),
    name: String(db.name ? db.name : ""),
    email: String(db.email ? db.email : ""),
    password: String(db.password ? db.password : ""),
    total: Number(db.total ? db.total : 0),
    estimate: Number(db.estimate ? db.estimate : 0),
    expense: Number(db.expense ? db.expense : 0),
    isActive: Boolean(db.isActive ? db.isActive : true),
    isLock: Boolean(db.isLock ? db.isLock : false),
    createdAt: String(db.createdAt ? db.createdAt : DATE),
    updatedAt: String(db.updatedAt ? db.updatedAt : DATE),
  };
};

export default User;
