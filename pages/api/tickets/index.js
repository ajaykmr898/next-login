import { apiHandler, ticketsRepo } from "helpers/api";

export default apiHandler({
  get: getAll,
});

async function getAll(req, res) {
  const tickets = await ticketsRepo.getAll();
  return res.status(200).json(tickets);
}
