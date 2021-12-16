"use strict";

function adapt(item) {
  return Object.assign(item, {
    id: +item.id,
    yearOfBirth: +item.yearOfBirth,
  });
}
module.exports = { adapt };
