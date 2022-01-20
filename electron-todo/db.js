const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

const db = new JsonDB(new Config("myDatabase", true, false, "/"));
const entity = "/todo";

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
  const index = db.getIndex(entity, db.count(entity) + 1, "id");
  db.push(
    `${entity}[]`,
    {
      id,
      text,
    },
    true
  );
  return db.getData(`${entity}[${index}]`);
};

module.exports.deleteDB = function (id) {
  const parseId = parseInt(id);
  const index = db.getIndex(entity, parseId, "id");
  if (index >= 0) {
    db.delete(`${entity}[${index}]`);
  }
};
