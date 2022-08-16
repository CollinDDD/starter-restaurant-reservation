import React from "react"

function TablesView({tables}) {
    return (
        <div>
            {tables[0] ? 
            <table className="table">
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Occupied?</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map((table, index) => {
                    const {table_id, table_name, capacity, reservation_id} = table
                    return (
                        <tr key={table_id}>
                            <td>
                                <p>{table_name}</p>
                            </td>
                            <td>
                                <p>{capacity}</p>
                            </td>
                            <td>
                                <p>{reservation_id ? "Occupied" : "Free"}</p>
                            </td>
                        </tr>
                    )
                    })}
                </tbody>
            </table>
            : <p>No tables</p> }
        </div>
    )
}

export default TablesView;