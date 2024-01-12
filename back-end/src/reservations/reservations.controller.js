const reservationsService = require("./reservations.service.js");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name", 
  "last_name", 
  "mobile_number", 
  "reservation_date", 
  "reservation_time", 
  "people"
);

const VALID_PROPERTIES = [
  "first_name", 
  "last_name", 
  "mobile_number", 
  "reservation_date", 
  "reservation_time", 
  "people",
];

async function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter((field) => {
    if (!VALID_PROPERTIES.includes(field)) {
      return true;
    }

    if (field === 'reservation_date') {
      return isNaN(new Date(data[field]).getTime());
    }

    if (field === 'reservation_time') {
      const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      return !timeRegex.test(data[field]);
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



function peopleIsValidNumber(req, res, next) {
  const { data: { people } = {} } = req.body;

  if (isNaN(people) || people <= 0 || !Number.isInteger(people)) {
    return next({
      status: 400,
      message: "people must be a valid positive integer",
    });
  }

  next();
}



async function create(req, res, next) {
  reservationsService
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);

}

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const { date } = req.query;
  const reservationDate = reservationsService.list(date);
  reservationDate
    .then((data) => res.json({ data }))
    .catch(next);
  if (!reservationDate) {
    return res.json({message: `There are no reservations scheduled for ${date}.`});
  }
}


module.exports = {
  list,
  create: [hasOnlyValidProperties, hasRequiredProperties, peopleIsValidNumber, create],
};
