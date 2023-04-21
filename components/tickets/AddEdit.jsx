import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { ticketsService, alertService } from "services";

export { AddEdit };

function AddEdit(props) {
  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    paid: Yup.string().required("Paid Amount is required"),
    receiving: Yup.string().required("Receiving Amount is required"),
    ticket: Yup.string().notRequired(),
    booked: Yup.string().notRequired(),
    card: Yup.string().notRequired(),
    travel1: Yup.string().notRequired(),
    travel2: Yup.string().notRequired(),
    dates: Yup.string().notRequired(),
    phone: Yup.string().notRequired(),
    flight: Yup.string().notRequired(),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data) {
    alertService.clear();
    try {
      // create or update user based on user prop
      let ticket = {
        fileName: data.name,
        name: data.name,
        bookedOn: data.booked || "",
        ticketNumber: data.ticket || "",
        paidAmount: data.paid,
        receivingAmount1: data.receiving,
        receivingAmount2: "0",
        receivingAmount3: "0",
        cardNumber: data.card || "",
        travel1: data.travel1 || "",
        travel2: data.travel2 || "",
        dates: data.dates || "",
        phone: data.phone || "",
        flight: data.flight || "",
      };
      await ticketsService.create(ticket);
      alertService.success("Ticket for " + ticket.name + " Added", true);
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">
            Customer Name <span className="text-danger">*</span>
          </label>
          <input
            name="name"
            type="text"
            {...register("name")}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">
            Paid Amount <span className="text-danger">*</span>
          </label>
          <input
            name="paid"
            type="text"
            {...register("paid")}
            className={`form-control ${errors.paid ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.paid?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">
            Receiving Amount <span className="text-danger">*</span>
          </label>
          <input
            name="receiving"
            type="text"
            {...register("receiving")}
            className={`form-control ${errors.receiving ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.receiving?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Ticket Number</label>
          <input
            name="ticket"
            type="text"
            {...register("ticket")}
            className={`form-control ${errors.ticket ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.ticket?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Booked on</label>
          <input
            name="booked"
            type="text"
            {...register("booked")}
            className={`form-control ${errors.booked ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.booked?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">Card Number</label>
          <input
            name="card"
            type="text"
            {...register("card")}
            className={`form-control ${errors.card ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.card?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">travel 1</label>
          <input
            name="travel1"
            type="text"
            {...register("travel1")}
            className={`form-control ${errors.travel1 ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.travel1?.message}</div>
        </div>
        <div className="mb-3 col">
          <label className="form-label">travel 2</label>
          <input
            name="travel2"
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
            type="text"
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Flight Number</label>
          <input
            name="flight"
            type="text"
            {...register("flight")}
            className={`form-control ${errors.flight ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.flight?.message}</div>
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
        <Link href="/users" className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}
