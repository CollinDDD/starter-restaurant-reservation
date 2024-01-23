const knex = require("../db/connection");

async function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function read (reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
};

async function list(date) {
  let query = knex("reservations").select("*");

  if (date) {
    query = query.whereRaw('CAST(reservation_date AS DATE) = ?', [date]);
  }

  return query.orderBy(['reservation_date', 'reservation_time'], 'asc');
}



module.exports = {
  list,
  create,
  read,
};