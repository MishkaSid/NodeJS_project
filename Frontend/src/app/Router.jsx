import { useEffect, useState } from "react";
import LoginPage from "../pages/Login/Login-page";
import ManagerDashboard from "../pages/manager/home/Manager";
import UserPermissions from "../pages/manager/permissions/UserPermissions";
import ManageContent from "../pages/manager/manageContent/ManageContent";
import UnauthorizedPage from "../pages/unauthorize/Unauthorize";
import NotFound from "../pages/not found/NotFound";
import Layout from "./Layout";
import { useAuth } from "../context/AuthContext";


/**
 * @component Router
 * @description A custom router component that handles client-side routing based on the window's pathname.
 * It conditionally renders different pages or layouts based on the current path and user authentication status.
 * It also includes protected routes that require a user to be logged in and have a specific role.
 * @returns {JSX.Element} The JSX element for the current route.
 */
const Router = () => {
  const [path, setPath] = useState(window.location.pathname);
  const { user } = useAuth();

  /**
   * @effect
   * @description This effect adds an event listener for the 'popstate' event to update the component's
   * 'path' state whenever the browser's history changes. This ensures the component re-renders
   * with the correct page when the user navigates using the browser's back and forward buttons.
   * The event listener is cleaned up when the component unmounts.
   */
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /**
   * @function navigate
   * @description A helper function to programmatically navigate to a different URL.
   * It uses the History API to push a new state and then dispatches a 'popstate' event
   * to make the Router and other components aware of the URL change.
   * @param {string} to - The path to navigate to.
   */
  const navigate = (to) => {
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (path === "/") return <LoginPage />;
  if (path === "/unauthorized") return <UnauthorizedPage />;

  // Manual protected routes
  if (!user) return <UnauthorizedPage />;

  if (["/manager", "/manager/permissions", "/manager/manageContent"].includes(path)) {
    if (!["Admin", "Teacher", "Examinee"].includes(user.role)) {
      return <UnauthorizedPage />;
    }

    return (
      <Layout>
        {path === "/manager" && <ManagerDashboard />}
        {path === "/manager/permissions" && <UserPermissions />}
        {path === "/manager/manageContent" && <ManageContent />}
      </Layout>
    );
  }

  return <NotFound />;
};

export default Router;
