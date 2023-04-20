import Link from "next/link";
import { Layout } from "components/users";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";

export default Index;

const xlsx = require("xlsx");
const fsaver = require("file-saver");

function Index() {
  const [products, setProducts] = useState([]);
  const dt = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const cols = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "category", header: "Category" },
    { field: "quantity", header: "Quantity" },
  ];

  useEffect(() => {
    setProducts([
      {
        id: "1000",
        code: "f230fh0g3",
        name: "Bamboo Watch",
        description: "Product Description",
        image: "bamboo-watch.jpg",
        price: 65,
        category: "Accessories",
        quantity: 24,
        inventoryStatus: "INSTOCK",
        rating: 5,
      },
      {
        id: "1001",
        code: "f230fh0g3",
        name: "ssd Watch",
        description: "Product Description",
        image: "bamboo-watch.jpg",
        price: 65,
        category: "Accessories",
        quantity: 24,
        inventoryStatus: "INSTOCK",
        rating: 5,
      },
    ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const header = (
    <div>
      <div className="flex align-items-center justify-content-end gap-2">
        <Button
          type="button"
          icon="fa fa-file-excel"
          severity="success"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="XLS"
        />
      </div>
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
    </div>
  );

  return (
    <Layout>
      <div className="card">
        <DataTable
          ref={dt}
          value={products}
          header={header}
          tableStyle={{ minWidth: "50rem" }}
        >
          {cols.map((col, index) => (
            <Column key={index} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </div>
    </Layout>
  );
}
