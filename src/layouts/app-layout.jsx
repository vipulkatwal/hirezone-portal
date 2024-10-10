import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Grid */}
      <div className="grid-background fixed inset-0 z-0"></div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Header />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-900 mt-10 relative z-10">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <img src="/logo.png" alt="hirezone logo" className="h-8 w-auto mb-2" />
              <p className="text-sm">&copy; 2024. All rights reserved.</p>
            </div>
            <nav>
              <ul className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
                <li>
                  <a href="#" className="text-sm hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline">Contact Us</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;