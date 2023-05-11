import { db, formatDate } from "helpers/api";

const Tickets = db.Tickets;

export const ticketsRepo = {
  getAll,
  create,
  getById,
  update,
  delete: _delete,
  getProfit,
};

async function getAll(filters) {
  return await Tickets.find({
    [filters.type]: { $gte: filters.start, $lte: filters.end },
  }).sort({ bookedOn: -1 });
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
  return await Tickets.find({
    [filters.type]: { $gte: filters.start, $lte: filters.end },
  }).sort({
    bookedOn: 1,
  });
}
