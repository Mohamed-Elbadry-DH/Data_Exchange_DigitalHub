/** Official P0 function surface — not "everything Formualizer can do". */
export const FORMULA_PROFILE = "P0-v1";

export const P0_FUNCTIONS = new Set([
  "SUM",
  "AVERAGE",
  "MIN",
  "MAX",
  "COUNT",
  "ROUND",
  "ABS",
  "IF",
  "IFERROR",
]);

export const P0_OPERATORS = new Set(["+", "-", "*", "/", "%", "^", "&", "=", "<>", "<", ">", "<=", ">="]);
