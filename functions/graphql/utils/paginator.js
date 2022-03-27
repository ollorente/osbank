// @ts-check
const paginator = (l, p) => {
  const limit = l ? Number(l) : 100;
  const page = p > 0 ? Number(p - 1) * l : 0;

  return {
    limit,
    page,
  };
};

module.exports = paginator;
