import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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

async function create(params) {}

async function update(id, params) {}

async function _delete(id) {}
