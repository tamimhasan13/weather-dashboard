import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../context";
const useWeather = () => {
  const [weatherData, setWeatherData] = useState({
    location: "",
    climate: "",
    temperature: "",
    maxTemperature: "",
    minTemperature: "",
    humidity: "",
    cloudPercentage: "",
    wind: "",
    time: "",
    longitude: "",
    latitude: "",
  });
  const [loading, setLoading] = useState({
    state: false,
    message: "",
  });
  const [error, setError] = useState(null);
  const { selectedLocation } = useContext(LocationContext);
  console.log(selectedLocation);
  const fetchWeatherData = async (longitude, latitude) => {
    try {
      setLoading({
        ...loading,
        state: true,
        message: "Fetching weather data...",
      });
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_WEATHER_API_KAY}&units=metric`,
      );
      if (!response.ok) {
        const errorMessage = `Fetching weather Data failed: ${response.status}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      const updateWeatherData = {
        ...weatherData,
        location: data?.name,
        climate: data?.weather[0]?.main,
        temperature: data?.main?.temp,
        maxTemperature: data?.main?.temp_max,
        minTemperature: data?.main?.temp_min,
        humidity: data?.main?.humidity,
        cloudPercentage: data?.clouds?.all,
        wind: data?.wind?.speed,
        time: data?.dt,
        longitude: longitude,
        latitude: latitude,
      };
      setWeatherData(updateWeatherData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading({
        ...loading,
        state: false,
        message: "",
      });
    }
  };
  useEffect(() => {
    const run = async () => {
      if (selectedLocation.latitude && selectedLocation.longitude) {
        await fetchWeatherData(
          selectedLocation.longitude,
          selectedLocation.latitude,
        );
      } else {
        setLoading({
          state: true,
          message: "Finding location...",
        });

        navigator.geolocation.getCurrentPosition((position) => {
          fetchWeatherData(position.coords.longitude, position.coords.latitude);
        });
      }
    };

    run();
  }, [selectedLocation.latitude, selectedLocation.longitude]);
  //  useEffect(() => {
  //    setLoading({
  //     //  ...loading,
  //      state: true,
  //      message: "Finding location...",
  //    });

  //    if (selectedLocation.latitude && selectedLocation.longitude) {
  //      fetchWeatherData(selectedLocation.longitude,selectedLocation.latitude);
  //    } else {
  //      navigator.geolocation.getCurrentPosition(function (position) {
  //        fetchWeatherData(position.coords.longitude,position.coords.latitude);
  //      });
  //    }
  //  }, [selectedLocation.longitude,selectedLocation.latitude]);
  return {
    weatherData,
    error,
    loading,
  };
};

export default useWeather;
