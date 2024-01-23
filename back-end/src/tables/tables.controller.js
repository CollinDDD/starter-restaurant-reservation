const tablesService = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "table_name", 
  "capacity"
);

const VALID_PROPERTIES = [
  "table_name", 
  "capacity"
];

async function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter((field) => {
      if (!VALID_PROPERTIES.includes(field)) {
        return true;
      }
  
      if (field === "table_name") {
        return data[field].length === 1;
      }

      if (field === "capacity") {
        return typeof data[field] !== "number" || isNaN(data[field]);
      }
  
      return false;
    });
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
  
    next();
  }


  async function create(req, res, next) {
    tablesService
      .create(req.body.data)
      .then((data) => res.status(201).json({ data }))
      .catch(next);
  }

  async function list(req, res, next) {
    res.json({ data: await tablesService.list() });
  }

module.exports = {
    create: [ 
        asyncErrorBoundary(hasRequiredProperties),
        asyncErrorBoundary(hasOnlyValidProperties),
        asyncErrorBoundary(create)
    ],
    update: [
      asyncErrorBoundary(tableExists),
      asyncErrorBoundary(reservationExists),
      asyncErrorBoundary(tableCapacity),
      tableAlreadyOccupied,
      canSeatReservation,
      asyncErrorBoundary(update)
    ],
    list: [asyncErrorBoundary(list)],
  };