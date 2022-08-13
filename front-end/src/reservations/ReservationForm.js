import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({reservationId = "", reservation = ""}) {
    const history = useHistory();

    const initialFormState = {
        reservation_id: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0
    }

    const [formData, setFormData] = useState(initialFormState)

    useEffect(() => {
        if (reservation) {
            setFormData({first_name: reservation.first_name, last_name: reservation.last_name, mobile_number: reservation.mobile_number, reservation_date: reservation.reservation_date, reservation_time: reservation.reservation_time, people: reservation.people, reservation_id: reservation.reservation_id})
        }
    }, [reservation])

    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        // reservationId ? await update : await create
        reservationId ? history.goBack() : history.push(`/dashboard?date=${formData.reservation_date}`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name" className="form-label">
                First Name
                <input id="first_name" name="first_name" type="text" className="form-control" onChange={handleChange} value={formData.first_name} />
            </label>
            <label htmlFor="last_name" className="form-label">
                Last Name
                <input id="last_name" name="last_name" type="text" className="form-control" onChange={handleChange} value={formData.last_name} />
            </label>
            <label htmlFor="mobile_number" className="form-label">
                Mobile Number
                <input id="mobile_number" name="mobile_number" type="text" className="form-control" onChange={handleChange} value={formData.mobile_number} />
            </label>
            <label htmlFor="reservation_date" className="form-label">
                Date
                <input id="reservation_date" name="reservation_date" type="date" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" className="form-control" onChange={handleChange} value={formData.reservation_date} />
            </label>
            <label htmlFor="reservation_time" className="form-label">
                Time
                <input id="reservation_time" name="reservation_time" type="time" placeholder="HH:MM" pattern="[0-9]{2}:[0-9]{2}" className="form-control" onChange={handleChange} value={formData.reservation_time} />
            </label>
            <label htmlFor="people" className="form-label">
                Number of People
                <input id="people" name="people" type="number" className="form-control" onChange={handleChange} value={formData.people}/>
            </label>
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
        </form>
    )
}

export default ReservationForm;