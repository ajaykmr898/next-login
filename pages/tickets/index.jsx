import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import { Dialog } from "primereact/dialog";
import { formatDate, ticketsService } from "../../services";
import { jsPDF } from "jspdf";

export default Index;

function Index() {
  const [tickets, setTickets] = useState([]);
  const dt = useRef(null);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [deleteTicketDialog, setDeleteTicketDialog] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({ start: "", end: "" });

  useEffect(() => {
    getTickets();
  }, []);

  const getTickets = (dates = null) => {
    setLoading(true);
    let start = new Date();
    start.setMonth(start.getMonth() - 6);
    start.setDate(1);
    start = formatDate(start);
    let end = formatDate(new Date());
    if (dates) {
      start = dates.start;
      end = dates.end;
    } else {
      setDates({ start, end });
    }

    ticketsService.getAll({ start, end }).then((x) => {
      const tickets = x.map((t, i) => {
        let bkd = formatDate(t.bookedOn, "IT");
        let ra1d = t.receivingAmount1Date
          ? formatDate(t.receivingAmount1Date, "IT")
          : "";
        let ra2d = t.receivingAmount2Date
          ? formatDate(t.receivingAmount2Date, "IT")
          : "";
        let ra3d = t.receivingAmount3Date
          ? formatDate(t.receivingAmount3Date, "IT")
          : "";
        let tk2 = t.paidAmount.trim() ? parseFloat(t.paidAmount) : 0;
        let tra = t.receivingAmount1.trim()
          ? (parseFloat(t.receivingAmount1) || 0) +
            (parseFloat(t.receivingAmount2) || 0) +
            (parseFloat(t.receivingAmount3) || 0)
          : 0;
        let profit = parseFloat((tra - tk2).toFixed(2));
        return {
          ...t,
          profit,
          bookedOn: bkd,
          receivingAmount1Date: ra1d,
          receivingAmount2Date: ra2d,
          receivingAmount3Date: ra3d,
          idP: i + 1,
          receivingAmountT: tra,
        };
      });
      setTickets(tickets);
      setLoading(false);
    });
  };

  const search = () => {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    getTickets({ start, end });
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    agent: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const addNew = () => {
    Router.push("/tickets/add");
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <Button
          className="tb-btns"
          type="button"
          icon="fa fa-file-excel"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
          severity="success"
        />
        <Button
          className="tb-btns"
          type="button"
          icon="fa fa-plus"
          rounded
          onClick={() => addNew()}
          data-pr-tooltip="CSV"
          severity="primary"
        />
      </div>
    );
  };

  const header = renderHeader();

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const infoTicket = (ticket) => {
    setTicket(ticket);
    setTicketDialog(true);
  };

  const editTicket = (ticket) => {
    Router.push("/tickets/edit/" + ticket.id);
  };

  const actions = (e, ticket) => {
    switch (parseInt(e?.value?.code)) {
      case 1:
        infoTicket(ticket);
        break;
      case 2:
        downloadTicket(ticket);
        break;
      case 3:
        editTicket(ticket);
        break;
      case 4:
        confirmDeleteTicket(ticket);
        break;
      default:
        infoTicket(ticket);
        break;
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Dropdown
          onChange={(e) => actions(e, rowData)}
          options={[
            { name: "Info", code: "1" },
            { name: "PDF", code: "2" },
            { name: "Edit", code: "3" },
            { name: "Delete", code: "4" },
          ]}
          optionLabel="name"
          placeholder="Actions"
        />
      </>
    );
  };

  const confirmDeleteTicket = (ticket) => {
    setTicket(ticket);
    setDeleteTicketDialog(true);
  };

  const downloadTicket = (ticket) => {
    const imgData = "logo.png";
    const doc = new jsPDF();
    let row = 10;
    doc.addImage(imgData, "PNG", 10, 10, 40, 40);

    doc.setFontSize(20);
    row += 10;
    doc.text("Indus Viaggi", 200, row, null, null, "right");
    doc.setFontSize(10);
    row += 10;
    doc.text("Via Don Giovanni Alai, 6/A", 200, row, null, null, "right");
    row += 5;
    doc.text("42121 - Reggio Emilia", 200, row, null, null, "right");
    row += 5;
    doc.text("Tel/fax: +39 0522434627", 200, row, null, null, "right");
    row += 5;
    doc.text(
      "Cell.: +39 3889220982, +39 3802126100",
      200,
      row,
      null,
      null,
      "right"
    );
    row += 10;
    doc.line(10, row, 200, row);
    doc.setFontSize(10);
    row += 10;
    doc.text("Passeggero: " + ticket.name, 10, row);
    row += 5;
    doc.text("Data: " + ticket.bookedOn, 10, row);
    row += 5;
    doc.text("Codice prenotazione: " + ticket.bookingCode, 10, row);
    row += 5;
    doc.text("Porto di partenza: " + ticket.travel1, 10, row);
    row += 5;
    doc.text("Porto di arrivo: " + ticket.travel2, 10, row);
    row += 5;
    doc.text("Numero del biglietto: " + ticket.ticketNumber, 10, row);
    row += 5;
    doc.text(
      "Pagato: " +
        parseFloat(
          parseFloat(ticket.receivingAmount1) +
            parseFloat(ticket.receivingAmount2) +
            parseFloat(ticket.receivingAmount3)
        ).toFixed(2) +
        " EUR",
      10,
      row
    );
    row += 5;
    doc.text("Metodo di pagamento: " + ticket.paymentMethod, 10, row);
    row += 5;
    doc.text("Volo: " + ticket.flight, 10, row);
    row += 5;
    doc.text("Numero di telefono: " + ticket.phone, 10, row);

    doc.save(ticket.name.replace(/\W/g, "_") + "_" + ticket.id + ".pdf");
  };

  const hideDeleteTicketDialog = () => {
    setDeleteTicketDialog(false);
  };

  const deleteTicket = () => {
    console.log("delete", ticket);
    ticketsService.delete(ticket.id).then(() => {
      setTickets((tickets) => tickets.filter((x) => x.id !== ticket.id));
      hideDeleteTicketDialog();
    });
  };

  const deleteTicketDialogFooter = (
    <div>
      <Button
        label="No"
        icon="fa fa-times"
        className="p-button-text"
        onClick={hideDeleteTicketDialog}
      />
      <Button
        label="Yes"
        icon="fa fa-check"
        className="p-button-text"
        onClick={deleteTicket}
      />
    </div>
  );

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-sm-5">
            <label htmlFor="start">From Date:</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                id="start"
                defaultValue={dates.start}
                placeholder="From"
              />
            </div>
          </div>
          <div className="col-sm-5">
            <label htmlFor="end">To Date:</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                id="end"
                defaultValue={dates.end}
                placeholder="To"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <button
              type="submit"
              className="btn btn-block btn-primary width-search"
              onClick={() => {
                search();
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="card">
        <DataTable
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[25, 50, 100, 250, 500]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          loading={loading}
          size="small"
          tableStyle={{ minWidth: "100rem" }}
          ref={dt}
          filterDisplay="row"
          value={tickets}
          paginator
          rows={25}
          dataKey="id"
          filters={filters}
          csvSeparator=";"
          globalFilterFields={[
            "name",
            "agent",
            "bookingCode",
            "ticketNumber",
            "paymentMethod",
            "paidAmount",
            "receivingAmountT",
            "profit",
            "bookedOn",
            "phone",
          ]}
          header={header}
          emptyMessage="No tickets found."
        >
          <Column
            style={{ maxWidth: "6rem" }}
            header="Actions"
            body={actionBodyTemplate}
            exportable={false}
          ></Column>
          <Column field="idP" header="Id" />
          <Column
            style={{ maxWidth: "8rem" }}
            field="name"
            sortable
            header="Passenger Name"
          />
          <Column field="bookingCode" sortable header="PNR" />
          <Column field="ticketNumber" sortable header="Ticket Number" />
          <Column field="profit" sortable header="Profit" />
          <Column field="paidAmount" sortable header="Cost" />
          <Column field="receivingAmountT" sortable header="Total Received" />
          <Column field="paymentMethod" sortable header="Pay. Method" />
          <Column field="bookedOn" sortable header="Issue Date" />
          <Column
            filter
            style={{ maxWidth: "12rem" }}
            filterPlaceholder="Search by agent"
            field="agent"
            sortable
            header="Agent"
          />
          <Column field="agentCost" sortable header="Agent Cost" />
          <Column hidden field="phone" sortable header="Phone" />
          <Column hidden field="cardNumber" sortable header="Card Number" />
          <Column hidden field="flight" sortable header="Flight" />
          <Column hidden field="receivingAmount1" header="receivingAmount 1" />
          <Column
            hidden
            field="receivingAmount1Date"
            header="receiving Amount 1 Date"
          />
          <Column hidden field="receivingAmount2" header="receivingAmount 2" />
          <Column
            hidden
            field="receivingAmount2Date"
            header="receiving Amount 2 Date"
          />
          <Column hidden field="receivingAmount3" header="receivingAmount 3" />
          <Column
            hidden
            field="receivingAmount3Date"
            header="receiving Amount 3 Date"
          />
          <Column hidden field="travel1" header="travel 1" />
          <Column hidden field="travel2" header="travel 2" />
          <Column hidden field="dates" header="dates" />
        </DataTable>
      </div>
      <Dialog
        visible={deleteTicketDialog}
        header="Confirm"
        modal
        footer={deleteTicketDialogFooter}
        onHide={hideDeleteTicketDialog}
      >
        <div className="confirmation-content">
          <i className="fa fa-triangle mr-3" />
          {ticket && (
            <span>
              Are you sure you want to delete <b>{ticket.name}</b>&apos;s
              ticket?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={ticketDialog}
        style={{ width: "60%" }}
        header="Details"
        modal
        className="p-fluid"
        onHide={() => setTicketDialog(false)}
      >
        {ticket && (
          <table className="table">
            <tbody>
              <tr>
                <td scope="col">Passenger:</td>
                <td scope="col">{ticket.name}</td>
              </tr>
              <tr>
                <td scope="col">Agent:</td>
                <td scope="col">{ticket.agent}</td>
              </tr>
              <tr>
                <td scope="col">PNR:</td>
                <td scope="col">{ticket.bookingCode}</td>
              </tr>
              <tr>
                <td scope="col">Ticket:</td>
                <td scope="col">{ticket.ticketNumber}</td>
              </tr>
              <tr>
                <td scope="col">Payment Method:</td>
                <td scope="col">{ticket.paymentMethod}</td>
              </tr>
              <tr>
                <td scope="col">Cost:</td>
                <td scope="col">{ticket.paidAmount}</td>
              </tr>
              <tr>
                <td scope="col">Receiving Amount/Date 1</td>
                <td scope="col">
                  {ticket.receivingAmount1}
                  {ticket.receivingAmount1Date &&
                    " - " + ticket.receivingAmount1Date}
                </td>
              </tr>
              <tr>
                <td scope="col">Receiving Amount/Date 2</td>
                <td scope="col">
                  {ticket.receivingAmount2}
                  {ticket.receivingAmount2Date &&
                    " - " + ticket.receivingAmount2Date}
                </td>
              </tr>
              <tr>
                <td scope="col">Receiving Amount/Date 3</td>
                <td scope="col">
                  {ticket.receivingAmount3}
                  {ticket.receivingAmount3Date &&
                    " - " + ticket.receivingAmount3Date}
                </td>
              </tr>
              <tr>
                <td scope="col">Profit:</td>
                <td scope="col">{ticket.profit}</td>
              </tr>
              <tr>
                <td scope="col">Issue Date:</td>
                <td scope="col">{ticket.bookedOn}</td>
              </tr>
              <tr>
                <td scope="col">Travel1:</td>
                <td scope="col">{ticket.travel1}</td>
              </tr>
              <tr>
                <td scope="col">Travel2:</td>
                <td scope="col">{ticket.travel2}</td>
              </tr>
              <tr>
                <td scope="col">Dates:</td>
                <td scope="col">{ticket.dates}</td>
              </tr>
              <tr>
                <td scope="col">Phone:</td>
                <td scope="col">{ticket.phone}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Dialog>
    </Layout>
  );
}
