const YEAR = new Date().getFullYear();
const ID = crypto.randomUUID();
const DATE = new Date();

const Expense = (db) => {
  return {
    id: String(db.id ? db.id : ID),
    name: String(db.name ? db.name : ""),
    amount: Number(db.amount ? db.amount : 0),
    itemId: String(db.itemId),
    monthId: String(db.monthId),
    year: Number(db.year ? db.year : YEAR),
    paid: db.paid,
    userId: String(db.userId ? db.userId : ""),
    isActive: Boolean(db.isActive ? db.isActive : true),
    createdAt: db.createdAt ? db.createdAt : DATE,
    updatedAt: db.updatedAt ? db.updatedAt : DATE,
  };
};

export default Expense;