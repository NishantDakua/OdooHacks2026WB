import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";

function Rentals() {
  return (
    <AppLayout title="My Rentals" subtitle="Active and past rentals" cartCount={0}>
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card className="p-6">
            <h2 className="text-3xl font-semibold tracking-tight text-black">My Rentals</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This customer page is ready in the frontend, but the rental history and active rental data are
              backend dependent and have not been connected yet.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-black">No active rentals</h3>
            <p className="mt-2 text-sm text-gray-600">Once rental records are connected from the backend, they will appear here.</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default Rentals;