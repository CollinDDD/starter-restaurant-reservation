const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./reservations.service")

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  let {date} = req.query
  if (!date) {
    todayDate = new Date();
    date = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${todayDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
  }

  const data = await service.listForDate(date);

  res.json({
    data
  });
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

function peopleIsValidNumber(req, res, next){
  let { data: { people }  = {} } = req.body;
  people = Number(people);
  if (people <= 0 || !Number.isInteger(people)){
      return next({
          status: 400,
          message: `Reservation must have a value for people that is an integer greater than 0`
      });
  }
  next();
}

function dateIsValidDate(req, res, next) {
  const {data: {reservation_date, reservation_time} = {}} = req.body;
  const date = new Date(reservation_date + "T" + reservation_time)
  const now = new Date()
  if (!Date.parse(reservation_date)) {
    return next({
      status: 400,
      message: `Reservation must have a valid reservation_date`
    });
  } else if (date.getDay() === 2 && date < now) {
    return next({
      status: 400,
      message: `Periodic Tables is closed on Tuesdays. Reservations also must be made in the future. Please choose a different date and time.`
    })
  } else if (date.getDay() === 2) {
    return next({
      status: 400,
      message: `Periodic Tables is closed on Tuesdays. Please choose a different date and time.`
    })
  } else if (date < now) {
    return next({
      status: 400,
      message: `Reservations must be made in the future. Please choose a different date and time.`
    })
  } else {
    next()
  }
  
}

function timeIsValidTime(req, res, next) {
  const {data: {reservation_time} = {}} = req.body;
  const time = reservation_time.split(":")
  const hour = Number(time[0]);
  const minutes = Number(time[1]);
  if (!hour || !minutes || hour > 24 || hour < 0 || minutes > 59 || minutes < 0) {
    return next({
      status: 400,
      message: `Reservation must have a valid reservation_time`
    });
  } else if (reservation_time < "10:30") {
    return next({
      status: 400,
      message: `Reservation cannot be before 10:30 AM.`
    });
  } else if (reservation_time > "21:30") {
    return next({
      status: 400,
      message: `Reservation cannot be after 9:30 PM.`
    })
  }
  next()
}

async function create(req, res) {
  const body = req.body.data;
  body.people = Number(body.people)
  const data = await service.create(body);
  res.status(201).json({data});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"), 
    bodyDataHas("last_name"), 
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    peopleIsValidNumber,
    dateIsValidDate,
    timeIsValidTime,
    asyncErrorBoundary(create),
  ]
};
