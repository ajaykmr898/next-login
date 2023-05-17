import { apiHandler, ticketsRepo } from "helpers/api";

export default apiHandler({
  post: getRefunds,
});

async function getRefunds(req, res) {
  const tickets = await ticketsRepo.getRefunds(req.body);
  return res.status(200).json(tickets);
}
