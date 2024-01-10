async function create(req, res, next) {
  const {data: {first_name, last_name, mobile_number, reservation_date, reservation_time, people} = {} } = req.body;
  const newReservation = {
    id: id+1,
    first_name: first_name,
    last_name: last_name,
    mobile_number: mobile_number,
    reservation_date: reservation_date,
    reservation_time: reservation_time,
    people: people,
  };
  res.status(201).json({ data: newReservation});
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list,
  create,
};
