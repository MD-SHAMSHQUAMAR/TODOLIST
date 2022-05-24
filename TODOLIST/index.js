const bodyParser = require("body-parser");
const express = require ("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL);

//  mongoose.connect(
//     "mongodb+srv://shams:shams@cluster0.fqdtn.mongodb.net/Todo?retryWrites=true&w=majority"
//     );




var urlEncodedParser = bodyParser.urlencoded({ extended: true});
const port = process.env.PORT || 3000;
app.use(urlEncodedParser);

app.set("view engine","ejs");

app.use(express.static("public"));

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
  });
  
  const Task = mongoose.model("Task", taskSchema);
  

  app.get("/", function (req,res){
   // res.render("todo");
   Task.find({}, function (err,data) {
     if(err) {
       console.log(err);
     } else {
       res.render("todo", { tasks: data});
     }
   });
});


  app.post("/", function (req, res) {
      console.log(req.body);
       const task = new Task({
         title: req.body.title,
         description: req.body.description,
  });

  task.save((err,task) => {
      if(err) {
        //   res.redirect("error");
        console.log(err);
      } else {
          res.redirect("/");
      }
   });
});

app.get("/edit/:id",function (req,res) {       // edit ka code h 
  var id = req.params.id;

  Task.find({}, function (err,data) {
    if(err) {
      console.log(err);
    } else {
      res.render("edit", { tasks: data,id: id});
    }
  
  });
});    // yahan tk

app.get("/edit/:id",function (req,res) {
     var id = req.params.id;

     Task.find({}, function (err,data) {
         if (err) {
           console.log(err);
         } else {
           res.render("edit", {tasks: data,id: id});
         }
     });
});

app.post("/edit/:id", function (req, res) {
  var id = req.params.id;

  Task.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      description: req.body.description,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/delete/:id", function (req, res) {
  Task.deleteOne({ _id: req.params.id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});