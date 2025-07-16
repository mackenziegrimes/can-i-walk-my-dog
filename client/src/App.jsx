import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocationOutlined";

import WeatherForecast from "./components/WeatherForecast";
import "./App.css";

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
      <div
        className="card"
        style={{ width: "100%", border: "1px solid black" }}
      >
        {/* TODO: support entering lat/lon or choosing on map */}
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
