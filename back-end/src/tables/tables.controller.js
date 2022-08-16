const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")

async function list(req, res) {
    const data = await service.list();
    res.json({data});
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Reservation must include ${propertyName}` });
    };
}

function capacityIsValidNumber(req, res, next){
    let { data: { capacity }  = {} } = req.body;
    capacity = Number(capacity);
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

async function create(req, res) {
    const body = req.body.data;
    body.capacity = Number(body.capacity)
    const data = await service.create(body);
    res.status(201).json({data});
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
    
}