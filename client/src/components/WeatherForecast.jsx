import { useState, useEffect, useMemo } from "react";
import { List, ListItem } from "@mui/material";

import { fetchPointForecast } from "../api/weathergov";
import { getDayOfWeek, getMonthOfYear } from "../utils";
import Meteogram from "./Meteogram";

/**
 *
 * @param {Object} props
 * @param {Object?} props.location
 * @returns
 */
function WeatherForecast({ location }) {
  const [pointData, setPointData] = useState([]);
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
        const response = await fetchPointForecast({ latitude, longitude });
        console.log("Got response:", response);

        setPointData(response?.properties.periods);
        setIssuedAt(response?.properties.updateTime);
      } catch (err) {
        console.error("Failed to forecast from weather.gov:", err);
      }
    };
    getForecast();
  }, [location]);

  const data = useMemo(() => {
    if (!pointData) {
      return null;
    }
    const meteogramData = pointData.map((point) => ({
      time: Date.parse(point.startTime),
      temperature: point.temperature,
      temperatureUnits: point.temperatureUnits,
    }));
    return meteogramData.slice(0, 100); // only show first 100 hours for now
  }, [pointData]);
  console.log("Data:", data);

  const issueDt = issuedAt ? new Date(Date.parse(issuedAt)) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {issueDt && (
        <p>
          Last updated:{" "}
          {`${getMonthOfYear(
            issueDt
          )} ${issueDt.getDate()} at ${issueDt.toLocaleTimeString()}`}
        </p>
      )}
      {location && (
        <Meteogram data={data} />

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
      )}
    </div>
  );
}

export default WeatherForecast;
