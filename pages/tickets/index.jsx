import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect, useRef } from "react";

export default Index;

function Index() {
  const [customers, setCustomers] = useState(null);
  const dt = useRef(null);
  useEffect(() => {
    let tempCustomers = [
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
    setCustomers(tempCustomers);
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
          className="file-excel"
          type="button"
          icon="fa fa-file-excel"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
          severity="success"
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
      <div className="card">
        <DataTable
          ref={dt}
          value={customers}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "company", "balance", "date"]}
          header={header}
          emptyMessage="No customers found."
        >
          <Column field="name" sortable header="Name" />
          <Column field="company" sortable header="Company" />
          <Column field="balance" sortable header="Balance" />
          <Column field="date" sortable header="Date" />
        </DataTable>
      </div>
    </Layout>
  );
}
