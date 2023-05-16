import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import { formatDate, ticketsService } from "../../services";

export default Index;

function Index() {
  const [tickets, setTickets] = useState([]);
  const dt = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({
    start: "",
    end: "",
    type: "",
    refund: true,
  });

  useEffect(() => {
    getTickets();
  }, []);

  const getTickets = (dates = null) => {
    setLoading(true);
    let start = new Date();
    //start.setMonth(start.getMonth() - 6);
    start.setDate(1);
    start = formatDate(start);
    let end = formatDate(new Date());
    let type = "bookedOn";
    let refund = true;
    if (dates) {
      start = dates.start;
      end = dates.end;
      type = dates.type;
    } else {
      setDates({ start, end, type, refund });
    }
    ticketsService.getAll({ start, end, type, refund }).then((tickets) => {
      setTickets([]);
      onGlobalFilterChange({ target: { value: "" } });
      setLoading(false);
    });
  };

  const search = () => {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let type = document.getElementById("type").value;
    getTickets({ start, end, type });
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const allFilters = [
    "name",
    "agent",
    "bookingCode",
    "cardNumber",
    "ticketNumber",
    "methods",
    "paidAmount",
    "receivingAmountT",
    "profit",
    "bookedOn",
    "phone",
    "iata",
    "flight",
  ];
  const [filtersA, setFiltersA] = useState(allFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const addNew = () => {
    Router.push("/seller/transfer");
  };

  const applyFilters = (e) => {
    let types = [
      "all",
      "agent",
      "bookingCode",
      "ticketNumber",
      "iata",
      "name",
      "cardNumber",
      "methods",
    ];
    let selected = parseInt(e.target.value);
    if (selected !== 0) {
      setFiltersA([types[selected]]);
    } else {
      setFiltersA(allFilters);
    }
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
        <select
          className="form-select"
          aria-label="filters"
          onChange={(e) => {
            applyFilters(e);
          }}
        >
          <option defaultValue value="0">
            All
          </option>
          <option value="1">Agent Name</option>
          <option value="2">PNR</option>
          <option value="3">Ticket Number</option>
          <option value="4">Issued By</option>
          <option value="5">Passenger Name</option>
          <option value="6">Card Number</option>
          <option value="7">Payment Methods</option>
        </select>
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

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-sm-2">
            <label htmlFor="type">Type:</label>
            <div className="input-group">
              <select id="type" className="form-select">
                <option defaultValue value="bookedOn">
                  Issue Date
                </option>
                <option value="receivingAllDates">All Amounts Dates</option>
                <option value="receivingAmount1Date">Amount 1 Date</option>
                <option value="receivingAmount2Date">Amount 2 Date</option>
                <option value="receivingAmount3Date">Amount 3 Date</option>
              </select>
            </div>
          </div>
          <div className="col-sm-4">
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
          <div className="col-sm-4">
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
          ref={dt}
          value={tickets}
          paginator
          rows={25}
          dataKey="id"
          filters={filters}
          csvSeparator=";"
          globalFilterFields={filtersA}
          header={header}
          emptyMessage="No tickets found."
        >
          <Column header="Actions" exportable={false}></Column>
          <Column field="idP" header="Id" />
        </DataTable>
      </div>
    </Layout>
  );
}
