const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors')
const validator = require("validator");

let MessageSchema = require('./models/message');

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/'));

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false  }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));


// Routes
app.route("/api/save-email").post((req,res)=>{
  console.log(req.body);
      MessageSchema.create({name: req.body.name,email: req.body.email})
      .then((data)=>{
        res.json(data);
      })
})

app.route("/api/valid-email").post((req,res)=>{
  console.log(req.body);
  MessageSchema.findOne({email: req.body.email})
  .then((check)=>{
    if(check){
      console.log("dd")
      res.json({email:"error"})
    }
    else{
      if(validator.isEmail(req.body.email))
      res.json({email: "ok"});
      else
      res.json({email: "noValid"});
    }
  })
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
