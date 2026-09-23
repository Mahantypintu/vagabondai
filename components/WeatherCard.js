export default function WeatherCard({ weather, duration }) {
  function getWeatherDescription(code) {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Light rain showers",
      81: "Moderate rain showers",
      82: "Heavy rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with heavy hail"
    };

    return weatherCodes[code] || "Variable conditions";
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        Destination weather
      </p>

      <div className="mt-4">
        <h2 className="text-2xl font-bold text-white">
          {weather.location.name}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {weather.location.country}
        </p>
      </div>

      {weather.current && (
        <div className="mt-5 rounded-2xl bg-black/20 p-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Current conditions
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <span className="text-4xl font-bold text-white">
                {Math.round(weather.current.temperature_2m)}°C
              </span>

              <p className="mt-1 text-sm text-zinc-400">
                Feels like{" "}
                {Math.round(weather.current.apparent_temperature)}°C
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-emerald-400">
                {getWeatherDescription(weather.current.weather_code)}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Wind {Math.round(weather.current.wind_speed_10m)} km/h
              </p>
            </div>
          </div>
        </div>
      )}

      {weather.daily && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Forecast
          </p>

          <div className="mt-3 space-y-2">
            {weather.daily.time
              .slice(0, duration)
              .map((date, index) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      Day {index + 1}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {getWeatherDescription(
                        weather.daily.weather_code[index]
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {Math.round(
                        weather.daily.temperature_2m_max[index]
                      )}° /{" "}
                      {Math.round(
                        weather.daily.temperature_2m_min[index]
                      )}°
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Rain{" "}
                      {weather.daily.precipitation_probability_max[index]}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}