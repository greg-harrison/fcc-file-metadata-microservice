const express = require("express");
const pug = require("pug");
const multer = require("multer");
const middleware = require("./middleware");

const landingTemplate = pug.compileFile("templates/landing.pug");
const resultsTemplate = pug.compileFile("templates/results.pug");

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / (1024 * i)).toFixed(1)} ${sizes[i]}`;
}

app.use(middleware.malformedUrl);

app.get("/uploader", (req, res) => {
  res.status(200).send(landingTemplate());
});

app.post("/results", upload.single("file"), (req, res) => {
  let formData = req.body;
  let sizeConversion = bytesToSize(req.file.size);
  let showConversion = sizeConversion.indexOf("Bytes") === -1;
  let payload = {};

  if (!req.file) {
    res.redirect("/uploader");
  }

  payload.fileName = req.file.originalname || null;
  payload.fileSize = req.file.size || null;
  if (showConversion) {
    payload.fileSizeConverted = sizeConversion;
  }
  res.status(200).send(resultsTemplate({ payload }));
});

app.use((req, res) => {
  //Catch 404's and send them back to /uploader
  res.redirect("/uploader");
});

app.listen(8000, () => {
  console.log("listening on localhost:8000");
});
