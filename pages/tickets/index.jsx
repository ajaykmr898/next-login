import Link from "next/link";
import { Layout } from "components/users";

export default Index;

function Index() {
  return (
    <Layout>
      <h1>Tickets</h1>
      <Link href="/users/add" className="btn btn-sm btn-success mb-2">
        Add Ticket
      </Link>
      <table id="example" className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Office</th>
            <th>Age</th>
            <th>Start date</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Zenaida Frank</td>
            <td>Software Engineer</td>
            <td>New York</td>
            <td>63</td>
            <td>2010-01-04</td>
            <td>$125,250</td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
}
