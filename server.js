const express = require("express");
const axios = require("axios");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, "public"))); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.set('view engine', 'ejs'); 


app.get("/", (req, res) => {
  res.render('form.ejs') 
});


app.post("/predict", async (req, res) => {
    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log(data);
        res.render("result", { prediction: data.prediction }); 
    } catch (error) {
        res.status(500).send("Error predicting crop");
    }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
