import Card from "../ui/Card";

function AdminStatCard({ label, value, subtext, icon }) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e9f6f5] text-[#4f8c89]">
            {icon}
          </div>
        )}
      </div>
      {subtext && <p className="mt-4 text-xs font-medium text-gray-400">{subtext}</p>}
    </Card>
  );
}

export default AdminStatCard;
