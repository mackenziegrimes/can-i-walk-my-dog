// These are stupid Date utilities that surely have a proper library somewhere
const getDayOfWeek = (date) => {
  return ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
};

const getMonthOfYear = (dt) =>
  [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][dt.getMonth()];

export { getDayOfWeek, getMonthOfYear };
