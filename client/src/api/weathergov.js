const BASE_URL = "https://api.weather.gov";

const fetchPointMetadata = async ({ latitude, longitude }) => {
  // look up weather.gov location based on lat/lon
  const locationResponse = await fetch(
    `${BASE_URL}/points/${latitude},${longitude}`
  );
  const data = await locationResponse.json();
  console.log("/points returned data:", data);
  return data;
};

const fetchHourlyForecast = async ({ metadataResponse }) =>
  // { transform = () => {} }
  {
    // follow redirect to hourly forecast endpoint
    const hourlyForecastEndpoint = metadataResponse?.properties.forecastHourly;
    if (!hourlyForecastEndpoint) {
      throw new Error("weather.gov /points unexpected repsonse:", data);
    }

    const response = await fetch(hourlyForecastEndpoint);
    return response.json();
    // return transform(data); // TODO: would be nice to have this
  };

const fetchGridForecast = async ({ metadataResponse }) => {
  const gridForecastEndpoint = metadataResponse?.properties.forecastGridData;
  if (!gridForecastEndpoint) {
    throw new Error("weather.gov /points unexpected repsonse:", data);
  }

  const response = await fetch(gridForecastEndpoint);
  return response.json();
};

export { fetchHourlyForecast, fetchGridForecast, fetchPointMetadata };
