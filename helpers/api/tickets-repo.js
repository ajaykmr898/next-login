import { db } from "helpers/api";

const Tickets = db.Tickets;

export const ticketsRepo = {
  getAll,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Tickets.find();
}

async function create(params) {
  const ticket = new Tickets(params);
  await ticket.save();
}

async function update(id, params) {}

async function _delete(id) {}
