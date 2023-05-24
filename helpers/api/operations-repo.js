import { db, formatDate } from "helpers/api";

const Operations = db.Operations;

export const operationsRepo = {
  getAll,
  create,
};

async function getAll(filters) {
  let query = [
    {
      $match: {
        $and: [
          {
            [filters.type]: {
              $gte: filters.start,
              $lte: filters.end,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tickets",
        localField: "ticketId",
        foreignField: "_id",
        as: "ticket",
      },
    },
  ];
  return await Operations.aggregate(query).sort({
    createdAt: -1,
    operation: 1,
  });
}

async function create(params) {
  const operation = new Operations(params);
  await operation.save();
}
