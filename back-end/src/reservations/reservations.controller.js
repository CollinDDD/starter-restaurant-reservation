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

    if (field === "reservation_date") {
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

async function hasValidDateAndTime(req, res, next) {
  const { data = {} } = req.body;

  for (const field of Object.keys(data)) {
    if (!VALID_PROPERTIES.includes(field)) {
      return next({
        status: 400,
        message: `Invalid field(s): ${field}`,
      });
    }

    if (field === "reservation_date") {
      const reservationDate = new Date(data[field]);
      // Check if the reservation_date is in the future
      if (reservationDate <= new Date()) {
        return next({
          status: 400,
          message: `You must choose a future date.`,
        }); // Invalid if in the past
      }
      if (reservationDate.getDay() === 1) {
        return next({
          status: 400,
          message: `The restaurant is closed on Tuesdays.`,
        });
      }
      // Check if the reservation_date is set on Tuesday
      
    }

    if (field === "reservation_time") {
      // Parse the reservation_time to get hours and minutes
      const [hours, minutes] = data[field].split(':').map(Number);

      // Check if the reservation_time is between 10:30am and 9:30pm
      if (hours < 10 || (hours === 10 && minutes < 30) || hours > 21 || (hours === 21 && minutes > 30)) {
        return next({
          status: 400,
          message: `Reservation time must be between 10:30am and 9:30pm.`,
        });
      }
    }
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

async function reservationExists (req, res, next) {
  const reservation = await reservationsService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation cannot be found: ${req.params.reservation_id}`
    });
  }
};

function read(req, res) {
  const data = res.locals.reservation;
  res.json({data})
}

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
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    asyncErrorBoundary(hasOnlyValidProperties), 
    asyncErrorBoundary(hasRequiredProperties), 
    asyncErrorBoundary(peopleIsValidNumber), 
    asyncErrorBoundary(hasValidDateAndTime), 
    asyncErrorBoundary(create)],
};
