const convertToImperial = (value, inputUnits) => {
  switch (inputUnits) {
    case "wmoUnit:degC": {
      // convert Celsius to Fahrenheit
      return value * (9 / 5) + 32;
    }
    default: {
      throw new Error("Unit not recognized:", inputUnits);
    }
  }
};

export { convertToImperial };
