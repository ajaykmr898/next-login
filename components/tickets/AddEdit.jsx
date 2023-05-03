import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { ticketsService, alertService, formatDate } from "services";

export { AddEdit };

function AddEdit(props) {
  const ticket = props?.ticket;
  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Customer is required"),
    paid: Yup.number().required("Paid Amount is required"),
    receiving: Yup.string().notRequired(),
    method: Yup.string().notRequired(),
    agent: Yup.string().notRequired(),
    agentCost: Yup.string().notRequired(),
    booked: Yup.date().required("Booked On is required"),
    bookcode: Yup.string().required("Booking code is required"),
    ticket: Yup.string().required("Ticket  number is required"),
    card: Yup.string().notRequired(),
    travel1: Yup.string().notRequired(),
    travel2: Yup.string().notRequired(),
    dates: Yup.string().notRequired(),
    phone: Yup.string().notRequired(),
    flight: Yup.string().notRequired(),
    receivingAmount1Date: Yup.string().notRequired(),
    receivingAmount2: Yup.string().notRequired(),
    receivingAmount2Date: Yup.string().notRequired(),
    receivingAmount3: Yup.string().notRequired(),
    receivingAmount3Date: Yup.string().notRequired(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data) {
    alertService.clear();
    try {
      // create or update user based on user prop
      let ticketNew = {
        fileName: data.name,
        name: data.name,
        agent: data.agent,
        agentCost: data.agentCost,
        paymentMethod: data.method,
        bookingCode: data.bookcode,
        bookedOn: formatDate(data.booked),
        ticketNumber: data.ticket,
        paidAmount: data.paid,
        receivingAmount1: data.receiving,
        receivingAmount1Date:
          data.receivingAmount1Date && formatDate(data.receivingAmount1Date),
        receivingAmount2: data.receivingAmount2 || "",
        receivingAmount3: data.receivingAmount3 || "",
        receivingAmount2Date:
          data.receivingAmount2Date && formatDate(data.receivingAmount2Date),
        receivingAmount3Date:
          data.receivingAmount3Date && formatDate(data.receivingAmount3Date),
        cardNumber: data.card || "",
        travel1: data.travel1 || "",
        travel2: data.travel2 || "",
        dates: data.dates || "",
        phone: data.phone || "",
        flight: data.flight || "",
      };
      if (!ticket) {
        await ticketsService.create(ticketNew);
        document.getElementById("add-form").reset();
        reset({
          name: "",
          paid: "",
          receiving: "",
          agent: "",
          agentCost: "",
          method: "",
          bookcode: "",
          ticket: "",
          booked: "",
          card: "",
          travel1: "",
          travel2: "",
          dates: "",
          phone: "",
          flight: "",
        });
        alertService.success(
          "Ticket for " + ticketNew.name + " added successfully",
          true
        );
      } else {
        await ticketsService.update(ticket.id, ticketNew);
        alertService.success(
          "Ticket for " + ticketNew.name + " updated successfully"
        );
      }
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  return (
    <form id="add-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="mb-3 col-md-4 col-sm-6">
          <label className="form-label">
            Passenger <span className="text-danger">*</span>
          </label>
          <input
            name="name"
            defaultValue={ticket?.name}
            type="text"
            {...register("name")}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="mb-3 col-md-4 col-sm-6">
          <label className="form-label">Agent</label>
          <input
            name="agent"
            defaultValue={ticket?.agent}
            type="text"
            {...register("agent")}
            className={`form-control ${errors.agent ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.agent?.message}</div>
        </div>
        <div className="mb-3 col-md-4 col-sm-6">
          <label className="form-label">Agent Cost</label>
          <input
            name="agentCost"
            defaultValue={ticket?.agentCost}
            type="number"
            step="0.01"
            {...register("agentCost")}
            className={`form-control ${errors.agentCost ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.agentCost?.message}</div>
        </div>
      </div>
      <div className="row">
        <div className="mb-3 col-md-4 col-sm-6">
          <label className="form-label">Payment Method</label>
          <input
            name="method"
            defaultValue={ticket?.paymentMethod}
            type="text"
            {...register("method")}
            className={`form-control ${errors.method ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.method?.message}</div>
        </div>
        <div className="mb-3 col-md-4 col-sm-6">
          <label className="form-label">
            Cost <span className="text-danger">*</span>
          </label>
          <input
            name="paid"
            defaultValue={ticket?.paidAmount}
            type="number"
            step="0.01"
            {...register("paid")}
            className={`form-control ${errors.paid ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.paid?.message}</div>
        </div>
        <div className="mb-3 col-md-4 col-sm-12">
          <label className="form-label">
            Issue date <span className="text-danger">*</span>
          </label>
          <input
            name="booked"
            defaultValue={ticket?.bookedOn}
            type="date"
            {...register("booked")}
            className={`form-control ${errors.booked ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.booked?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Receiving Amount 1</label>
          <input
            name="receiving"
            defaultValue={ticket?.receivingAmount1}
            type="number"
            step="0.01"
            {...register("receiving")}
            className={`form-control ${errors.receiving ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.receiving?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Receiving Amount 1 Date</label>
          <input
            name="receivingAmount1Date"
            defaultValue={ticket?.receivingAmount1Date}
            type="date"
            {...register("receivingAmount1Date")}
            className={`form-control ${
              errors.receivingAmount1Date ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.receivingAmount1Date?.message}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">
            Ticket Number <span className="text-danger">*</span>
          </label>
          <input
            name="ticket"
            defaultValue={ticket?.ticketNumber}
            type="text"
            {...register("ticket")}
            className={`form-control ${errors.ticket ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.ticket?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">
            PNR <span className="text-danger">*</span>
          </label>
          <input
            name="bookcode"
            defaultValue={ticket?.bookingCode}
            type="text"
            {...register("bookcode")}
            className={`form-control ${errors.bookcode ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.bookcode?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Departure port</label>
          <input
            name="travel1"
            defaultValue={ticket?.travel1}
            type="text"
            {...register("travel1")}
            className={`form-control ${errors.travel1 ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.travel1?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Arrival port</label>
          <input
            name="travel2"
            defaultValue={ticket?.travel2}
            type="text"
            {...register("travel2")}
            className={`form-control ${errors.travel2 ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.travel1?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Dates</label>
          <input
            name="dates"
            defaultValue={ticket?.dates}
            type="text"
            {...register("dates")}
            className={`form-control ${errors.dates ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.dates?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            defaultValue={ticket?.phone}
            type="text"
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Card Number</label>
          <input
            name="card"
            defaultValue={ticket?.cardNumber}
            type="text"
            {...register("card")}
            className={`form-control ${errors.card ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.card?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Flight Number</label>
          <input
            name="flight"
            defaultValue={ticket?.flight}
            type="text"
            {...register("flight")}
            className={`form-control ${errors.flight ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.flight?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Receiving Amount 2</label>
          <input
            name="receivingAmount2"
            defaultValue={ticket?.receivingAmount2}
            type="text"
            {...register("receivingAmount2")}
            className={`form-control ${
              errors.receivingAmount2 ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.receivingAmount2?.message}
          </div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Receiving Amount 2 Date</label>
          <input
            name="receivingAmount2Date"
            defaultValue={ticket?.receivingAmount2Date}
            type="date"
            {...register("receivingAmount2Date")}
            className={`form-control ${
              errors.receivingAmount2Date ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.receivingAmount2Date?.message}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Receiving Amount 3</label>
          <input
            name="receivingAmount3"
            defaultValue={ticket?.receivingAmount3}
            type="text"
            {...register("receivingAmount3")}
            className={`form-control ${
              errors.receivingAmount3 ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.receivingAmount3?.message}
          </div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">ReceivingAmount 3 Date</label>
          <input
            name="receivingAmount3Date"
            defaultValue={ticket?.receivingAmount3Date}
            type="date"
            {...register("receivingAmount3Date")}
            className={`form-control ${
              errors.receivingAmount3Date ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.receivingAmount3Date?.message}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn btn-primary me-2"
        >
          {formState.isSubmitting && (
            <span className="spinner-border spinner-border-sm me-1"></span>
          )}
          Save
        </button>
        <Link href="/tickets" className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}
