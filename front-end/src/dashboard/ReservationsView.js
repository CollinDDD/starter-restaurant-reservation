import React from "react"

function ReservationsView({reservations, date}) {
    return (
        <div>
            {reservations[0] ? 
            <table className="table">
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Time of Reservation</th>
                    <th>Size of Party</th>
                    <th>Seat</th>
                    {/* <th>Edit</th> */}
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation, index) => {
                    const {reservation_id, first_name, last_name, mobile_number, reservation_time, people} = reservation
                    return (
                        <tr key={reservation_id}>
                        <td>
                            <p>{first_name} {last_name}</p>
                        </td>
                        <td>
                            <p>{mobile_number}</p>
                        </td>
                        <td>
                            <p>{reservation_time}</p>
                        </td>
                        <td>
                            <p>{people}</p>
                        </td>
                        <td>
                            <a href={`/reservations/${reservation_id}/seat`}>Seat</a>
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
    )
}

export default ReservationsView;