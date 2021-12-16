"use strict";
const path = require("path");

const { readStorage, writeStorage } = require("./readWrite");

const { jsonStorageFile, adapterFile } = require("./superHeroConfig.json");

//Path as a parameter to our function

const jsonFilePath = path.join(__dirname, jsonStorageFile);
const { adapt } = require(path.join(__dirname, adapterFile));

// getting all superheroes from database
async function getAllSuperHeroes() {
  return readStorage(jsonFilePath);
}

//get one superhero with specific id
async function getOneSuperHero(id) {
  const storage = await readStorage(jsonFilePath);
  return storage.find((superhero) => superhero.id == id) || null;
}

//insert new superhero (object)
async function addSuperHero(newsuperhero) {
  const storage = await readStorage(jsonFilePath);
  storage.push(adapt(newsuperhero));
  return await writeStorage(jsonFilePath, storage);
}

//upadte superhero by matching id

async function updateSuperHero(updatedObject) {
  const storage = await readStorage(jsonFilePath);
  const oldsuperhero = storage.find(
    (superhero) => superhero.id == updatedObject.id
  );
  if (oldsuperhero) {
    Object.assign(oldsuperhero, adapt(updatedObject));
    return await writeStorage(jsonFilePath, storage);
  }
  return false;
}

//remove specific superhero
async function removeSuperHero(id) {
  const storage = await readStorage(jsonFilePath);
  const index = storage.findIndex((superhero) => superhero.id == id);
  if (index < 0) return false;
  //starting from index remove 1 item
  storage.splice(index, 1);
  return await writeStorage(jsonFilePath, storage);
}

module.exports = {
  getAllSuperHeroes,
  getOneSuperHero,
  addSuperHero,
  updateSuperHero,
  removeSuperHero,
};
