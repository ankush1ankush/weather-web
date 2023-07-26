const express=require("express")
const app=express();
const https=require("https");
const bodyParser=require("body-parser");
const fs =require("fs");
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
})
var appId="";
fs.readFile("appid.txt","utf-8",(err,data)=>{
    if(err) throw err;
    appId=data;
})
app.post("/",function(req,res){
   var city=req.body.city;
   var country=req.body.country;
   var url=`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appId}&units=metric`
   https.get(url,function(response){
    console.log(response.statusCode); 
    // https request made to the api return 
    // the data in the form of the hexa decimal code 
    // and we need to convert into the javascript object by using json-parser
    // JSON.parse() convert string like binary,hexdecimal,text ect in to js object
    response.on("data",function(data){

        const weatherData=JSON.parse(data);
        const temp=weatherData.main.temp;
        const weatherDescription=weatherData.weather[0].description;
        const icon=weatherData.weather[0].icon;
        res.write("<h1>Weather Report</h1>");

        res.write(`<h4>Weather at ${city} is ${weatherDescription} <img src="https://openweathermap.org/img/wn/${icon}@2x.png"> and temprature is ${temp} Degree Celcius</h4>`);
        res.send();
    })

    
   })
  
})
app.listen(3000,function(){
    console.log("server is started at port 3000");
})
