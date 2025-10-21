export type WeatherResponse = {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  current_units: {
    time: Date;
    temperature_2m: string;
    apparent_temperature: string;
    wind_speed_10m: string;
    wind_direction_10m: number;
    weather_code: number;
  };
  daily_units: {
    sunrise: string;
    sunset: string;
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
};

export type WeatherIconType = {
  icon: string;
  color: string;
};

export type GeoCodingResponse = {
  lat: string;
  lon: string;
  display_name: string;
};
