import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";

function AdminSettings() {
  const [user, setUser] = useState({ name: "Admin", email: "", role: "ADMIN" });
  const [company, setCompany] = useState({
    name: "RentEase Technologies Pvt Ltd",
    email: "support@rentease.com",
    phone: "+91 98765 43210",
    address: "123 Innovation Tech Park, Bangalore, KA - 560100",
    gstin: "29AAAAA0000A1Z5",
  });
  const [rentalDefaults, setRentalDefaults] = useState({
    gracePeriodHours: 1,
    lateFeeDailyRate: 100,
    securityDepositFixed: 1000,
    taxGstRate: 18,
  });

  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          name: parsed.name || parsed.firstName || "Administrator",
          email: parsed.email || "admin@rentease.com",
          role: parsed.role || "ADMIN",
        });
      }
    } catch {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage("Settings saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="pb-16 max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System & Company Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure company parameters, rental defaults, and account credentials.
        </p>
      </div>

      {savedMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
          {savedMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Company Profile & Invoicing</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">GSTIN / Tax ID</label>
              <input
                type="text"
                value={company.gstin}
                onChange={(e) => setCompany({ ...company, gstin: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Billing Email</label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Support Phone</label>
              <input
                type="text"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700">Registered Office Address</label>
              <input
                type="text"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
          </div>
        </Card>

        {/* Rental Defaults */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Rental & Penalty Defaults</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Default Grace Period (Hours)</label>
              <input
                type="number"
                min="0"
                value={rentalDefaults.gracePeriodHours}
                onChange={(e) =>
                  setRentalDefaults({ ...rentalDefaults, gracePeriodHours: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Default Late Fee Rate (₹/day)</label>
              <input
                type="number"
                min="0"
                value={rentalDefaults.lateFeeDailyRate}
                onChange={(e) =>
                  setRentalDefaults({ ...rentalDefaults, lateFeeDailyRate: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Default Security Deposit (₹)</label>
              <input
                type="number"
                min="0"
                value={rentalDefaults.securityDepositFixed}
                onChange={(e) =>
                  setRentalDefaults({ ...rentalDefaults, securityDepositFixed: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-[#4f8c89]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">GST Rate (%)</label>
              <input
                type="number"
                disabled
                value={rentalDefaults.taxGstRate}
                className="mt-1 w-full rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-sm text-gray-500"
              />
            </div>
          </div>
        </Card>

        {/* Account Details */}
        <Card className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Account & Role</h3>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-gray-400">Current User:</span>
              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            </div>
            <div>
              <span className="text-gray-400">Role:</span>
              <p className="font-semibold text-[#4f8c89] text-sm">{user.role}</p>
            </div>
            <div>
              <span className="text-gray-400">Account Email:</span>
              <p className="font-semibold text-gray-800 text-sm">{user.email}</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[#4f8c89] px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3d726f]"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettings;
