import { db, formatDate } from "helpers/api";

const Tickets = db.Tickets;

export const ticketsRepo = {
  getAll,
  create,
  update,
  delete: _delete,
  getProfit,
};

async function getAll(dates) {
  return await Tickets.find({
    bookedOn: { $gte: dates.start, $lte: dates.end },
  }).sort({ bookedOn: -1 });
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

async function getProfit(dates) {
  return await Tickets.find({
    bookedOn: { $gte: dates.start, $lte: dates.end },
  }).sort({
    bookedOn: 1,
  });
}
