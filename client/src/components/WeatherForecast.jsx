import { useState, useEffect, useMemo } from "react";

import { fetchPointForecast } from "../api/weathergov";
import { List, ListItem } from "@mui/material";
import { getDayOfWeek } from "../utils";

/**
 *
 * @param {Object} props
 * @param {Object?} props.location
 * @returns
 */
function WeatherForecast({ location }) {
  const [pointData, setPointData] = useState([]);
  const [issueDt, setIssueDt] = useState();

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
        setIssueDt(response?.properties.updateTime);
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
    return pointData.map((point) => ({
      x: Date.parse(point.startTime),
      temperature: point.temperature,
    }));
  }, [pointData]);
  console.log("Data:", data);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {issueDt && <p>Last updated: {issueDt}</p>}
      {location && (
        <List>
          {pointData.map((point) => {
            const startDt = new Date(Date.parse(point.startTime));
            const dayOfWeek = getDayOfWeek(startDt);
            const startDtString = `${dayOfWeek} ${startDt.getDate()} ${startDt.getHours()}`;

            return (
              <ListItem key={point.startDt}>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "4px" }}
                >
                  <p>{startDtString}</p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "2px",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>{point.temperature}</p>
                    <p>{point.temperatureUnit}</p>
                  </div>
                </div>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}

export default WeatherForecast;
