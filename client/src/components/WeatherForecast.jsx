import { useState, useEffect, useMemo } from "react";

import Meteogram from "./Meteogram";
import {
  fetchPointMetadata,
  fetchHourlyForecast,
  fetchGridForecast,
} from "../api/weathergov";
import {
  durationStringToSeconds,
  // getDayOfWeek,
  getMonthOfYear,
} from "../utils/time";
import { convertToImperial } from "../utils/units";
import CurrentRecommendation from "./CurrentRecommendation";

/**
 *
 * @param {Object} props
 * @param {Object?} props.location
 * @returns
 */
function WeatherForecast({ location }) {
  const [forecastData, setForecastData] = useState({ uom: null, values: [] });
  const [issuedAt, setIssuedAt] = useState();

  // fetch hourly weather forecast from weather.gov
  // TODO: a useEffect here is bad
  useEffect(() => {
    if (!location) {
      return;
    }

    const getForecast = async () => {
      const { latitude, longitude } = location;

      try {
        const metadataResponse = await fetchPointMetadata({
          latitude,
          longitude,
        });
        const gridForecast = await fetchGridForecast({ metadataResponse });
        // TODO: make this an object to support multiple weather variables
        setForecastData(gridForecast?.properties.apparentTemperature);

        // Not using the hourly forecast; its response is too brief. We need pure grid data
        // const response = await fetchHourlyForecast({ metadataResponse })
        // setPointData(response?.properties.periods);

        setIssuedAt(gridForecast?.properties.updateTime);
      } catch (err) {
        console.error("Failed to forecast from weather.gov:", err);
      }
    };
    getForecast();
  }, [location]);

  // "Post-processing" to transform original Weather.gov API response into points on a line graph
  const data = useMemo(() => {
    if (!forecastData) {
      return null;
    }

    // transform weird NWS duration time formatting into 1-hour, instantaneous points
    const forecastDataByHour = [];
    forecastData.values.forEach((datapoint) => {
      const [startDateString, durationString] = datapoint.validTime.split("/");
      const durationMs = durationStringToSeconds(durationString);
      const startDateMs = Date.parse(startDateString).valueOf();
      const endDate = new Date(startDateMs + durationMs);

      let currentDatetime = startDateMs;
      while (currentDatetime < endDate) {
        forecastDataByHour.push({
          time: currentDatetime,
          value: datapoint.value,
          units: forecastData.uom,
        });
        currentDatetime += 60 * 60 * 1000; // advance 1 hour
      }
    });

    // console.log("built forecastDataByHour:", forecastDataByHour);

    const meteogramData = forecastDataByHour.map((point) => ({
      time: point.time,
      apparentTemperature: convertToImperial(point.value, point.units),
      // temperatureUnits: point.temperatureUnits,
    }));
    return meteogramData.slice(0, 100); // only show first 100 hours for now
  }, [forecastData]);
  console.log("Data:", data);

  const currentConditions = useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }
    // HACK: finds forecast validDt closest to current time. We should keep using forecast point until its endDt
    // TODO: timer should update every 5-10 minutes while the page is rendered
    const currentTime = new Date();
    const distanceInTime = data.map((point) =>
      Math.abs(point.time - currentTime.valueOf())
    );
    const smallestTimeDifference = Math.min(...distanceInTime);

    // HACK: this is delicate. We are id'ing the relevant validDt based on how far it is from now()
    const latestForecast = data.filter(
      (point) =>
        Math.abs(point.time - currentTime.valueOf()) === smallestTimeDifference
    );
    return latestForecast[0];
  }, [data]);

  const issueDt = issuedAt ? new Date(Date.parse(issuedAt)) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {data && data.length > 0 && (
        <CurrentRecommendation currentData={currentConditions} />
      )}
      {data && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Forecast</h2>
          <Meteogram data={data} />
          {/*
          // <List>
          //   {pointData.map((point) => {
          //     const startDt = new Date(Date.parse(point.startTime));
          //     const dayOfWeek = getDayOfWeek(startDt);
          //     const startDtString = `${dayOfWeek} ${startDt.getDate()} ${startDt.getHours()}`;

          //     return (
          //         <ListItem key={point.startDt}>
          //           <div
          //             style={{
          //               display: "flex",
          //               flexDirection: "row",
          //               gap: "4px",
          //             }}
          //           >
          //             <p>{startDtString}</p>
          //             <div
          //               style={{
          //                 display: "flex",
          //                 flexDirection: "row",
          //                 gap: "2px",
          //               }}
          //             >
          //               <p style={{ fontWeight: "bold" }}>{point.temperature}</p>
          //               <p>{point.temperatureUnit}</p>
          //             </div>
          //           </div>
          //         </ListItem>
          //     );
          //   })}
          // </List>
          */}
        </div>
      )}
      {issueDt && (
        <p style={{ fontSize: "sm" }}>
          Last updated:{" "}
          {`${getMonthOfYear(
            issueDt
          )} ${issueDt.getDate()} at ${issueDt.toLocaleTimeString()}`}
        </p>
      )}
    </div>
  );
}

export default WeatherForecast;
