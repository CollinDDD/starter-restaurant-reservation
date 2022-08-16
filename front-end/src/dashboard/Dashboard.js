import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from 'react-router-dom'

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();
  if (query.has("date")) {
    date = query.get("date")
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function previousDay(date) {
    const previousDate = previous(date)
    history.push(`/dashboard?date=${previousDate}`)
  }

  function nextDay(date) {
    const nextDate = next(date);
    history.push(`/dashboard?date=${nextDate}`)
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        <button className="btn btn-primary" onClick={ () => previousDay(date)}>Previous Day</button>
        <button className="btn btn-primary" onClick={ () => history.push(`/dashboard?date=${today()}`)}>Today</button>
        <button className="btn btn-primary" onClick={() => nextDay(date)}>Next Day</button>
      </div>
      <div>
        {reservations[0] ? 
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Time of Reservation</th>
              <th>Size of Party</th>
              {/* <th>Edit</th> */}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => {
              return (
                <tr key={reservation.reservation_id}>
                  <td>
                    <p>{reservation.first_name} {reservation.last_name}</p>
                  </td>
                  <td>
                    <p>{reservation.mobile_number}</p>
                  </td>
                  <td>
                    <p>{reservation.reservation_time}</p>
                  </td>
                  <td>
                    <p>{reservation.people}</p>
                  </td>
                  {/* <td>
                      <button name="edit" onClick={editReservation}>Edit</button>
                  </td> */}
                </tr>
              )
            })}
          </tbody>
        </table>
        : <p>No reservations on {date}</p> }
      </div>

    </main>
  );
}

export default Dashboard;
