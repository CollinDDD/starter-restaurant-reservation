import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {listTables, seatReservation} from "../utils/api"

function ReservationSeat() {
    const {reservation_id} = useParams()

    const history = useHistory();

    
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null)

    useEffect(loadTables, [reservation_id]);

    function loadTables() {
        const abortController = new AbortController();
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError)
        return () => abortController.abort();
    }

    const [tableId, setTableId] = useState(1)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await seatReservation(tableId, {data: {reservation_id}}, abortController.signal)
            history.push(`/dashboard`)
        } catch (error) {
            setTablesError(error)
        }
        return () => abortController.abort();
    }

    return (
        <main>
            <h1>Seat Reservation</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <select name="table_id" value={tableId} onChange={((event) => setTableId(event.target.value))}>
                        {tables.map(table => {
                            return (
                                <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                            )
                        })}
                    </select>
                </label>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
            </form>
            <ErrorAlert error={tablesError} />
        </main>
    )
}

export default ReservationSeat;