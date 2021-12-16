"use strict";

const { CODES, MESSAGES } = require("./statusCodes");

const {
  getAllSuperHeroes,
  getOneSuperHero,
  addSuperHero,
  updateSuperHero,
  removeSuperHero,
} = require("./supHeroStorageLayer");

module.exports = class DataStorage {
  get CODES() {
    return CODES;
  }

  getAll() {
    return getAllSuperHeroes();
  }

  getOne(id) {
    return new Promise(async (resolve, reject) => {
      if (!id) {
        reject(MESSAGES.NOT_FOUND("--empty--"));
      } else {
        const result = await getOneSuperHero(id);
        if (result) {
          resolve(result);
        } else {
          reject(MESSAGES.NOT_FOUND(id));
        }
      }
    });
  } //getOne end

  insert(superhero) {
    return new Promise(async (resolve, reject) => {
      if (superhero) {
        if (!superhero.id) {
          reject(MESSAGES.NOT_INSERTED());
        } else if (await getOneSuperHero(superhero.id)) {
          reject(MESSAGES.ALREADY_IN_USE(superhero.id));
        } else if (await addSuperHero(superhero)) {
          resolve(MESSAGES.INSERT_OK(superhero.id));
        } else {
          reject(MESSAGES.NOT_INSERTED());
        }
      } else {
        reject(MESSAGES.NOT_INSERTED());
      }
    });
  }

  update(superhero) {
    return new Promise(async (resolve, reject) => {
      if (superhero) {
        if (await updateSuperHero(superhero)) {
          resolve(MESSAGES.UPDATE_OK(superhero.id));
        } else {
          reject(MESSAGES.NOT_UPDATED());
        }
      } else {
        reject(MESSAGES.NOT_UPDATED());
      }
    });
  }

  remove(id) {
    return new Promise(async (resolve, reject) => {
      if (!id) {
        reject(MESSAGES.NOT_FOUND("---Nobody---"));
      } else if (await removeSuperHero(id)) {
        resolve(MESSAGES.REMOVE_OK(id));
      } else {
        reject(MESSAGES.NOT_REMOVED());
      }
    });
  }
};
