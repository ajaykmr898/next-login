import { Layout } from "components/tickets";
import { Budget } from "../../components/buyer/Budget";
import { useEffect, useState } from "react";
import { ticketsService, userService } from "../../services";
import { Spinner } from "../../components";

export default Add;

function Add() {
  const [agents, setAgents] = useState(null);
  useEffect(() => {
    getAgents();
  }, []);

  function getAgents() {
    userService.getAllAgents().then((x) => setAgents(x));
  }
  return <Layout>{agents ? <Budget agents={agents} /> : <Spinner />}</Layout>;
}
