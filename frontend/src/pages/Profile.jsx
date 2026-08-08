import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";

function Profile() {
  const navigate = useNavigate();

  let user = { name: "Customer", role: "Customer", email: "Not available" };

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      user = {
        name: parsedUser.name || parsedUser.firstName || parsedUser.fullName || "Customer",
        role: parsedUser.role || "Customer",
        email: parsedUser.email || "Not available",
      };
    }
  } catch {
    user = { name: "Customer", role: "Customer", email: "Not available" };
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppLayout title="Profile" subtitle="Customer account information" cartCount={0}>
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        <div className="mx-auto max-w-3xl space-y-5">
          <Card className="p-6">
            <h2 className="text-3xl font-semibold tracking-tight text-black">Profile</h2>
            <p className="mt-2 text-sm text-gray-600">Account details are loaded from the authenticated user stored in localStorage.</p>
          </Card>

          <Card className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</p>
                <p className="mt-2 text-sm font-semibold text-black">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Role</p>
                <p className="mt-2 text-sm font-semibold text-black">{user.role}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</p>
                <p className="mt-2 text-sm font-semibold text-black">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Logout
            </button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;