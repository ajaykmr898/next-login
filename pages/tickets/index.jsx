import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";

export default Index;

function Index() {
  const [tickets, setTickets] = useState(null);
  const dt = useRef(null);
  const [deleteTicketDialog, setDeleteTicketDialog] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    let tempTickets = [
      {
        id: 1000,
        name: "James Butt",
        company: "John",
        date: "2015-09-13",
        balance: 70663,
      },
      {
        id: 10300,
        name: "fgd",
        company: "Benton, John B Jr",
        date: "2015-09-10",
        balance: 70663,
      },
      {
        id: 10010,
        name: "James Butt",
        company: "Benton, John B Jr",
        date: "2015-09-12",
        balance: 4534,
      },
    ];
    setTickets(tempTickets);
  }, []);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    balance: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
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
      <Button
        icon="fa fa-times"
        className="p-button-rounded p-button-warning"
        onClick={() => confirmDeleteTicket(rowData)}
      />
    );
  };

  const confirmDeleteTicket = (ticket) => {
    setTicket(ticket);
    setDeleteTicketDialog(true);
  };

  const hideDeleteTicketDialog = () => {
    setDeleteTicketDialog(false);
  };

  const deleteTicket = () => {
    console.log("delete", ticket);
    hideDeleteTicketDialog();
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
          ref={dt}
          value={tickets}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "company", "balance", "date"]}
          header={header}
          emptyMessage="No tickets found."
        >
          <Column
            field="name"
            sortable
            header="Name"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="company"
            sortable
            header="Company"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="balance"
            sortable
            header="Balance"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column
            field="date"
            sortable
            header="Date"
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
          <Column body={actionBodyTemplate} exportable={false}></Column>
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
