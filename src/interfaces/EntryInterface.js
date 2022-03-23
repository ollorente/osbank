const YEAR = new Date().getFullYear();
const ID = crypto.randomUUID();
const DATE = new Date();

const Entry = (db) => {
  return {
    id: String(db.id ? db.id : ID),
    amount: Number(db.amount ? db.amount : 0),
    detail: String(db.detail ? db.detail : ""),
    monthId: String(db.monthId),
    year: Number(db.year ? db.year : YEAR),
    userId: String(db.userId ? db.userId : ""),
    isActive: Boolean(db.isActive ? db.isActive : true),
    createdAt: db.createdAt ? db.createdAt : DATE,
    updatedAt: db.updatedAt ? db.updatedAt : DATE,
  };
};

export default Entry;
