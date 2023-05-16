import { alertService } from "services";
import React, { useState } from "react";

export { Budget };

function Budget(props) {
  const [refundTot, setRefundTot] = useState(0);
  const [total, setTotal] = useState(0);
  console.log("1,2");

  //0 rinominare penality in supplied
  //1 prendere lista dei ticket con refund (non completamente gestito) [con refund e supplied < cost]
  //2 sceglere quali refund usare e fare adjustTotal
  //3 far vedere lista dei ticket non ancora completamente gestiti con budget verso SCA
  //6 visualizzare tutte le operazioni nella tabella nuova
  // nome, pnr, biglietto, cost, refund, supplied, balance (r - total s), s date
  //4 aggiornare supplied del biglietto ogni volta che il biglietto viene selezionato
  //5 salvare nella nuova tabella i movimenti sui biglietti se scelti per refund o supply
  //una riga per ogni use refund o set supply

  async function onSubmit(e) {
    e.preventDefault();
    alertService.clear();
    try {
      console.log("3");
      //alertService.success("Budget added successfully", true);
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  function adjustTotal(e) {
    let number = parseFloat(e.target.value);
    let total = 0;
    if (!isNaN(number)) {
      total = parseFloat(number) + parseFloat(refundTot);
      setTotal(parseFloat(total).toFixed(2));
    }
    console.log(number);
  }

  return (
    <form id="add-form" onSubmit={(e) => onSubmit(e)}>
      <div className="row">
        <div className="col-sm-4">
          <label className="form-label">
            Budget: <span className="text-danger">*</span>
          </label>
          <input
            name="budget"
            type="number"
            step="0.01"
            onChange={(e) => {
              adjustTotal(e);
            }}
            className="form-control"
          />
        </div>
        <div className="col-sm-1">
          <br />
          <div className="text-center mt-3">+</div>
        </div>
        <div className="col-sm-4">
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
          <label>Total:</label>
          <div className="text-center mt-3">{total}</div>
        </div>
        <div className="col-sm-1">
          <br />
          <button type="submit" className="btn btn-primary me-2">
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
