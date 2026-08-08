import Card from "../ui/Card";
import StatusBadge from "./StatusBadge";

function DepositSummary({ deposit }) {
  if (!deposit) {
    return (
      <Card className="p-6">
        <h3 className="text-base font-semibold text-gray-900">Security Deposit</h3>
        <p className="mt-2 text-xs text-gray-400">No security deposit configured for this order.</p>
      </Card>
    );
  }

  const collected = Number(deposit.amountCollected || 0);
  const deductions = Number(deposit.totalDeduction || 0);
  const refunded = Number(deposit.refundAmount || 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Security Deposit</h3>
          <p className="text-[11px] text-gray-500">Refundable deposit (held separately from rental revenue)</p>
        </div>
        <StatusBadge status={deposit.status || "PENDING"} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-gray-500">Deposit Type:</span>
          <p className="font-semibold text-gray-800">{deposit.amountType || "FIXED"}</p>
        </div>

        <div>
          <span className="text-gray-500">Amount Collected:</span>
          <p className="font-bold text-gray-900 text-sm">₹{collected.toLocaleString()}</p>
        </div>

        {deposit.lateFeeDeducted > 0 && (
          <div>
            <span className="text-gray-500">Late Fee Deducted:</span>
            <p className="font-semibold text-red-600">-₹{deposit.lateFeeDeducted}</p>
          </div>
        )}

        {deposit.damageDeducted > 0 && (
          <div>
            <span className="text-gray-500">Damage Deducted:</span>
            <p className="font-semibold text-red-600">-₹{deposit.damageDeducted}</p>
          </div>
        )}

        {deductions > 0 && (
          <div>
            <span className="text-gray-500">Total Deductions:</span>
            <p className="font-semibold text-red-600">₹{deductions.toLocaleString()}</p>
          </div>
        )}

        {deposit.status === "REFUNDED" && (
          <div>
            <span className="text-gray-500">Refund Paid:</span>
            <p className="font-semibold text-emerald-600">₹{refunded.toLocaleString()}</p>
          </div>
        )}
      </div>

      {deposit.notes && (
        <div className="mt-4 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600 border border-gray-100">
          <span className="font-medium">Inspection Notes: </span>
          {deposit.notes}
        </div>
      )}
    </Card>
  );
}

export default DepositSummary;
