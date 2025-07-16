const BASE_URL = "https://api.weather.gov";

const fetchPointForecast = async ({ latitude, longitude }) =>
  // { transform = () => {} }
  {
    // look up weather.gov location based on lat/lon
    const locationResponse = await fetch(
      `${BASE_URL}/points/${latitude},${longitude}`
    );
    const data = await locationResponse.json();
    console.log("/points returned data:", data);

    // follow redirect to hourly forecast endpoint
    const hourlyForecastEndpoint = data?.properties.forecastHourly;
    if (!hourlyForecastEndpoint) {
      throw new Error("weather.gov /points unexpected repsonse:", data);
    }

    const response = await fetch(hourlyForecastEndpoint);
    return response.json();
    // return transform(data); // TODO: would be nice to have this
  };

export { fetchPointForecast };
