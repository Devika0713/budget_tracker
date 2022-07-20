//To create a server:
// Create a server.js file in a directory 
// do npm init in the directory such that server.js should be the entry point
//npm is set up
//type npm install express to install express
//to run nodemon use npx nodemon inside the proper directory ie the directory having server.js

//first command-require express
const express = require("express");
//to join path os dirname and public
const path = require("path");
//function that represents express module
const app =express();

//built in middleware to run static files on express server
app.use(express.static(path.join(__dirname,'public')));
console.log(__dirname);
app.get('/',(req,res)=>{
    res.send("Server is running");
})

app.listen(3000,()=>{
    console.log("Listening to server 3000");
});
