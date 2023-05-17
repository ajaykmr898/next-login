import { Layout } from "components/tickets";
import { Budget } from "../../components/seller/Budget";
import { useEffect, useState } from "react";
import { ticketsService } from "../../services";
import { Spinner } from "../../components";

export default Add;

function Add() {
  useEffect(() => {
    getRefunds();
  }, []);

  function getRefunds() {
    ticketsService.getRefunds({}).then((x) => {
      const refunds = x.map((e) => {
        let remained = e.refund - (e.supplied || 0);
        return {
          ...e,
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
