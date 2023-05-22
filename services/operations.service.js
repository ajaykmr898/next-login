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
    let paidAmount = parseFloat(e.ticket[0].paidAmount);
    let supplied = parseFloat(e.ticket[0].supplied || 0);
    let refundUsed = parseFloat(e.ticket[0].refundUsed || 0);
    let refund = parseFloat(e.ticket[0].refund || 0);
    let remainedRefund =
      parseFloat(e.ticket[0].refund) - parseFloat(e.ticket[0].refundUsed || 0);
    let remainedSupplied =
      parseFloat(e.ticket[0].paidAmount) -
      parseFloat(e.ticket[0].supplied || 0);
    return {
      ...e,
      transferDate: formatDate(e.transferDate, "IT"),
      suppliedTicket: e.suppliedTicket ? "€ " + e.suppliedTicket : "-",
      ticketRefundUsed: e.ticketRefundUsed ? "€ " + e.ticketRefundUsed : "-",
      remainedRefund: e.ticket[0].refund
        ? "€ " + remainedRefund.toFixed(2)
        : "-",
      remainedSupplied: "€ " + remainedSupplied.toFixed(2),
      paidAmount: "€ " + paidAmount.toFixed(2),
      supplied: "€ " + supplied.toFixed(2),
      refund: "€ " + refund.toFixed(2),
      refundUsed: "€ " + refundUsed.toFixed(2),
      name: e.ticket[0].name,
      bookingCode: e.ticket[0].bookingCode,
      totalOperation: e.totalOperation ? "€ " + e.totalOperation : "",
      transferAmountTotalOperation: "€ " + e.transferAmountTotalOperation,
      refundAmountTotalOperation: "€ " + e.refundAmountTotalOperation,
    };
  });
  return data;
}

async function create(operation) {
  await fetchWrapper.post(`${baseUrl}/create`, operation);
}
