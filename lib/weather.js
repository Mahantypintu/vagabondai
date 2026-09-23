export async function getWeather(destination, startingLocation = "") {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=10&language=en&format=json`
  );

  if (!geoResponse.ok) {
    throw new Error("Failed to find destination location.");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Could not find the destination location.");
  }

  let location = geoData.results.find(
    (result) =>
      result.name &&
      result.name.toLowerCase() === destination.toLowerCase()
  );

  if (!location) {
    location = geoData.results[0];
  }

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
  );

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch destination weather.");
  }

  const weatherData = await weatherResponse.json();

  return {
    location: {
      name: location.name,
      country: location.country,
      admin1: location.admin1 || "",
      latitude: location.latitude,
      longitude: location.longitude
    },
    current: weatherData.current,
    daily: weatherData.daily
  };
}
