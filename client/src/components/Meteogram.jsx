import { useState, useEffect, useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

import { getDayOfWeek } from "../utils";

/**
 *
 * @param {Object} props
 * @param {Object?} props.location
 * @returns
 */
function Meteogram({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <LineChart
        xAxis={[
          {
            dataKey: "time",
            valueFormatter: (value) => {
              const dt = new Date(value);
              const dayOfWeek = getDayOfWeek(dt);
              return `${dayOfWeek} ${dt.getDate()} ${dt.getHours()}:00`;
            },
            min: Math.min(...data.map((point) => point.time)),
          },
        ]}
        yAxis={[
          {
            dataKey: "temperature",
            // domainLimit: ([min, max]) => (min + 5, max + 5),
            // TODO: hard-coding a 5F spacing above and below data
            min: Math.min(...data.map((point) => point.temperature)) - 5,
            max: Math.max(...data.map((point) => point.temperature)) + 5,
          },
        ]}
        series={[
          {
            label: "Temperature",
            color: "rgb(180, 0, 0)",
            showMark: false,
            // area: true,
            // baseline: 80,
            dataKey: "temperature",
          },
        ]}
        dataset={data}
        height={300}
        width={600} // TODO: how to avoid hard-coded size
      />
    </div>
  );
}

export default Meteogram;
