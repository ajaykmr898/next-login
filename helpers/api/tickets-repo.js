import { db, formatDate } from "helpers/api";

const Tickets = db.Tickets;

export const ticketsRepo = {
  getAll,
  create,
  getById,
  update,
  delete: _delete,
  getProfit,
  getRefunds,
};

async function getRefunds(filters) {
  let filter = {
    ...filters,
    $and: [
      { refund: { $ne: null } },
      { refund: { $ne: "" } },
      { iata: { $eq: "SCA" } },
    ],
    $expr: { $gt: [{ $toDouble: "$refund" }, { $toDouble: "$supplied" }] },
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
