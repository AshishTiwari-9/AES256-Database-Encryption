// jshint esversion:6

const express = require ("express");
const bodyParser = require("body-parser");
var aes = require('aes-ecb');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server running on port 3000.");
});

mongoose.connect("mongodb://localhost:27017/encDB", {useNewUrlParser: true});

const enc_schema = new mongoose.Schema({name: String, email: String, regno: String});
const Record = mongoose.model("Record", enc_schema);
var keyString = '-KaPdSgVkYp3s6v8y/B?E(H+MbQeThWm';      // Encryption and Decryption key for AES-256


// Adding data to the database
app.post("/", function(req, res) {
  var encryptedName = aes.encrypt(keyString, req.body.name);
  var encryptedEmail = aes.encrypt(keyString, req.body.email);
  var encryptedRegno = aes.encrypt(keyString, req.body.regno);

  const doc = new Record ({name: encryptedName, email: encryptedEmail, regno: encryptedRegno});
  doc.save();

  res.send('<p> Form successfully submitted. </p>');
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


// Reading data from the database
app.get("/read_data", function(req, res) {
  res.write('<p> Data stored in the database encDB: </p>');
  Record.find(function(err, items){
  	if (err) {
  		console.log(err);
  	} else {
  		items.forEach(function(item) {
        res.write('<p> -------------------------------------------------------------------------------------------- </p>');
        res.write('<p> Encrypted name: ' + item.name + '</p>');
  			res.write('<p> Decrypted name: ' + aes.decrypt(keyString, item.name) + '</p>');
        res.write('<p> Encrypted email: ' + item.email + '</p>');
  			res.write('<p> Decrypted email: ' + aes.decrypt(keyString, item.email) + '</p>');
        res.write('<p> Encrypted registration number: ' + item.regno + '</p>');
  			res.write('<p> Decrypted registration number: ' + aes.decrypt(keyString, item.regno) + '</p>');
        res.write('<p> -------------------------------------------------------------------------------------------- </p>');
  		});
      // console.log(items);
      res.end();
  	}
  });
});


// Updating data in the database
app.post("/update_data", function(req, res) {
  var encOld_regno = aes.encrypt(keyString, req.body.old_regno);
  var new_regno = req.body.new_regno;
  var new_email = req.body.new_email;
  var new_name = req.body.new_name;

  Record.updateOne({regno: encOld_regno}, {name: aes.encrypt(keyString, new_name),
    email: aes.encrypt(keyString, new_email), regno: aes.encrypt(keyString, new_regno)}, function(err) {
      if(err) {
        console.log(err);
      } else {
        res.send('<p> Data successfully updated in the database. </p>');
      }
    });
});

app.get("/update_details", function(req, res) {
  res.sendFile(__dirname + "/public/update_details.html");
});


// Deleting data from the database
app.post("/delete_data", function(req, res) {
  var del_regno = aes.encrypt(keyString, req.body.del_regno);

  Record.deleteOne({regno: del_regno}, function(err) {
    if(err) {
      console.log(err);
    } else {
      res.send('<p> Data successfully deleted in the database. </p>');
    }
  });
});

app.get("/delete_details", function(req, res) {
  res.sendFile(__dirname + "/public/delete_details.html");
});
