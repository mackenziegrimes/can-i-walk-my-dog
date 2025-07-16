import { useEffect, useState } from "react";

import { Button, Icon } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocationOutlined";

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
      <div className="card">
        <Button
          variant="contained"
          onClick={handleLocationClick}
          startIcon={<MyLocationIcon />}
        >
          Use my location
        </Button>
      </div>
    </>
  );
}

export default App;
