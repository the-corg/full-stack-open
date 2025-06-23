import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getCurrentWeather(country.capitalInfo.latlng)
      .then((data) => setWeather(data));
  }, [country]);

  if (!weather) return;

  const weatherCode =
    weatherService.weatherCodes[weather.current.weather_code][
      weather.current.is_day === 1 ? "day" : "night"
    ];

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <div>
        <div>{weatherCode.description}</div>
        <img src={weatherCode.image} alt={weatherCode.description} />
      </div>
      <b>
        Temperature {weather.current.temperature_2m}
        {weather.current_units.temperature_2m}
      </b>
      <div>
        Feels like {weather.current.apparent_temperature}
        {weather.current_units.apparent_temperature}
      </div>
      <p>
        Relative humidity {weather.current.relative_humidity_2m}
        {weather.current_units.relative_humidity_2m}
      </p>
      <p>
        Wind {weather.current.wind_speed_10m}{" "}
        {weather.current_units.wind_speed_10m}
      </p>
    </div>
  );
};

export default Weather;
