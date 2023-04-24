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

export default Index;

function Index() {
  const [tickets, setTickets] = useState([]);
  const dt = useRef(null);
  const [deleteTicketDialog, setDeleteTicketDialog] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketsService.getAll().then((x) => {
      const tickets = x.map((t) => {
        let bkd = formatDate(t.bookedOn, "IT");
        let tk2 = t.paidAmount.trim() ? parseFloat(t.paidAmount) : 0;
        let tra = t.receivingAmount1.trim()
          ? parseFloat(t.receivingAmount1) +
            parseFloat(t.receivingAmount2) +
            parseFloat(t.receivingAmount3)
          : 0;
        let profit = parseFloat((tra - tk2).toFixed(2));
        return { ...t, profit, bookedOn: bkd };
      });
      setTickets(tickets);
      setLoading(false);
    });
  }, []);

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

  const isPositiveInteger = (val) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
      return false;
    }

    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case "balance":
        if (isPositiveInteger(newValue)) rowData[field] = newValue;
        else event.preventDefault();
        break;

      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
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

    /*var imgData = "logo.png";
    var doc = new jsPDF();
    doc.text(20, 20, "CTS Aarchival");
    doc.addImage(imgData, "PNG", 15, 40, 180, 180);
    doc.save("two-by-four.pdf");*/
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
            field="name"
            sortable
            header="Customer"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
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
          <Column
            field="profit"
            sortable
            header="Profit"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
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
            field="travel1"
            sortable
            header="Travel 1"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="travel2"
            sortable
            header="Travel 2"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
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
          <Column
            header="Actions"
            body={actionBodyTemplate}
            exportable={false}
          ></Column>
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
