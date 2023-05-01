import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, AddEdit } from "components/tickets";
import { Spinner } from "components";
import { ticketsService, alertService } from "services";

export default Edit;

function Edit() {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch user and set default form values if in edit mode
    ticketsService
      .getById(id)
      .then((x) => setTicket(x))
      .catch(alertService.error);
  }, [router]);

  return <Layout>{ticket ? <AddEdit ticket={ticket} /> : <Spinner />}</Layout>;
}
