const knex = require("../db/connection");


async function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}



async function list() {
  return knex("tables")
    .select("*")
    .orderBy("table_name");
}

module.exports = {
    create,
    list,
  };