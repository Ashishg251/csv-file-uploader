const express = require("express"),
  fs = require("fs"),
  app = express(),
  multer = require("multer"),
  upload = multer({ dest: "uploads/" }),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/vdops", (error, data) => {
  if (!error) console.log("Mongo connection is created sucessfully");
});

let voterObj = {
  idNumber: String,
  name: String,
  houseNumber: String,
  age: Number,
  casteType: String,
  occupation: String,
  mobileNumber: String,
  currentResident: String,
  favorTo: String,
  wardIssues: String,
  pdId: Number,
  pcName: String,
  acId: String,
  acName: String,
  psId: Number,
  arName: String,
  psLocation: String,
  imName: String,
  fmhName: String,
  gender: String,
  casteName: String
};

const Voter = mongoose.model("Voter", voterObj);

app.post("/profile", upload.single("avatar"), function(req, res, next) {
  let lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(`uploads/${req.file.filename}`)
  });
  let voterArr = Object.keys(voterObj);
  let resultObj = {};
  lineReader
    .on("line", function(line) {
      let arr = line.split(",");
      for (let i = 0; i < voterArr.length; i++) {
        resultObj[voterArr[i]] = arr[i + 1];
      }
      const voter = new Voter(resultObj);
      voter
        .save()
        .then(success => {
          console.log("success");
        })
        .catch(error => {
          console.log("error = ", error);
        });
    })
    .on("close", () => {
      fs.unlink(`uploads/${req.file.filename}`, err => {
        if (err) throw err;
        console.log(`sucessfully deleted uploads/${req.file.filename}`);
      });
    });
  res.json("ok");
});

app.get("/", (req, res) => {
  res.json("ok");
});

app.listen(3000, (error, data) => {
  if (!error) console.log("App is sucessfullt listeningnon port number 3000");
});
