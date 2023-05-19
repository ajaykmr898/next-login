import { fetchWrapper } from "helpers";
import { formatDate } from "./index";

const baseUrl = `/api/operations`;

export const operationsService = {
  getAll,
  create,
};

async function getAll(filters) {
  const response = await fetchWrapper.post(baseUrl, filters);
  const data = response.map((e) => {
    return {
      ...e,
      transferDate: formatDate(e.transferDate, "IT"),
      suppliedTicket: e.suppliedTicket ? "€ " + e.suppliedTicket : "-",
      ticketRefundUsed: e.ticketRefundUsed ? "€ " + e.ticketRefundUsed : "-",
    };
  });
  return data;
}

async function create(operation) {
  await fetchWrapper.post(`${baseUrl}/create`, operation);
}
