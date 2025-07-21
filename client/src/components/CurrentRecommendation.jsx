import { useState, useEffect, useMemo } from "react";

import { getDayOfWeek } from "../utils/time";

/**
 *
 * @param {Object} props
 * @param {Object?} props.data
 * @returns
 */
function CurrentRecommendation({ currentData }) {
  console.log("currentData:", currentData);
  // convert current weather condition to heat stress
  let heatStress = null;
  if (currentData?.apparentTemperature >= 90) {
    heatStress = "HIGH";
  } else if (currentData?.apparentTemperature >= 80) {
    heatStress = "MODERATE";
  } else if (currentData?.apparentTemperature) {
    heatStress = "LOW";
  }

  let recommendationString = null;
  let recommendationEmoji = "";
  let recommendationColor = "rgba(0, 0, 0)";
  if (heatStress === "HIGH") {
    recommendationString = "NO";
    recommendationEmoji = "🤒";
    recommendationColor = "rgba(255, 20, 40)";
  } else if (heatStress === "MODERATE") {
    recommendationString = "Maybe";
    recommendationEmoji = "🤔";
    recommendationColor = "rgba(200, 100, 0)";
  } else if (heatStress === "LOW") {
    recommendationString = "Sure!";
    recommendationEmoji = "😊";
    recommendationColor = "rgba(0, 200, 100)";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {recommendationString && (
        <h1 style={{ color: recommendationColor }}>
          {recommendationString} {recommendationEmoji}
        </h1>
      )}
    </div>
  );
}

export default CurrentRecommendation;
