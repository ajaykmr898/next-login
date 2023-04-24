import { apiHandler, ticketsRepo } from "helpers/api";

export default apiHandler({
  post: getAll,
});

async function getAll(req, res) {
  const tickets = await ticketsRepo.getAll(req.body);
  return res.status(200).json(tickets);
}
