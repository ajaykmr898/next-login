import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Tickets: ticketsModel(),
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
      ticketNumber: { type: String, required: false },
      paymentMethod: { type: String, required: false },
      paidAmount: { type: String, required: false },
      receivingAmount1: { type: String, required: false },
      receivingAmount2: { type: String, required: false },
      receivingAmount3: { type: String, required: false },
      cardNumber: { type: String, required: false },
      bookedOn: { type: String, required: false },
      travel1: { type: String, required: false },
      travel2: { type: String, required: false },
      dates: { type: String, required: false },
      phone: { type: String, required: false },
      flight: { type: String, required: false },
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
