const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require('fs');
var serveStatic = require('serve-static');

const app = express();
const port = process.env.SERVER_PORT || 3000;
const targetUrl =
  process.env.APP_REDASH_URL || "https://redash-e-katalog.lkpp.go.id";
const redashKey = process.env.APP_REDASH_API_KEY;
const path = require('path');

// Middleware untuk parsing body JSON
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

app.use("/api", (req, res) => {
  const url = `${targetUrl}${req.url}`;
  // example: http://localhost:5000/api/queries/285/results
  const headers = {
    Authorization: `Key ${redashKey}`,
    "Content-Type": "application/json",
  };

  console.log(`Request to ${url} with method ${req.method}; body: ${JSON.stringify(req.body)}`);


  axios({
    method: req.method,
    url,
    headers,
    data: req.body,
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.status(error.response.status).send(error.response.data);
    });
});

// data dukung
app.get("/data/data-dukung", (req, res) => {
  let rawdata = fs.readFileSync('./data/dataDukung.json');
  let dataDukung = JSON.parse(rawdata);
  res.status(200).send(dataDukung);
});

// data dukung post
app.post("/data/data-dukung", (req, res) => {
  let rawdata = fs.readFileSync('./data/dataDukung.json');
  let dataDukung = JSON.parse(rawdata);

  // replace data dukung with new data
  dataDukung = req.body;

  // write to file
  fs.writeFileSync('./data/dataDukung.json', JSON.stringify(dataDukung));

  res.status(200).send({
    message: 'Data berhasil disimpan'
  });
});

app.get('/', (req, res) => {
  console.log('GET /, ', path.join(__dirname, 'dist/index.html'));
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
