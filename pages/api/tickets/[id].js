import { apiHandler, ticketsRepo } from "helpers/api";

export default apiHandler({
  put: update,
  delete: _delete,
});

async function update(req, res) {
  await ticketsRepo.update(req.query.id, req.body);
  return res.status(200).json({});
}

async function _delete(req, res) {
  await ticketsRepo.delete(req.query.id);
  return res.status(200).json({});
}
