const ID = crypto.randomUUID();

const Total = (db) => {
  return {
    id: String(db.id ? db.id : ID),
    total: Number(db.total ? db.total : 0),
    estimate: Number(db.estimate ? db.estimate : 0),
    expense: Number(db.expense ? db.expense : 0),
    userId: String(db.userId ? db.userId : ""),
  };
};

export default Total;