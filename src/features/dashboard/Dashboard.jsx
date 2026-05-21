import AppLayout from "../../components/layout/AppLayout";

function Dashboard() {
  return (
    <AppLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Dashboard</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["Customers", "Collections", "Payments", "Reports"].map((title) => (
          <div
            key={title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-2xl font-bold text-slate-950">0</p>
          </div>
        ))}
      </section>
    </AppLayout>
  );
}

export default Dashboard;
