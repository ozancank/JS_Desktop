const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const db = new JsonDB(new Config("assets/myDatabase", true, false, "/"));
const entity = "/todo";

if (!db.exists(entity) || db.count(entity) === 0) db.push(entity, []);

module.exports.getListDB = function () {
  return db.getData(entity);
};

module.exports.countDB = function () {
  return db.count(entity);
};

module.exports.addDB = function (text) {
  let id = 1;
  if (db.count(entity) > 0) {
    const lastItem = db.getData(`${entity}[-1]`);
    id = lastItem.id + 1;
  }
  db.push(`${entity}[]`, { id, text }, true);
  return db.getData(`${entity}[-1]`);
};

module.exports.deleteDB = function (id) {
  const parseId = parseInt(id);
  const index = db.getIndex(entity, parseId, "id");
  if (index >= 0) {
    db.delete(`${entity}[${index}]`);
  }
};

module.exports.deleteAllDB = function () {
  db.push(entity, []);
};
