import React, { useEffect } from "react";
import { useState } from "react";
import type {
  WeatherResponse,
  WeatherIconType,
  GeoCodingResponse,
} from "../types/weatherTypes";

function Weather() {
  const [location, setLocation] = useState<string>(() => {
    const saved: string | null | undefined = localStorage.getItem("location");
    if (saved === "") {
      return "Helsingborg";
    }
    return saved ?? "Helsingborg";
  });
  useEffect(() => {
    localStorage.setItem("location", location);
  }, [location]);

  const apiKeyGeocoding = "68cc38899a427916801981cpx7a12d7";
  const [geoData, setGeoData] = useState<GeoCodingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  useEffect(() => {
    if (!location) return;
    fetch(
      `https://geocode.maps.co/search?q=${location}&api_key=${apiKeyGeocoding}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json() as Promise<GeoCodingResponse[]>; // cast response type
      })
      .then((json) => {
        //console.log(json);
        if (json.length > 0) {
          setGeoData(json[0]); // use the first match
        } else {
          setError("No location found");
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      });
  }, [location]);

  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  // Step 2: Fetch weather once we have coordinates
  useEffect(() => {
    if (!geoData) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${geoData?.lat}&longitude=${geoData?.lon}&daily=sunrise,sunset&current=apparent_temperature,temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto&forecast_days=1&wind_speed_unit=ms`
        );
        const data: WeatherResponse = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch weather"); //do we need this line?
      }
    };
    fetchData();
  }, [geoData]);

  const iconSnow: WeatherIconType = {
    icon: "fa-regular fa-snowflake",
    color: "#9de6f0ff",
  };
  const iconCloudSun: WeatherIconType = {
    icon: "fa-solid fa-cloud-sun",
    color: "#d8c870ff",
  };
  const iconSun: WeatherIconType = {
    icon: "fa-solid fa-sun",
    color: "#ff8b2cff",
  };
  const iconCloud: WeatherIconType = {
    icon: "fa-solid fa-cloud",
    color: "#717182",
  };
  const iconFogCloud: WeatherIconType = {
    icon: "fa-solid fa-smog",
    color: "#717182",
  };
  const iconCloudShowersWater: WeatherIconType = {
    icon: "fa-solid fa-cloud-showers-water",
    color: "#2b7fff",
  };
  const iconCloudShowersHeavy: WeatherIconType = {
    icon: "fa-solid fa-cloud-showers-heavy",
    color: "#2b7fff",
  };
  const iconBolt: WeatherIconType = {
    icon: "fa-solid fa-bolt",
    color: "#e7c500ff",
  };
  const iconCloudRain: WeatherIconType = {
    icon: "fa-solid fa-cloud-rain",
    color: "#2b7fff",
  };

  function weatherCodeToText(code: number): {
    weather: string;
    icon: WeatherIconType;
  } {
    const weatherMap: Record<
      number,
      { weather: string; icon: WeatherIconType }
    > = {
      0: {
        weather: "Clear sky",
        icon: iconSun,
      },
      1: {
        weather: "Mainly clear",
        icon: iconSun,
      },
      2: {
        weather: "Partly cloudy",
        icon: iconCloudSun,
      },
      3: {
        weather: "Overcast",
        icon: iconCloud,
      },
      45: {
        weather: "Fog",
        icon: iconFogCloud,
      },
      48: {
        weather: "Depositing rime fog",
        icon: iconFogCloud,
      },
      51: {
        weather: "Drizzle: Light",
        icon: iconCloudShowersWater,
      },
      53: {
        weather: "Drizzle: Moderate",
        icon: iconCloudShowersWater,
      },
      55: {
        weather: "Drizzle: Dense",
        icon: iconCloudShowersHeavy,
      },
      56: {
        weather: "Freezing drizzle: Light",
        icon: iconCloudShowersHeavy,
      },
      57: {
        weather: "Freezing drizzle: Dense",
        icon: iconCloudShowersHeavy,
      },
      61: {
        weather: "Rain: Slight",
        icon: iconCloudRain,
      },
      63: {
        weather: "Rain: Moderate",
        icon: iconCloudRain,
      },
      65: {
        weather: "Rain: Heavy",
        icon: iconCloudRain,
      },
      66: {
        weather: "Freezing rain: Light",
        icon: iconCloudRain,
      },
      67: {
        weather: "Freezing rain: Heavy",
        icon: iconCloudRain,
      },
      71: {
        weather: "Snow fall: Slight",
        icon: iconSnow,
      },
      73: {
        weather: "Snow fall: Moderate",
        icon: iconSnow,
      },
      75: {
        weather: "Snow fall: Heavy",
        icon: iconSnow,
      },
      77: {
        weather: "Snow grains",
        icon: iconSnow,
      },
      80: {
        weather: "Rain showers: Slight",
        icon: iconCloudRain,
      },
      81: {
        weather: "Rain showers: Moderate",
        icon: iconCloudRain,
      },
      82: {
        weather: "Rain showers: Violent",
        icon: iconCloudRain,
      },
      85: {
        weather: "Snow showers: Slight",
        icon: iconSnow,
      },
      86: {
        weather: "Snow showers: Heavy",
        icon: iconSnow,
      },
      95: {
        weather: "Thunderstorm: Slight or moderate",
        icon: iconBolt,
      },
      96: {
        weather: "Thunderstorm with slight hail",
        icon: iconBolt,
      },
      99: {
        weather: "Thunderstorm with heavy hail",
        icon: iconBolt,
      },
    };

    return weatherMap[code] ?? "Unknown weather code";
  }
  return (
    <div className="weather">
      <div className="weather__main">
        <h2>Weather</h2>
        <div>
          <div>
            <input
              type="text"
              id="taskDescription"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => handleUpdateLocation(e)}
            />
          </div>
          {weather && weather.current && (
            <h1>
              <i
                className={
                  weatherCodeToText(weather.current.weather_code).icon.icon
                }
              ></i>
              {weather.current.temperature_2m}{" "}
              {weather.current_units.temperature_2m}
              <br></br>
            </h1>
          )}
        </div>
        <p>{error}</p>
      </div>
    </div>
  );
}

export default Weather;
