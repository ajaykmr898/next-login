import { Layout } from "components/tickets";
import { Budget } from "../../components/seller/Budget";
import { useEffect, useState } from "react";
import { ticketsService } from "../../services";
import { Spinner } from "../../components";

export default Add;

function Add() {
  useEffect(() => {
    getRefundsForSupply();
  }, []);

  function getRefundsForSupply() {
    ticketsService.getRefundsForSupply({}).then((x) => {
      const refunds = x.map((e) => {
        let remained = e.refund - (e.refundUsed || 0);
        return {
          ...e,
          refundUsed: e.refundUsed || 0,
          remained: parseFloat(remained).toFixed(2),
        };
      });
      setRefunds(refunds);
    });
  }

  const [refunds, setRefunds] = useState(null);

  return (
    <Layout>{refunds ? <Budget refunds={refunds} /> : <Spinner />}</Layout>
  );
}
