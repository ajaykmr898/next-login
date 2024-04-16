import { db, formatDate } from "helpers/api";

const Tickets = db.Tickets;

export const ticketsRepo = {
  getAll,
  create,
  getById,
  update,
  delete: _delete,
  getProfit,
  getRefundsForSupply,
  getTicketsForSupply,
  getTicketsByAgent,
};

async function getTicketsByAgent(filters) {
  let filter = {
    //$and: [{ agentId: { $eq: filters.agentId } }],
    $expr: {
      $gt: [{ $toDouble: "$agentCost" }, { $toDouble: "$paidByAgent" }],
    },
  };
  return await Tickets.find(filter).sort({ bookedOn: -1 });
}

async function getTicketsForSupply(filters) {
  let filter = {
    ...filters,
    $and: [{ iata: { $eq: "SCA" } }],
    $expr: { $gt: [{ $toDouble: "$paidAmount" }, { $toDouble: "$supplied" }] },
  };
  return await Tickets.find(filter).sort({ bookedOn: -1 });
}

async function getRefundsForSupply(filters) {
  let filter = {
    ...filters,
    $and: [
      { refund: { $ne: null } },
      { refund: { $ne: "" } },
      { iata: { $eq: "SCA" } },
    ],
    $expr: { $gt: [{ $toDouble: "$refund" }, { $toDouble: "$refundUsed" }] },
  };
  return await Tickets.find(filter).sort({ bookedOn: -1 });
}

async function getAll(filters) {
  let filter =
    filters.type === "receivingAllDates"
      ? {
          $or: [
            {
              receivingAmount1Date: { $gte: filters.start, $lte: filters.end },
            },
            {
              receivingAmount2Date: { $gte: filters.start, $lte: filters.end },
            },
            {
              receivingAmount3Date: { $gte: filters.start, $lte: filters.end },
            },
          ],
        }
      : {
          [filters.type]: { $gte: filters.start, $lte: filters.end },
        };

  if (filters?.refund) {
    filter = {
      ...filter,
      $and: [
        { refund: { $ne: null } },
        { refund: { $ne: "" } },
        /*{ iata: { $eq: "SCA" } },*/
      ],
    };
  }
  return await Tickets.find(filter).sort({ bookedOn: -1 });
}

async function getById(id) {
  return await Tickets.findById(id);
}

async function create(params) {
  const ticket = new Tickets(params);
  await ticket.save();
}

async function update(id, params) {
  await Tickets.findByIdAndUpdate(id, params);
}

async function _delete(id) {
  await Tickets.findByIdAndRemove(id);
}

async function getProfit(filters) {
  let filter =
    filters.type === "receivingAllDates"
      ? {
          $or: [
            {
              receivingAmount1Date: { $gte: filters.start, $lte: filters.end },
            },
            {
              receivingAmount2Date: { $gte: filters.start, $lte: filters.end },
            },
            {
              receivingAmount3Date: { $gte: filters.start, $lte: filters.end },
            },
          ],
        }
      : {
          [filters.type]: { $gte: filters.start, $lte: filters.end },
        };
  return await Tickets.find(filter).sort({
    bookedOn: 1,
  });
}
