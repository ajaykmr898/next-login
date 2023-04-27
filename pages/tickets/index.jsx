import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import { Dialog } from "primereact/dialog";
import { formatDate, ticketsService } from "../../services";
import { jsPDF } from "jspdf";
import moment from "moment";

export default Index;

function Index() {
  const [tickets, setTickets] = useState([]);
  const dt = useRef(null);
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
        let tk2 = t.paidAmount.trim() ? parseFloat(t.paidAmount) : 0;
        let tra = t.receivingAmount1.trim()
          ? parseFloat(t.receivingAmount1) +
            parseFloat(t.receivingAmount2) +
            parseFloat(t.receivingAmount3)
          : 0;
        let profit = parseFloat((tra - tk2).toFixed(2));
        return { ...t, profit, bookedOn: bkd, idP: i + 1 };
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
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    balance: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const isPositiveNumber = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return [false, 0];
    }
    str = str.replace(/^0+/, "") || "0";
    let n = parseFloat(str);
    let isOk = !isNaN(n) && /^\d*\.?\d+$/.test(n);
    return [isOk, n];
  };

  const validDate = (date) => {
    let isDate = moment(date, "DD/MM/YYYY", true).isValid();
    return isDate ? date : "";
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    let id = rowData.id;
    let toSend = "|";
    let cProfit = false;

    switch (field) {
      //case "cardNumber":
      //case "phone":
      case "paidAmount":
      case "receivingAmount1":
      case "receivingAmount2":
      case "receivingAmount3":
        let res1 = isPositiveNumber(newValue);
        if (res1[0]) {
          rowData[field] = res1[1];
          toSend = res1[1];
          cProfit = true;
        } else {
          event.preventDefault();
        }
        break;
      case "bookedOn":
        let res2 = validDate(newValue);
        if (res2 !== "") {
          rowData[field] = res2;
          toSend = res2.split("/");
          console.log(res2, toSend);
          toSend = [toSend[2], toSend[1], toSend[0]].join("-");
          console.log(toSend);
        } else {
          event.preventDefault();
        }
        break;

      default:
        if (newValue.trim().length > 0) {
          rowData[field] = newValue;
          toSend = newValue;
        } else {
          event.preventDefault();
        }
        break;
    }

    // call to update with field, toSend, id
    if (toSend !== "|") {
      setLoading(true);
      ticketsService
        .update(id, { [field]: toSend })
        .then((res) => {
          if (cProfit) {
            // recalculate profit
            let paidA = parseFloat(rowData["paidAmount"]);
            let receivedA =
              parseFloat(rowData["receivingAmount1"]) +
              parseFloat(rowData["receivingAmount2"]) +
              parseFloat(rowData["receivingAmount3"]);
            rowData["profit"] = parseFloat(receivedA - paidA).toFixed(2);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const cellEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="fa fa-file-pdf"
          className="p-button-rounded tb-btns-1 p-button-danger"
          onClick={() => downloadTicket(rowData)}
        />
        <Button
          icon="fa fa-times"
          className="p-button-rounded tb-btns-1 p-button-warning"
          onClick={() => confirmDeleteTicket(rowData)}
        />
      </>
    );
  };

  const confirmDeleteTicket = (ticket) => {
    setTicket(ticket);
    setDeleteTicketDialog(true);
  };

  const downloadTicket = (ticket) => {
    console.log(ticket);

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
    row += 5;
    doc.line(10, row, 200, row);
    doc.setFontSize(10);
    row += 10;
    doc.text("Nome: " + ticket.name, 10, row);
    row += 5;
    doc.text("Data: " + ticket.bookedOn, 10, row);
    row += 5;
    doc.text("Codice: " + ticket.bookingCode, 10, row);
    row += 5;
    doc.text("Viaggio 1: " + ticket.travel1, 10, row);
    row += 5;
    doc.text("Viaggio 2: " + ticket.travel2, 10, row);
    row += 5;
    doc.text("Biglietto: " + ticket.ticketNumber, 10, row);
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
    doc.text("Telefono: " + ticket.phone, 10, row);

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
            <label htmlFor="exampleInputEmail1">From Date</label>
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
            <label htmlFor="exampleInputEmail1">To Date</label>
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
          rowsPerPageOptions={[50, 100, 250, 500]}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          loading={loading}
          size="small"
          tableStyle={{ minWidth: "100rem" }}
          ref={dt}
          value={tickets}
          paginator
          rows={50}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "name",
            "agent",
            "bookingCode",
            "ticketNumber",
            "paymentMethod",
            "paidAmount",
            "agent",
            "receivingAmount1",
            "receivingAmount2",
            "receivingAmount3",
            "profit",
            "cardNumber",
            "bookedOn",
            "travel1",
            "travel2",
            "dates",
            "phone",
          ]}
          header={header}
          emptyMessage="No tickets found."
        >
          <Column
            header="Actions"
            body={actionBodyTemplate}
            exportable={false}
          ></Column>
          <Column field="idP" header="Id" />
          <Column
            style={{ minWidth: "15rem" }}
            field="name"
            sortable
            header="Customer"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            style={{ minWidth: "8rem" }}
            field="agent"
            sortable
            header="Agent"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="bookingCode"
            sortable
            header="Booking Code"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="ticketNumber"
            sortable
            header="Ticket Number"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column field="profit" sortable header="Profit" />
          <Column
            field="paidAmount"
            sortable
            header="Paid Amount"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="receivingAmount1"
            sortable
            header="Receiving Amount 1"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="receivingAmount2"
            sortable
            header="Receiving Amount 2"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="receivingAmount3"
            sortable
            header="Receiving Amount 3"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="paymentMethod"
            sortable
            header="Payment Method"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="cardNumber"
            sortable
            header="Card Number"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="bookedOn"
            sortable
            header="Booked On"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            style={{ minWidth: "20rem" }}
            field="travel1"
            sortable
            header="Travel 1"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            style={{ minWidth: "15rem" }}
            field="travel2"
            sortable
            header="Travel 2"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            style={{ minWidth: "15rem" }}
            field="dates"
            sortable
            header="Dates"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="phone"
            sortable
            header="Phone"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="flight"
            sortable
            header="Flight"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
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
    </Layout>
  );
}
