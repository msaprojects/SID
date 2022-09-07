const nows = {
  toSqlString: function () {
    return "NOW()";
  },
};
function NumberTransaction() {
  return Math.floor(Math.random() * (19999 - 9997 + 3) + 9995)
}
module.exports = {
  nows, NumberTransaction
};
