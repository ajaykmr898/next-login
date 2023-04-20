import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { userService, alertService } from "services";

export { AddEdit };

function AddEdit(props) {
  const user = props?.user;
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    ticket: Yup.string().required("Ticket Number is required"),
    booked: Yup.string().required("Booked On is required"),
    paid: Yup.string().required("Paid Amount is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // set default form values if in edit mode
  if (user) {
    formOptions.defaultValues = props.user;
  }

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  async function onSubmit(data) {
    alertService.clear();
    try {
      // create or update user based on user prop
      let message;
      if (user) {
        await userService.update(user.id, data);
        message = "User updated";
      } else {
        await userService.register(data);
        message = "User added";
      }

      // redirect to user list with success message
      router.push("/users");
      alertService.success(message, true);
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="mb-3 col">
          <label className="form-label">Customer Name</label>
          <input
            name="name"
            type="text"
            {...register("name")}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.name?.message}</div>
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
          <label className="form-label">Paid Amount</label>
          <input
            name="paid"
            type="text"
            {...register("paid")}
            className={`form-control ${errors.paid ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.paid?.message}</div>
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
        <button
          onClick={() => reset(formOptions.defaultValues)}
          type="button"
          disabled={formState.isSubmitting}
          className="btn btn-secondary"
        >
          Reset
        </button>
        <Link href="/users" className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}
