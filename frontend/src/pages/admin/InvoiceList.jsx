import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminOrderService } from "../../services/adminOrderService";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import PageLoadingFallback from "../../components/ui/PageLoadingFallback";
import Modal from "../../components/ui/Modal";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch all orders and aggregate invoices
      const orders = await adminOrderService.getOrders();
      const allInvoices = [];
      orders.forEach((o) => {
        if (o.invoices && o.invoices.length > 0) {
          o.invoices.forEach((inv) => {
            allInvoices.push({
              ...inv,
              customer: o.customer,
              orderNumber: o.orderNumber || `#R${o.id.slice(-4)}`,
              rentalOrderId: o.id,
            });
          });
        }
      });
      setInvoices(allInvoices);
    } catch (err) {
      setError(err.message || "Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      header: "Invoice #",
      accessor: "invoiceNumber",
      render: (row) => <span className="font-semibold text-gray-900">{row.invoiceNumber}</span>,
    },
    {
      header: "Customer",
      accessor: "customer",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer?.name || "Customer"}</p>
          <p className="text-xs text-gray-400">{row.customer?.email || "-"}</p>
        </div>
      ),
    },
    {
      header: "Rental Order",
      accessor: "orderNumber",
      render: (row) => (
        <Link
          to={`/admin/orders/${row.rentalOrderId}`}
          className="font-medium text-[#4f8c89] hover:underline"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      header: "Issued Date",
      accessor: "issuedAt",
      render: (row) => <span>{new Date(row.issuedAt || row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Total Amount",
      accessor: "amount",
      render: (row) => <span className="font-bold text-gray-900">₹{row.amount}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedInvoice(row)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          View / Print
        </button>
      ),
    },
  ];

  return (
    <div className="pb-16 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rental Invoices</h2>
          <p className="mt-1 text-sm text-gray-500">Official billing and tax invoices.</p>
        </div>
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
          data={invoices}
          emptyMessage="No invoices generated yet. Create an invoice directly from a confirmed Rental Order."
        />
      )}

      {/* View & Print Invoice Modal */}
      <Modal
        open={Boolean(selectedInvoice)}
        title={`Invoice ${selectedInvoice?.invoiceNumber || ""}`}
        onClose={() => setSelectedInvoice(null)}
      >
        {selectedInvoice && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="font-bold text-gray-900">RentEase Rental Invoice</p>
                <p className="text-xs text-gray-500">Order: {selectedInvoice.orderNumber}</p>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Customer:</span>
                <p className="font-semibold text-gray-800">{selectedInvoice.customer?.name}</p>
                <p className="text-gray-500">{selectedInvoice.customer?.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <p className="font-semibold text-gray-800">
                  {new Date(selectedInvoice.issuedAt || selectedInvoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Rental Subtotal:</span>
                <span>₹{selectedInvoice.amount - (selectedInvoice.taxAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18%):</span>
                <span>₹{selectedInvoice.taxAmount || 0}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm text-gray-900">
                <span>Total Invoice:</span>
                <span className="text-[#4f8c89]">₹{selectedInvoice.amount}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
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

export default InvoiceList;
