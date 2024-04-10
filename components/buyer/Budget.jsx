import {
  alertService,
  ticketsService,
  operationsService,
  formatDate,
  userService,
} from "services";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Spinner } from "components";

export { Budget };

function Budget(props) {
  const agents = props.agents;
  const [tickets, setTickets] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [delta, setDelta] = useState(0);
  const [total, setTotal] = useState(0);
  const [balanceTot, setBalanceTot] = useState(0);
  const [agent, setAgent] = useState(null);
  const [date, setDate] = useState(null);

  const [totals, setTotals] = useState({
    totalCost: 0,
    totalPaidSca: 0,
    totalRemainedSca: 0,
    totalRemainedSca2: 0,
  });

  useEffect(() => {
    document.getElementById("complete").setAttribute("disabled", "disabled");
  }, []);

  const swal = Swal.mixin({
    customClass: {
      confirmButton: "m-1 btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  function onComplete() {
    let errU = false;
    console.log(agent, date, total, balanceTot, delta);
    if (!isNaN(delta)) {
      let deltaI = parseFloat(delta).toFixed(2);
      let data = { ...agent, balance: deltaI };
      userService.update(agent.id, data).catch((err) => (errU = true));
    }
    return { errU };
  }

  function ask() {
    swal
      .fire({
        title: "Are you sure?",
        text: "You want to save operations to database?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const resp = onComplete();
          if (resp) {
            let { errorI, errorU } = resp;

            if (!errorI && !errorU) {
              swal
                .fire(
                  "Saved",
                  "Your operations has been saved successfully.",
                  "success"
                )
                .then((res) => {
                  if (res.isDismissed || res.isConfirmed) {
                    window.location.reload();
                  }
                });
            } else {
              swal.fire(
                "Error!",
                "An error occurred while saving operations.",
                "error"
              );
            }
          }
        }
      });
  }

  async function getTickets(filters) {
    setLoadingTickets(true);
    const res = await ticketsService.getTicketsByAgent(filters);
    setTickets(res);
    setLoadingTickets(false);
  }

  function disableInputsStart() {
    document.getElementById("budget").setAttribute("disabled", "disabled");
    document.getElementById("budget-date").setAttribute("disabled", "disabled");
    document.getElementById("add").setAttribute("disabled", "disabled");
    document.getElementById("agent").setAttribute("disabled", "disabled");
    document.getElementById("complete").removeAttribute("disabled");
  }

  async function onAdd(e) {
    e.preventDefault();
    alertService.clear();
    const dateT = document.getElementById("budget-date").value;
    const agentT = document.getElementById("agent").value;
    let balanceT = 0;
    let budgetT = document.getElementById("budget").value;
    budgetT = parseFloat(budgetT);
    try {
      if (budgetT > 0 && dateT && agentT !== "agentN") {
        let agent = agents.filter((agent) => agent.id === agentT);
        if (agent.length) {
          balanceT = agent[0].balance || 0;
          balanceT = +balanceT;
        }
        setBalanceTot(balanceT);
        setAgent(agent[0]);
        setDate(dateT);
        adjustTotal(budgetT, balanceT);
        disableInputsStart();
        await getTickets({ agentId: agentT });
      } else {
        setBalanceTot(balanceT);
        adjustTotal(0, 0);
      }
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  function adjustTotal(budget, balance) {
    let totalT = 0;
    totalT = budget + balance;
    totalT = totalT !== 0 ? parseFloat(totalT).toFixed(2) : 0;
    setTotal(totalT);
    setDelta(totalT);
  }

  return (
    <>
      <form id="add-form" onSubmit={(e) => onAdd(e)}>
        <div className="row">
          <div className="col-6 col-md-3">
            <label className="form-label">
              Agent: <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <select className="form-select" id="agent">
                <option key="agentN" value="agentN">
                  Select agent
                </option>
                {agents.map((agent, index) => {
                  return (
                    <option key={"agent" + index} value={agent.id}>
                      {agent.firstName} {agent.lastName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">
              Date: <span className="text-danger">*</span>
            </label>
            <input
              name="budget-date"
              id="budget-date"
              type="date"
              className="form-control"
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">
              Bonifico: <span className="text-danger">*</span>
            </label>
            <input
              name="budget"
              id="budget"
              type="number"
              step="0.01"
              className="form-control"
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">Balance:</label>
            <input
              name="balance"
              disabled
              value={balanceTot}
              type="number"
              step="0.01"
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-3">
            <div className="text-center">Total - Remained</div>
            <div className="text-center mt-3">
              € {total} - € {delta}
            </div>
          </div>
          <div className="col-6 col-md-2">
            <br />
            <button type="submit" id="add" className="btn btn-primary me-2">
              Start
            </button>
          </div>
          <div className="col-6 col-md-2">
            <br />
            <button
              onClick={() => {
                ask();
              }}
              type="button"
              id="complete"
              className="btn btn-success me-2"
            >
              Done
            </button>
          </div>
        </div>
      </form>
      <br />
      <div className="accordion" id="accordionExample1">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne1"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              {tickets && tickets.length
                ? tickets.length + " Tickets"
                : "No tickets to adjust"}
            </button>
          </h2>
          <div
            id="collapseOne1"
            className="accordion-collapse collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample1"
          >
            <div className="accordion-body">
              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">PNR</th>
                      <th scope="col">Iata Cost</th>
                      <th scope="col">Agent Cost</th>
                      <th scope="col">Paid by Agent</th>
                      <th scope="col">Remained</th>
                      <th scope="col">To Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets &&
                      tickets.map((r, i) => {
                        return (
                          <tr key={i}>
                            <td>{r.name}</td>
                            <td>{r.bookingCode}</td>
                            <td>€ {r.paidAmount}</td>
                            <td>€ {r.agentCost}</td>
                            <td>€ {r.supplied}</td>
                            <td>€ {r.remained}</td>
                            <td>
                              <input
                                className={
                                  "tickets tickets-field tickets-input-" + r.id
                                }
                                placeholder="remained to pay"
                                type="number"
                                step="0.01"
                                min="0"
                                max={r.remained}
                              />
                              &nbsp;
                              <button
                                className={
                                  "tickets-field tickets-field-ok tickets-btn-ok-" +
                                  r.id
                                }
                                onClick={() => {
                                  addSupplied(r.id, r.remained, r.supplied);
                                }}
                              >
                                Ok
                              </button>
                              &nbsp;
                              <button
                                className={
                                  "tickets-field tickets-field-edit tickets-btn-edit-" +
                                  r.id
                                }
                                onClick={() => {
                                  editSupplied(r.id, r.remained, r.supplied);
                                }}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>
                              &nbsp;
                              <label
                                hidden
                                className={`tickets-ok-${r.id} text-success`}
                              >
                                <i className="fa fa-check"></i>
                              </label>
                              <label
                                hidden
                                className={`tickets-ko-${r.id} text-danger`}
                              >
                                <i className="fa fa-times"></i>
                              </label>
                            </td>
                          </tr>
                        );
                      })}
                    {loadingTickets && (
                      <tr>
                        <td colSpan="7">
                          <Spinner />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th>Totals:</th>
                      <th></th>
                      <th>€ {totals.totalCost.toFixed(2)}</th>
                      <th>€ {totals.totalPaidSca.toFixed(2)}</th>
                      <th>€ {totals.totalRemainedSca.toFixed(2)}</th>
                      <th>€ {totals.totalRemainedSca2.toFixed(2)}</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
