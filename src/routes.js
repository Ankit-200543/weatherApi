const express = require("express");
const router = express.Router();

router.get("/getWeather/:latitude/:longitude", async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    // Validate params
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    // API URLs
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;

    const hourlyURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&forecast_days=2`;

    const locationURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    // Fetch APIs in parallel
    const [weatherRes, hourlyRes, locationRes] = await Promise.all([
      fetch(weatherURL),
      fetch(hourlyURL),
      fetch(locationURL),
    ]);

    // Check API responses
    if (!weatherRes.ok || !locationRes.ok || !hourlyRes.ok) {
      return res.status(500).json({
        success: false,
        message: "One or more APIs failed",
      });
    }

    // Convert to JSON
    const weatherData = await weatherRes.json();
    const hourlyData = await hourlyRes.json();
    const locationData = await locationRes.json();

    // Format address
    const address = `${locationData.city}, ${locationData.principalSubdivision}, ${locationData.countryName}`;

    // Filter required data
    const filteredData = {
      address,
      temperature: weatherData.current.temperature_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      humidity: weatherData.current.relative_humidity_2m,
      hourly: hourlyData.hourly,
    };

    return res.status(200).json({
      success: true,
      message: "Weather data fetched successfully",
      data: filteredData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;