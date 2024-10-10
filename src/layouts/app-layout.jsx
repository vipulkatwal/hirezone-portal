import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      {/* Background Grid */}
      <div className="grid-background"></div>

      {/* Main Content */}
      <main className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-900 mt-10">
        <div className="container mx-auto py-6 text-center">
        <img src="/logo.png" alt="hirezone logo" className="mx-auto h-12 w-auto" />
          <p className="text-sm mt-1">&copy; 2024. All rights reserved.</p>

          <div className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li>
                <a href="#" className="hover:underline">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
