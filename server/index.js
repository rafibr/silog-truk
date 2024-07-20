const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.VITE_SERVER_PORT || 3000;
const targetUrl =
  process.env.VITE_APP_REDASH_URL || "https://redash-e-katalog.lkpp.go.id/api";
const redashKey = process.env.VITE_APP_REDASH_API_KEY;
const path = require('path');

// Middleware untuk parsing body JSON
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));

app.use("/api", (req, res) => {
  const url = `${targetUrl}${req.url}`;
  // example: http://localhost:5000/api/queries/285/results
  const headers = {
    Authorization: `Key ${redashKey}`,
    "Content-Type": "application/json",
  };

  console.log(`Request to ${url} with method ${req.method}`);

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

app.get('/', (req, res) => {
  console.log(process.cwd() + '../dist/index.html');
  res.sendFile(process.cwd() + '/dist/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
