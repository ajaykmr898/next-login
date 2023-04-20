import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect } from "react";

export default Index;

function Index() {
  const [customers, setCustomers] = useState(null);
  useEffect(() => {
    setCustomers([
      {
        id: 1000,
        name: "James Butt",
        company: "John",
        date: "2015-09-13",
        status: "ccc",
        verified: true,
        activity: 17,
        balance: 70663,
      },
      {
        id: 10300,
        name: "fgd",
        company: "Benton, John B Jr",
        date: "2015-09-13",
        status: "aaa",
        verified: true,
        activity: 17,
        balance: 70663,
      },
      {
        id: 10010,
        name: "James Butt",
        company: "Benton, John B Jr",
        date: "2015-09-13",
        status: "unqualified",
        verified: true,
        activity: 17,
        balance: 4534,
      },
    ]);
  }, []);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    balance: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
      </div>
    );
  };

  const header = renderHeader();

  return (
    <Layout>
      <div className="card">
        <DataTable
          value={customers}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name"]}
          header={header}
          emptyMessage="No customers found."
        >
          <Column
            field="name"
            header="Name"
            filter
            style={{ minWidth: "12rem" }}
            showFilterMenu={false}
          />
          <Column
            field="company"
            header="Company"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            filter
          />
          <Column
            field="balance"
            header="Balance"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            filter
          />
        </DataTable>
      </div>
    </Layout>
  );
}
