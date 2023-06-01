const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors());

const port = 3001;

// Where we will keep books
let books = ["hello", "no", "htisndk"];

//COnnect to MongoDB database
mongoose.Promise = global.Promise;
const user = "project";
const pass = "project"
const database = "3744project"
const url = `mongodb+srv://${user}:${pass}@${database}.od18tsj.mongodb.net/project`
mongoose.connect(url, {
useNewUrlParser: true,
useUnifiedTopology: true
});
mongoose.connection.once("open", function() {
console.log("Connection with MongoDB was successful");
});

// Configuring body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
const GoogleTrends = require("./model");

app.get('/data', (req, res) => {
    GoogleTrends.find().then(items =>{
        console.log(res.statusCode)
        return res.json(items)
        }).catch(e=>console.log(e));

});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));