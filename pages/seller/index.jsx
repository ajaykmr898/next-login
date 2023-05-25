import { Layout } from "components/users";
import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import { formatDate, operationsService } from "../../services";
import { Spinner } from "components";

export default Index;

function Index() {
  const [operations, setOperations] = useState(null);
  const [opExcel, setOpExcel] = useState(null);
  const [dates, setDates] = useState({
    start: "",
    end: "",
    type: "",
  });
  useEffect(() => {
    getOperations();
  }, []);

  const getOperations = (dates = null) => {
    let start = new Date();
    //start.setMonth(start.getMonth() - 6);
    start.setDate(1);
    start = formatDate(start);
    let end = formatDate(new Date());
    let type = "transferDate";
    if (dates) {
      start = dates.start;
      end = dates.end;
      type = dates.type;
    } else {
      setDates({ start, end, type });
    }
    operationsService.getAll({ start, end, type }).then((res) => {
      const operationsI = res.reduce((group, arr) => {
        const { transferName } = arr;
        group[transferName] = group[transferName] ?? [];
        group[transferName].push(arr);
        return group;
      }, {});
      setOpExcel(res);
      setOperations(operationsI);
    });
  };

  const addNew = () => {
    Router.push("/seller/transfer");
  };

  const download = () => {
    console.log(opExcel);
    const headers = [
      "Date",
      "Name",
      "PNR",
      "Operation",
      "Cost",
      "Total Paid to SCA",
      "Remained to pay SCA",
      "Transferred with Operation",
      "Total Refund",
      "Refund Used",
      "Remained refund",
      "Refund Used with Operation",
    ];
    const csvString = [
      headers,
      ...opExcel.map((i) => [
        i.transferDate,
        i.name,
        i.bookingCode,
        i.operation,
        i.paidAmount,
        i.supplied,
        i.remainedSupplied,
        i.suppliedTicket,
        i.refund,
        i.refundUsed,
        i.remainedRefund,
        i.ticketRefundUsed,
      ]),
    ]
      .map((e) => e.join(";"))
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + csvString;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "operations_" + Date.now() + ".csv");
    document.body.appendChild(link);

    link.click();
  };

  const search = () => {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let type = document.getElementById("type").value;
    getOperations({ start, end, type });
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <label htmlFor="type">Type:</label>
            <div className="input-group">
              <select id="type" className="form-select">
                <option value="transferDate">Transfer Date</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
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
          <div className="col-md-3">
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
          <div className="col-sm-1">
            <button
              type="submit"
              className="btn btn-block btn-primary width-search"
              onClick={() => {
                search();
              }}
            >
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-warning width-search"
              onClick={() => {
                download();
              }}
            >
              <i className="fa fa-download"></i>
            </button>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-success width-search"
              onClick={() => {
                addNew();
              }}
            >
              <i className="fa fa-add"></i>
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="card">
        <div className="container">
          <div className="table-responsive">
            <br />
            <table className="table table-striped accordion">
              {operations && Object.keys(operations).length ? (
                <tbody>
                  {Object.keys(operations).map((key, i) => {
                    return (
                      <React.Fragment key={"i" + i}>
                        <tr data-bs-toggle="collapse" data-bs-target={"#r" + i}>
                          <th scope="row">
                            {i + 1} - Bonifico
                            {" - " + operations[key][0]["transferDate"]}
                            {" - " + operations[key][0]["totalOperation"]}
                            {" (" +
                              operations[key][0][
                                "transferAmountTotalOperation"
                              ]}
                            {" + " +
                              operations[key][0]["refundAmountTotalOperation"] +
                              ") "}
                            <i className="fa fa-chevron-down tb-btns"></i>
                          </th>
                        </tr>
                        <tr
                          className="collapse accordion-collapse"
                          id={"r" + i}
                          data-bs-parent=".table"
                        >
                          <td>
                            <table className="table table-striped accordion">
                              {Object.keys(operations[key]).length ? (
                                <tbody>
                                  <tr>
                                    <td scope="row">Name</td>
                                    <td scope="row">PNR</td>
                                    <td scope="row">Operation</td>
                                    <td scope="row">Cost</td>
                                    <td scope="row">Total Paid to SCA</td>
                                    <td scope="row">Remained to pay SCA</td>
                                    <td scope="row">
                                      Transferred with Operation
                                    </td>
                                    <td scope="row">Total Refund</td>
                                    <td scope="row">Refund Used</td>
                                    <td scope="row">Remained refund</td>
                                    <td scope="row">
                                      Refund Used with Operation
                                    </td>
                                  </tr>
                                  {Object.keys(operations[key]).map(
                                    (key2, i2) => {
                                      return (
                                        <React.Fragment key={"i2" + i2}>
                                          <tr>
                                            <td scope="row">
                                              {operations[key][key2]["name"]}
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "bookingCode"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "operation"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "paidAmount"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "supplied"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "remainedSupplied"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "suppliedTicket"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {operations[key][key2]["refund"]}
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "refundUsed"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "remainedRefund"
                                                ]
                                              }
                                            </td>
                                            <td scope="row">
                                              {
                                                operations[key][key2][
                                                  "ticketRefundUsed"
                                                ]
                                              }
                                            </td>
                                          </tr>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </tbody>
                              ) : null}
                            </table>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              ) : !operations ? (
                <tbody>
                  <tr>
                    <td colSpan="4">
                      <Spinner />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td>No transfers found.</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
