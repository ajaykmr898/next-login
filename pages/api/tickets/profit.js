import { apiHandler, ticketsRepo } from "helpers/api";

export default apiHandler({
  get: getProfit,
});

async function getProfit(req, res) {
  const tickets = await ticketsRepo.getProfit();
  return res.status(200).json(tickets);
}
