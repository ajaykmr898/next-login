import { BehaviorSubject } from "rxjs";
import Router from "next/router";

import { fetchWrapper } from "helpers";
import { alertService } from "./alert.service";

const baseUrl = `/api/tickets`;

export const ticketsService = {
  getAll,
  create,
  update,
  delete: _delete,
};

async function getAll() {}

function create() {
  console.log("qui");
}

async function update() {}

async function _delete() {}
