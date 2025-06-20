import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * The main layout component without react-router.
 * Wraps content with header, sidebar, and footer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render inside layout.
 * @returns {JSX.Element}
 */
const Layout = ({ children }) => {
  const { user: loggedInUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  // This effect listens for browser navigation events and updates the path state.
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // This memoized value determines the user type based on the user's role or the current path.
  const userType = useMemo(() => {
    if (loggedInUser?.role) return loggedInUser.role;
    if (path.includes("manager")) return "Admin";
    if (path.includes("teacher")) return "Teacher";
    return "Examinee";
  }, [loggedInUser, path]);

  // Toggles the sidebar's open/closed state.
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userType={userType} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
