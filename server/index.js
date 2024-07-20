const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.VITE_SERVER_PORT || 3001;
const targetUrl =
  process.env.VITE_APP_REDASH_URL || "https://redash-e-katalog.lkpp.go.id";
const redashKey = process.env.VITE_APP_REDASH_API_KEY;

// Middleware untuk parsing body JSON
app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
  const url = `${targetUrl}${req.url}`;
  // example: http://localhost:5000/api/queries/285/results
  const headers = {
    Authorization: `Key ${redashKey}`,
    "Content-Type": "application/json",
  };

  console.log(`Request to ${url}`);

  axios({
    method: req.method,
    url,
    headers,
    data: req.body,
  })
    .then((response) => {
      axios({
        method: req.method,
        url,
        headers,
        data: req.body,
      })
        .then((response) => {
          axios({
            method: req.method,
            url,
            headers,
            data: req.body,
          })
            .then((response) => {
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
            })
            .catch((error) => {
              res.status(error.response.status).send(error.response.data);
            });
        })
        .catch((error) => {
          res.status(error.response.status).send(error.response.data);
        });
    })
    .catch((error) => {
      res.status(error.response.status).send(error.response.data);
    });
});

// ketika rute random diakses
app.get("*", (req, res) => {
  res.send("You are trying to access an invalid route");
});

app.use(express.static("dist"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
