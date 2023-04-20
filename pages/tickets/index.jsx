import Link from "next/link";
import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
export default Index;

function Index() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    setCustomers([
      {
        id: 10340,
        name: "James Butt",
        country: {
          name: "Algeria",
          code: "dz",
        },
        company: "Benton, John B Jr",
        date: "2015-09-13",
        status: "unqualified",
        verified: true,
        activity: 17,
        representative: {
          name: "Ioni Bowcher",
          image: "ionibowcher.png",
        },
        balance: 70663,
      },
      {
        id: 1032,
        name: "Jam2es Abv",
        country: {
          name: "Algeria",
          code: "dz",
        },
        company: "Benton, John B Jr",
        date: "2015-09-13",
        status: "unqualified",
        verified: true,
        activity: 17,
        representative: {
          name: "Ioni Bowcher",
          image: "ionibowcher.png",
        },
        balance: 70663,
      },
      {
        id: 1001,
        name: "Ja1mes Butt",
        country: {
          name: "Algeria",
          code: "dz",
        },
        company: "Benton, John B Jr",
        date: "2015-09-13",
        status: "unqualified",
        verified: true,
        activity: 17,
        representative: {
          name: "Ioni Bowcher",
          image: "ionibowcher.png",
        },
        balance: 70663,
      },
    ]);
  }, []);

  return (
    <Layout>
      <h1>Tickets</h1>
      <Link href="/users/add" className="btn btn-sm btn-success mb-2">
        Add Ticket
      </Link>
      <DataTable
        value={customers}
        paginator
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        filterDisplay="menu"
        emptyMessage="No tickets found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="name"
          header="Name"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="country.name"
          header="Country"
          filterField="country.name"
          style={{ minWidth: "14rem" }}
          filter
          filterPlaceholder="Search by country"
        />
        <Column
          header="Agent"
          sortField="representative.name"
          filterField="representative"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          filter
        />
        <Column
          field="date"
          header="Date"
          filterField="date"
          dataType="date"
          style={{ minWidth: "12rem" }}
          filter
        />
        <Column
          field="balance"
          header="Balance"
          dataType="numeric"
          style={{ minWidth: "12rem" }}
          filter
        />
        <Column
          field="status"
          header="Status"
          sortable
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          filter
        />
        <Column
          field="activity"
          header="Activity"
          sortable
          showFilterMatchModes={false}
          style={{ minWidth: "12rem" }}
          filter
        />
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
        />
      </DataTable>
    </Layout>
  );
}
