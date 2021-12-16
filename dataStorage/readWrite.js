"use strict";

//fs helps to store access and manage data
const fs = require("fs").promises;

//reading json data
async function readStorage(storageFile) {
  try {
    const data = await fs.readFile(storageFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    //console.log(err.message)
    return [];
  }
}

//write modify the data in storage
async function writeStorage(storageFile, data) {
  try {
    await fs.writeFile(storageFile, JSON.stringify(data, null, 4), {
      encoding: "utf8",
      flag: "w",
    });
    return true;
  } catch (err) {
    //console.log(err.message)
    return flase;
  }
}

module.exports = { readStorage, writeStorage };
