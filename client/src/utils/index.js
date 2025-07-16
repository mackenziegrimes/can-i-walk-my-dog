const getDayOfWeek = (date) => {
  return ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
};

export { getDayOfWeek };
