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

/**
 * Parse an ISO-8601 Temporal Duration string into a number of milliseconds since the epoch
 * (January 1, 1970 at 00:00Z), so math can be done between it and a real Date object. This
 * millisecond duration can also be passed to the built-in `new Date()` to make a Date of it.
 *
 * @param {string} durationDatetime
 * @returns {number} Duration of time in milliseconds.
 */
const durationStringToSeconds = (durationDatetime) => {
  // constants
  const REGEX_PATTERN = /P(\d*Y)?(\d*M)?(\d*D)?T(\d*H)?(\d*M)?(\d*S)?/;
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  const TEMPORAL_PART_DEFINITIONS = [
    { identifier: "Y", durationMs: 365 * DAY_IN_MS }, // leap years are ignored
    { identifier: "M", durationMs: 30 * DAY_IN_MS }, // HACK: many months are not 30 days long
    { identifier: "D", durationMs: DAY_IN_MS },
    { identifier: "H", durationMs: 60 * 60 * 1000 },
    { identifier: "M", durationMs: 60 * 1000 },
    { identifier: "S", durationMs: 1000 },
  ];

  // use RegExp to divide duration datetime string into its substring parts
  const durationPartStrings = durationDatetime.match(REGEX_PATTERN).slice(1);

  // loop through and add all discovered parts of the duration. note each part (e.g. hours) is optional
  let totalDuration = 0;
  for (let index = 0; index < TEMPORAL_PART_DEFINITIONS.length; index += 1) {
    if (durationPartStrings[index] !== undefined) {
      const definition = TEMPORAL_PART_DEFINITIONS[index]; // look up definition
      // turn string like "10D" or "13S" into just 10 or 13
      const partValue = Number(
        durationPartStrings[index].replace(definition.identifier, "")
      );
      if (Number.isNaN(partValue)) {
        throw new Error(
          "Could not parse Temporal Duration string:",
          durationDatetime
        );
      }
      totalDuration += partValue * definition.durationMs;
    }
  }
  return totalDuration;
};

export { getDayOfWeek, getMonthOfYear, durationStringToSeconds };
