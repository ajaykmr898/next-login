import { alertService, ticketsService } from "services";
import React, { useEffect, useState } from "react";

export { Budget };

function Budget(props) {
  const refunds = props.refunds;
  const [tickets, setTickets] = useState([]);
  const [delta, setDelta] = useState(0);
  const [total, setTotal] = useState(0);
  const [refundTot, setRefundTot] = useState(0);
  const [date, setDate] = useState(null);
  const [budgetTot, setBudgetTot] = useState(0);
  const [changes, setChanges] = useState([]);

  //0 - rinominare penality in supplied
  //1 - prendere lista dei ticket con refund (non completamente gestito) [con sca e refund e supplied < cost]
  //2 - sceglere quali refund usare e fare adjustTotal
  //3 far vedere lista dei ticket non ancora completamente gestiti con budget verso SCA
  //6 visualizzare tutte le operazioni nella tabella nuova
  // nome, pnr, biglietto, cost, refund, supplied, balance (r - total s), s date
  //4 aggiornare supplied/date del biglietto ogni volta che il biglietto viene selezionato
  //5 salvare nella nuova tabella i movimenti sui biglietti se scelti per refund o supply
  //una riga per ogni bonifico e use refund o set supply

  useEffect(() => {
    getTickets();
  }, []);

  async function getTickets() {
    const res = await ticketsService.getTicketsForSupply();
    const res2 = res.map((e) => {
      let remained = e.paidAmount - (e.supplied || 0);
      return {
        ...e,
        supplied: e.supplied ? e.supplied : 0,
        remained: parseFloat(remained).toFixed(2),
      };
    });
    setTickets(res2);
  }

  async function onSubmit(e) {
    e.preventDefault();
    alertService.clear();
    const dateT = document.getElementById("budget-date").value;
    setDate(dateT);
    setDelta(total);
    try {
      if (total > 0 && dateT) {
        document.getElementById("budget").disabled = true;
        document.getElementById("budget-date").disabled = true;
        document.getElementById("add").disabled = true;
        console.log("3", changes, dateT);
      }
      //alertService.success("Budget added successfully", true);
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  function adjustTotal(number, type) {
    let totalT = 0;
    if (type === "r") {
      totalT = number + budgetTot;
    } else {
      totalT = number + refundTot;
    }
    totalT = parseFloat(totalT).toFixed(2);
    setTotal(totalT);
  }

  function addBudget(e) {
    let number = e && parseFloat(e.target.value);
    if (!isNaN(number)) {
      setBudgetTot(number);
      adjustTotal(number, "b");
    }
  }

  function addRefunds() {
    let elements = document.getElementsByClassName("remained");
    let changesT = [];
    let number = 0;
    for (let i = 0; i < elements.length; i++) {
      let toAdd = elements[i].value.trim() || "";
      let id = (elements[i].classList[1] || "").replace("remained-input-", "");
      let remainedI = refunds.filter((e) => e.id === id) || [];
      remainedI = remainedI.length && remainedI[0]["remained"];
      if (toAdd && remainedI) {
        toAdd = parseFloat(toAdd);
        remainedI = parseFloat(remainedI);
        if (toAdd <= remainedI && toAdd > 0) {
          changesT.push({ id, toAdd, remainedI });
          number += toAdd;
          document.getElementsByClassName(
            "remained-ok-" + id
          )[0].hidden = false;
          document.getElementsByClassName("remained-ko-" + id)[0].hidden = true;
        } else {
          document.getElementsByClassName(
            "remained-ko-" + id
          )[0].hidden = false;
          document.getElementsByClassName("remained-ok-" + id)[0].hidden = true;
        }
      }
    }
    if (changesT) {
      setChanges(changesT);
      setRefundTot(number);
      adjustTotal(number, "r");
    }
  }

  function manageSupplied(id, remained, supplied) {
    let number = document.getElementsByClassName("tickets-input-" + id)[0]
      .value;
    supplied = parseFloat(supplied);
    number = parseFloat(number);
    remained = parseFloat(remained);
    let deltaI = parseFloat(delta);
    if (
      !isNaN(number) &&
      number >= 0 &&
      number <= deltaI &&
      number <= remained
    ) {
      number = number + supplied;
      number = number.toFixed(2);
      ticketsService.update(id, { supplied: number }).then((res) => {
        let deltaT = deltaI - number;
        deltaT = parseFloat(deltaT).toFixed(2);
        // disable
        document.getElementsByClassName("tickets-btn-" + id)[0].disabled = true;
        setDelta(deltaT);
      });
    }
    // prendere numero
    // aggiornare db
    // togleire da budget rimasto
  }

  return (
    <>
      <form id="add-form" onSubmit={(e) => onSubmit(e)}>
        <div className="row">
          <div className="col-sm-3">
            <label className="form-label">
              Bonifico Date: <span className="text-danger">*</span>
            </label>
            <input
              name="budget-date"
              id="budget-date"
              type="date"
              className="form-control"
            />
          </div>
          <div className="col-sm-2">
            <label className="form-label">
              Bonifico: <span className="text-danger">*</span>
            </label>
            <input
              name="budget"
              id="budget"
              type="number"
              step="0.01"
              onChange={(e) => {
                addBudget(e);
              }}
              className="form-control"
            />
          </div>
          <div className="col-sm-1">
            <br />
            <div className="text-center mt-3">+</div>
          </div>
          <div className="col-sm-2">
            <label className="form-label">Refund:</label>
            <input
              name="refund"
              disabled
              value={refundTot}
              type="number"
              step="0.01"
              className="form-control"
            />
          </div>
          <div className="col-sm-1">
            <br />
            <div className="text-center mt-3">=</div>
          </div>{" "}
          <div className="col-sm-1">
            <div className="text-center">Total:</div>
            <div className="text-center mt-3">€ {total}</div>
          </div>
          <div className="col-sm-1">
            <div className="text-center">Remained:</div>
            <div className="text-center mt-3">€ {delta}</div>
          </div>
          <div className="col-sm-1">
            <br />
            <button type="submit" id="add" className="btn btn-primary me-2">
              Add
            </button>
          </div>
        </div>
      </form>
      <br />
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              {refunds.length
                ? refunds.length + " Refunds"
                : "No tickets with refund"}
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            {refunds.length ? (
              <button
                onClick={() => addRefunds()}
                style={{ float: "right" }}
                className="btn btn-success"
              >
                Ok
              </button>
            ) : (
              ""
            )}
            <div className="accordion-body">
              {refunds.map((r, i) => {
                return (
                  <div key={i}>
                    <li className={"refund-" + i}>
                      {r.name} - {r.bookingCode} - refund: € {r.refund} - paid
                      SCA: € {r.supplied} - remained: € {r.remained}
                      &nbsp;-&nbsp;
                      <input
                        className={"remained remained-input-" + r.id}
                        placeholder="remained to use"
                        type="number"
                        step="0.01"
                        min="0"
                        max={r.remained}
                      />
                      &nbsp;
                      <label
                        hidden
                        className={`remained-ok-${r.id} text-success`}
                      >
                        <i className="fa fa-check"></i>
                      </label>
                      <label
                        hidden
                        className={`remained-ko-${r.id} text-danger`}
                      >
                        <i className="fa fa-times"></i>
                      </label>
                    </li>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
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
              {tickets.length
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
              {tickets.map((r, i) => {
                return (
                  <div key={i}>
                    <li className={"tickets-" + i}>
                      {r.name} - {r.bookingCode} - cost: € {r.paidAmount} - paid
                      SCA: € {r.supplied} - remained: € {r.remained}
                      &nbsp;-&nbsp;
                      <input
                        className={"tickets tickets-input-" + r.id}
                        placeholder="insert to supply"
                        type="number"
                        step="0.01"
                        min="0"
                        max={r.remained}
                      />
                      &nbsp;
                      <button
                        className={"tickets-btn-" + r.id}
                        onClick={() => {
                          manageSupplied(r.id, r.remained, r.supplied);
                        }}
                      >
                        Ok
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
                    </li>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
