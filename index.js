const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.urlencoded({extended:true}))



app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
    const userInput = req.body.cityName;
    console.log(userInput);
  
    const apiKey = "90611d1d3807d6eef9a993fc4fd3feb3";
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${userInput}`;
  
    http.get(url, (response) => {
      let data = "";
  
      
      response.on("data", (chunk) => {
        data += chunk;
      });
  
      
      response.on("end", () => {
        const parseData = JSON.parse(data); 
  
        
        if (parseData.error) {
          console.error(`Error: ${parseData.error.info}`);
          res.send(`Error: ${parseData.error.info}`);
        } else {
          
          console.log(`Weather in ${parseData.location.name}, ${parseData.location.country}:`);
          console.log(`Temperature: ${parseData.current.temperature}°C`);
          console.log(`Description: ${parseData.current.weather_descriptions[0]}`);
          console.log(`Wind Speed: ${parseData.current.wind_speed} km/h`);
          console.log(`Humidity: ${parseData.current.humidity}%`);
  
          
          res.write(`Weather in ${parseData.location.name}, ${parseData.location.country}: \n`);
          res.write(`Temperature: ${parseData.current.temperature}°C \n`);
          res.write(`Description: ${parseData.current.weather_descriptions[0]} \n`);
          res.write(`Wind Speed: ${parseData.current.wind_speed} km/h \n`);
          res.write(`Humidity: ${parseData.current.humidity}% \n`);
          res.end();
        }
      });
    }).on("error", (err) => {
      console.error("Error fetching data:", err.message);
      res.send("Error fetching data");
    });
  });
  
  app.listen(8001, () => console.log("Server is running at port 8001"));