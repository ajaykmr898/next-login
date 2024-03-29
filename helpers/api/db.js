import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Tickets: ticketsModel(),
  Operations: operationsModel(),
  Expenses: expensesModel(),
};

// mongoose models with schema definitions

function userModel() {
  const schema = new Schema(
    {
      email: { type: String, unique: true, required: true },
      hash: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.User || mongoose.model("User", schema);
}

function ticketsModel() {
  const schema = new Schema(
    {
      fileName: { type: String, required: false },
      name: { type: String, required: false },
      bookingCode: { type: String, required: false },
      agent: { type: String, required: false },
      agentCost: { type: String, required: false },
      iata: { type: String, required: false },
      ticketNumber: { type: String, required: false },
      paymentMethod: { type: String, required: false },
      paidAmount: { type: String, required: false },
      receivingAmount1: { type: String, required: false },
      receivingAmount1Date: { type: String, required: false },
      receivingAmount2: { type: String, required: false },
      receivingAmount2Date: { type: String, required: false },
      receivingAmount2Method: { type: String, required: false },
      receivingAmount3: { type: String, required: false },
      receivingAmount3Date: { type: String, required: false },
      receivingAmount3Method: { type: String, required: false },
      cardNumber: { type: String, required: false },
      bookedOn: { type: String, required: false },
      travel1: { type: String, required: false },
      travel2: { type: String, required: false },
      dates: { type: String, required: false },
      phone: { type: String, required: false },
      flight: { type: String, required: false },
      refund: { type: String, required: false },
      refundUsed: { type: String, required: false },
      supplied: { type: String, required: false },
      refundDate: { type: String, required: false },
      returned: { type: String, required: false },
      returnedDate: { type: String, required: false },
      desc: { type: String, required: false },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
      strict: false,
    }
  );
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.Tickets || mongoose.model("Tickets", schema);
}

function operationsModel() {
  const schema = new Schema(
    {
      transferName: { type: String, required: false },
      transferAmountTotalOperation: { type: String, required: false },
      refundAmountTotalOperation: { type: String, required: false },
      ticketId: { type: mongoose.Schema.ObjectId, required: false },
      transferDate: { type: String, required: false },
      operation: { type: String, required: false },
      ticketRefundUsed: { type: String, required: false },
      //totalRefund: { type: String, required: false },
      suppliedTicket: { type: String, required: false },
      //totalSupplied: { type: String, required: false },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
      strict: false,
    }
  );
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });
  return mongoose.models.Operations || mongoose.model("Operations", schema);
}

function expensesModel() {
  const schema = new Schema(
    {
      title: { type: String, required: false },
      desc: { type: String, required: false },
      subcategory: { type: String, required: false },
      category: { type: String, required: false },
      type: { type: String, required: false },
      paymentMethod: { type: String, required: false },
      amount: { type: String, required: false },
      paymentDate: { type: String, required: false },
      status: { type: String, required: false },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
      strict: false,
    }
  );
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });
  return mongoose.models.Expenses || mongoose.model("Expenses", schema);
}
