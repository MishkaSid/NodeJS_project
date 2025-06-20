import { AuthProvider } from "../context/AuthContext";
import Router from "./Router";

/**
 * @function App
 * @description The root component of the application. It wraps the entire application with the AuthProvider
 * to provide authentication context to all child components.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
