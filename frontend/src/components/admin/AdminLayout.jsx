import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#f7fbfb]">
      <AdminSidebar />
      <div className="flex h-screen min-w-0 flex-col overflow-hidden pl-[240px]">
        {/* The title/subtitle will be dynamic later or passed via context, 
            but for now we can render a generic header or omit title to let pages handle it */}
        <AdminHeader title="Dashboard" />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
