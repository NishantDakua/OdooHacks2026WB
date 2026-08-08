import { useEffect, useState } from "react";
import { adminOrderService } from "../../services/adminOrderService";
import DataTable from "../../components/admin/DataTable";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";
import Modal from "../../components/ui/Modal";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await adminOrderService.getCustomers();
      setCustomers(list || []);
    } catch (err) {
      setError(err.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    {
      header: "Customer Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9f6f5] font-semibold text-[#4f8c89] text-xs">
            {row.name ? row.name.charAt(0).toUpperCase() : "C"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">{row.name}</p>
            <p className="text-[11px] text-gray-400">ID: {row.id.slice(-6)}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      render: (row) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => <span>{row.phone || "-"}</span>,
    },
    {
      header: "Rentals Placed",
      accessor: "_count",
      render: (row) => (
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
          {row._count?.ordersAsCustomer || 0} Orders
        </span>
      ),
    },
    {
      header: "Joined Date",
      accessor: "createdAt",
      render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedCustomer(row)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="pb-16 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Directory</h2>
        <p className="mt-1 text-sm text-gray-500">
          Registered rental customers, account activity, and contact details.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoadingFallback />
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          emptyMessage="No customers registered yet."
        />
      )}

      {/* Customer Details Modal */}
      <Modal
        open={Boolean(selectedCustomer)}
        title="Customer Profile"
        onClose={() => setSelectedCustomer(null)}
      >
        {selectedCustomer && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4f8c89] text-base font-bold text-white">
                {selectedCustomer.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">{selectedCustomer.name}</h4>
                <p className="text-xs text-gray-400">Customer ID: {selectedCustomer.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Email Address:</span>
                <p className="font-semibold text-gray-800">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Phone:</span>
                <p className="font-semibold text-gray-800">{selectedCustomer.phone || "Not provided"}</p>
              </div>
              <div>
                <span className="text-gray-400">Total Rentals:</span>
                <p className="font-semibold text-[#4f8c89]">{selectedCustomer._count?.ordersAsCustomer || 0} Orders</p>
              </div>
              <div>
                <span className="text-gray-400">Member Since:</span>
                <p className="font-semibold text-gray-800">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CustomerList;
