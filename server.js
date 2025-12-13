const express = require('express');
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;

app.use(cors());


app.get('/', (req, res) => {
    const data = { message: 'Hello World' };
    res.json(data); 
});
app.get("/getWeather/:latitude/:longitude", async (req, res) => {
    try {
        const weatherInfo = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${req.params.latitude}&longitude=${req.params.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
        );
        const weatherData = await weatherInfo.json();
        const location=await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${req.params.latitude}&longitude=${req.params.longitude}&localityLanguage=en`);
        const locationInfo = await location.json();
        const address=`${locationInfo.city},${locationInfo.principalSubdivision},${locationInfo.countryName}`;




    

        const filtered = {
            pata:address,
            Temperature: weatherData.current.temperature_2m,
            windSpeed: weatherData.current.wind_speed_10m,
            Humidity: weatherData.current.relative_humidity_2m
        };

        res.json(filtered);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/hello",(req,res)=>{
    res.send("welcome")
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
