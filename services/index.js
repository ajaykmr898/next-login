export * from "./alert.service";
export * from "./user.service";
export * from "./tickets.service";
export * from "./operations.service";
export function formatDate(date, format = "DB") {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return format === "DB"
    ? [year, month, day].join("-")
    : [day, month, year].join("/");
}
