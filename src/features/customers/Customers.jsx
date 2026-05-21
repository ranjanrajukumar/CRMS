import AppLayout from "../../components/layout/AppLayout";

const customers = [
  {
    id: "CUS-001",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "ravi.kumar@example.com",
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Priya Sharma",
    phone: "+91 91234 56789",
    email: "priya.sharma@example.com",
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "Arjun Mehta",
    phone: "+91 99887 76655",
    email: "arjun.mehta@example.com",
    status: "Pending",
  },
];

function Customers() {
  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Directory
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Customers
          </h1>
        </div>

        <button
          type="button"
          className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Add Customer
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-950">Customer List</h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all registered customers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Customer ID</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {customer.id}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {customer.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {customer.phone}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {customer.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}

export default Customers;
