import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocationOutlined";

import "./App.css";

import WeatherForecast from "./components/WeatherForecast";

function App() {
  // { latitude, longitude }
  const [userLocation, setUserLocation] = useState();

  useEffect(() => {
    if (!userLocation) {
      return;
    }
    console.log("Got location:", userLocation);
  }, [userLocation]);

  const handleLocationClick = (evt) => {
    navigator.geolocation.getCurrentPosition((position) =>
      setUserLocation(position.coords)
    );
  };

  return (
    <>
      <h1>Can I Walk My Dog?</h1>
      <div className="card">
        <Button
          variant="contained"
          onClick={handleLocationClick}
          startIcon={<MyLocationIcon />}
        >
          Use my location
        </Button>

        {userLocation && (
          <div style={{ display: "flex", gap: "4px", flexDirection: "row" }}>
            <p>Location:</p>
            <p>
              {userLocation.latitude}, {userLocation.longitude}
            </p>
          </div>
        )}
        <WeatherForecast location={userLocation} />
      </div>
    </>
  );
}

export default App;
