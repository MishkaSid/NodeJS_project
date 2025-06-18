import { useEffect, useState } from "react";
import LoginPage from "../pages/Login/Login-page";
import ManagerDashboard from "../pages/manager/home/Manager";
import UserPermissions from "../pages/manager/permissions/UserPermissions";
import ManageContent from "../pages/manager/manageContent/ManageContent";
import UnauthorizedPage from "../pages/unauthorize/Unauthorize";
import NotFound from "../pages/not found/NotFound";
import Layout from "./Layout";
import { useAuth } from "../context/AuthContext";


const Router = () => {
  const [path, setPath] = useState(window.location.pathname);
  const { user } = useAuth();

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

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
