import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const NavigationBar = ({ isAdmin, onCreateProjectClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Top Navbar (mobile only) */}
      <nav className="bg-blue-600 text-white px-6 py-4 shadow-md rounded-b-2xl flex justify-between items-center md:hidden">
        <div className="text-xl font-medium tracking-tight">BugBoard</div>
        <button onClick={toggleSidebar} className="text-white">
          <Menu size={28} />
        </button>
      </nav>

      {/* Sidebar (mobile) / Topbar (desktop) */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-blue-600 text-white transform transition-transform duration-300 z-50 rounded-r-2xl shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-auto md:flex md:w-full md:items-center md:justify-between md:px-6 md:py-4 md:shadow-md md:rounded-none`}
      >
        <div className="flex flex-col p-4 md:p-1 space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6 w-full">
          <span className="text-lg font-medium tracking-tight">
            Welcome, {user?.name || "User"}
          </span>

          <div className="md:ml-auto flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            {isAdmin && (
              <button
                onClick={onCreateProjectClick}
                className="bg-white text-blue-600 font-medium px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition"
              >
                + Create Project
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-[#FCD8DF] text-[#410002] font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
