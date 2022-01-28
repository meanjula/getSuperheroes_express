"use strict";

const http = require("http");
const path = require("path");

const express = require("express");
const app = express();

const { host, port, storage } = require("./config.json");

const Datastorage = require(path.join(
  __dirname,
  storage.storageFolder,
  storage.dataLayer
));
const dataStorage = new Datastorage();

const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const menuPath = path.join(__dirname, "index.html");

//creating route with get and send method sends the data to browser to display.
app.get("/", (req, res) => res.sendFile(menuPath));

app.get("/all", (req, res) =>
  dataStorage
    .getAll()
    .then((data) => res.render("allSuperHero", { result: data }))
);

app.get("/getsuperhero", (req, res) => {
  res.render("getSuperHero", {
    title: "Get",
    header: "Get",
    action: "/getsuperhero",
  });
});

app.post("/getsuperhero", (req, res) => {
  if (!req.body) res.sendStatus(500);

  const superheroId = req.body.id;
  dataStorage
    .getOne(superheroId)
    .then((superhero) => res.render("superHeroResult", { result: superhero }))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/removesuperhero", (req, res) =>
  res.render("getSuperHero", {
    title: "Remove",
    header: "Remove a superhero",
    action: "/removesuperhero",
  })
);
app.post("/removesuperhero", (req, res) => {
  if (!req.body) res.sendStatus(500);

  const superheroId = req.body.id;
  dataStorage
    .remove(superheroId)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/inputform", (req, res) =>
  res.render("form", {
    title: "Add superhero",
    header: "Add a new superhero",
    action: "/insert",
    id: { value: "", readonly: "" },
    name: { value: "", readonly: "" },
    strength: { value: "", readonly: "" },
    costume: { value: "", readonly: "" },
    yearOfBirth: { value: "", readonly: "" },
  })
);

app.post("/insert", (req, res) => {
  if (!req.body) res.sendStatus(500);

  dataStorage
    .insert(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/updateform", (req, res) =>
  res.render("form", {
    title: "Update Superhero",
    header: "Update Superhero",
    action: "/updatedata",
    id: { value: "", readonly: "" }, //only id can be modified others can't modify.
    name: { value: "", readonly: "readonly" },
    strength: { value: "", readonly: "readonly" },
    costume: { value: "", readonly: "readonly" },
    yearOfBirth: { value: "", readonly: "readonly" },
  })
);

//adding id: { value: superhero.id, readonly: "readonly" },

app.post("/updatedata", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .getOne(req.body.id)
    .then((superhero) =>
      res.render("form", {
        title: "Update Superhero",
        header: "Update Superhero data",
        action: "/update",
        id: { value: superhero.id, readonly: "readonly" },
        name: { value: superhero.name, readonly: "" },
        strength: { value: superhero.strength, readonly: "" },
        costume: { value: superhero.costume, readonly: "" },
        yearOfBirth: { value: superhero.yearOfBirth, readonly: "" },
      })
    )
    .catch((error) => sendErrorPage(res, error));
});
app.post("/update", (req, res) => {
  if (!req.body) res.sendStatus(500);

  dataStorage
    .update(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

function sendErrorPage(res, error, title = "Error", header = "Error") {
  sendStatusPage(res, error, title, header);
}
function sendStatusPage(res, status, title = "Status", header = "Status") {
  res.render("statusPage", { title, header, status });
}

server.listen(port, host, () => console.log(`Serving ${host}:${port}`));
