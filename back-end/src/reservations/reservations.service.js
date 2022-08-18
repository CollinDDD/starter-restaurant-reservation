const knex = require("../db/connection");

function list() {
    return knex("reservations").select("*")
}

function listForDate(date) {
    return knex("reservations").select("*").whereNot({status: "finished"}).andWhere({reservation_date: date}).orderBy("reservation_time");
}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then((createdReservations) => createdReservations[0]);
}

function read(reservationId) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservationId})
        .first()
}

function update(updatedReservation) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then((updatedReservations) => updatedReservations[0])
}

module.exports = {
    list,
    listForDate,
    create,
    read,
    update,
}