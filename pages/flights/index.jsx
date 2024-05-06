import { useState, useEffect } from "react";

import { Spinner } from "components";
import { Layout } from "components/tickets";
import { ticketsService, flightsService } from "services";

export default Index;

function Index() {
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    ticketsService.getFlights().then((x) => setTickets(x));
  }, []);

  const checkin = () => {
    flightsService.setFlights().then((y) => console.log(y));
  };

  return (
    <Layout>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Name</th>
            <th style={{ width: "10%" }}>PNR</th>
            <th style={{ width: "10%" }}>Airline</th>
            <th style={{ width: "10%" }}>Date</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {tickets &&
            tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.name}</td>
                <td>{ticket.bookingCode}</td>
                <td>{ticket.flight}</td>
                <td>{ticket.dates}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => checkin(ticket.id)}
                    className="btn btn-sm btn-primary"
                    hidden={ticket.isFlight}
                  >
                    <i className="fa fa-plane"></i>
                    &nbsp;Check In
                  </button>
                </td>
              </tr>
            ))}
          {!tickets && (
            <tr>
              <td colSpan="5">
                <Spinner />
              </td>
            </tr>
          )}
          {tickets && !tickets.length && (
            <tr>
              <td colSpan="5" className="text-center">
                <div className="p-2">No flights in next 2 days</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
}
