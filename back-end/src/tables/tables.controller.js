const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")
const {bodyDataHas} = require("../utils/middleware")
const reservationsService = require("../reservations/reservations.service")

async function list(req, res) {
    const data = await service.list();
    res.json({data});
}

async function tableExists(req, res, next) {
    const table = await service.read(req.params.table_id);
    if (table) {
        res.locals.table = table
        return next();
    } else {
        return next({
            status: 404,
            message: `Table cannot be found: ${req.params.table_id}`
        })
    }
}

async function reservationExists(req, res, next) {
    if (!req.body.data) {
        return next({
            status: 400,
            message: `Must include reservation_id in request body.`
        })
    }
    const {reservation_id} = req.body.data
    if (!reservation_id) {
        return next({
            status: 400,
            message: `Must include reservation_id in request body.`
        })
    }
    const reservation = await reservationsService.read(reservation_id)
    if (reservation) {
        res.locals.reservation = reservation
        return next();
    } else {
        return next({
            status: 404,
            message: `Reservation cannot be found: ${reservation_id}`
        })
    }
}

function capacityIsValidNumber(req, res, next){
    let { data: { capacity }  = {} } = req.body;

    if (capacity <= 0 || !Number.isInteger(capacity)){
        return next({
            status: 400,
            message: `Table must have a value for capacity that is an integer greater than 0.`
        });
    }
    next();
}

function tableNameIsValid(req, res, next) {
    let {data: {table_name} = {}} = req.body;

    if (table_name.length < 2) {
        return next({
            status: 400,
            message: `table_name must be at least 2 characters long.`
        });
    }
    next()
}

async function tableCapacity(req, res, next) {
    const {capacity} = res.locals.table;
    const {people} = res.locals.reservation
    
    if (people > capacity) {
        return next({
            status: 400,
            message: `Reservation has ${people} people which is greater than the table capacity ${capacity}`
        })
    }
    next()
}

function tableAlreadyOccupied(req, res, next) {
    const {reservation_id} = res.locals.table;

    if (reservation_id) {
        return next({
            status: 400,
            message: `Table already occupied. Choose another.`
        })
    }
    next()
}

async function create(req, res, next) {
    const body = req.body.data; 
    const data = await service.create(body);
    res.status(201).json({data});
}

async function update(req, res) {
    const updatedTable = {
        ...res.locals.table,
        reservation_id: req.body.data.reservation_id
    }

    const data = await service.update(updatedTable)
    res.json({data})
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("capacity"),
        capacityIsValidNumber,
        tableNameIsValid,
        asyncErrorBoundary(create),
    ],
    update: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableCapacity),
        tableAlreadyOccupied,
        asyncErrorBoundary(update)
    ]
}