import AppLayout from "../../../components/layout/AppLayout";

function RequestedSms() {
  return (
    <AppLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Operation
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Requested SMS
        </h1>
      </div>
    </AppLayout>
  );
}

export default RequestedSms;
