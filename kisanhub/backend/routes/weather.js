const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/weather?city=Coimbatore
router.get('/', async (req, res) => {
  try {
    const city = req.query.city || 'Coimbatore';
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
      // Return mock data if no API key configured
      return res.json({
        success: true,
        mock: true,
        weather: {
          city,
          temp: 28,
          feels_like: 31,
          humidity: 72,
          wind_speed: 14,
          pressure: 1012,
          description: 'Partly Cloudy',
          icon: '02d',
          min_temp: 22,
          max_temp: 32,
          rain_chance: 60,
          forecast: [
            { day: 'Today', icon: '02d', temp: 28, min: 22, max: 32, rain: 60 },
            { day: 'Thu',   icon: '10d', temp: 24, min: 20, max: 27, rain: 85 },
            { day: 'Fri',   icon: '10d', temp: 23, min: 19, max: 26, rain: 80 },
            { day: 'Sat',   icon: '02d', temp: 27, min: 21, max: 30, rain: 30 },
            { day: 'Sun',   icon: '01d', temp: 31, min: 24, max: 34, rain: 10 },
            { day: 'Mon',   icon: '01d', temp: 33, min: 25, max: 36, rain: 5  },
            { day: 'Tue',   icon: '02d', temp: 30, min: 23, max: 33, rain: 25 },
          ],
          alerts: [
            { type: 'warn',  title: 'Heavy Rain Alert — Thu & Fri', message: 'Avoid pesticide spraying. Clear drainage channels by Wednesday evening.' },
            { type: 'info',  title: 'Optimal Fertilizer Window — Saturday', message: 'Post-rain soil moisture ideal for urea top-dressing. Enhanced uptake efficiency.' },
            { type: 'good',  title: 'Clear Skies Sunday–Monday', message: 'Good conditions for spraying operations and harvest readiness checks.' }
          ]
        }
      });
    }

    // Real API call
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=40`
    );

    const w = current.data;
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const dailyMap = {};
    forecast.data.list.forEach(item => {
      const d = new Date(item.dt * 1000);
      const key = days[d.getDay()];
      if (!dailyMap[key]) dailyMap[key] = { temps: [], rains: [], icon: item.weather[0].icon };
      dailyMap[key].temps.push(item.main.temp);
      dailyMap[key].rains.push(item.pop * 100);
    });
    const fc = Object.entries(dailyMap).slice(0, 7).map(([day, data]) => ({
      day,
      icon: data.icon,
      temp: Math.round(data.temps.reduce((a, b) => a + b) / data.temps.length),
      min: Math.round(Math.min(...data.temps)),
      max: Math.round(Math.max(...data.temps)),
      rain: Math.round(Math.max(...data.rains))
    }));

    res.json({
      success: true,
      weather: {
        city: w.name,
        temp: Math.round(w.main.temp),
        feels_like: Math.round(w.main.feels_like),
        humidity: w.main.humidity,
        wind_speed: Math.round(w.wind.speed * 3.6),
        pressure: w.main.pressure,
        description: w.weather[0].description,
        icon: w.weather[0].icon,
        min_temp: Math.round(w.main.temp_min),
        max_temp: Math.round(w.main.temp_max),
        rain_chance: forecast.data.list[0] ? Math.round(forecast.data.list[0].pop * 100) : 0,
        forecast: fc,
        alerts: []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Weather fetch failed: ' + err.message });
  }
});

module.exports = router;
