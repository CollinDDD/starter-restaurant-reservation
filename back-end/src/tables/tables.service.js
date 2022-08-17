const knex = require("../db/connection");

function list() {
    return knex("tables").select("*").orderBy("table_name")
}

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((createdTable) => createdTable[0]);
}

function update(updatedTable) {
    return knex("tables").select("*").where({table_id: updatedTable.table_id}).update(updatedTable, "*")
}

function read(tableId) {
    return knex("tables")
        .select("*")
        .where({table_id: tableId})
        .first()
}

module.exports = {
    create,
    list,
    update,
    read,
}