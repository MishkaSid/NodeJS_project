import { useState } from "react";
import axios from "axios";
import classes from "./login.module.css";
import Popup from "../../components/popup/Popup";
import { useAuth } from "../../context/AuthContext";
import { navigate } from "../../app/navigate"; // 👈 custom navigation function

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token } = response.data;

      // ✅ Save token via AuthContext
      login(token);

      // ✅ Decode token to determine role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // ✅ Navigate by role using custom function
      switch (role) {
        case "Admin":
          navigate("/manager");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Examinee":
          navigate("/student");
          break;
        default:
          navigate("/not-found");
      }
    } catch (error) {
      const message =
         error.response?.data?.message || "אירעה שגיאה כללית בעת ההתחברות.";
      setLoginErrorMessage(message);
      setShowPopup(true);
    }
  };

  return (
    <div className={classes.loginPage}>
      <div className={classes.background}></div>
      <div className={classes.homepage}>
        <div className={classes.logos}>
          <img
            className={classes.logo}
            src="src/assets/images/logoBeta.PNG"
            alt="logo"
          />
          <img
            className={classes.schoolLogo}
            src="https://www.pet.ac.il/images/logo.png"
            alt="school-logo"
          />
        </div>
        <div className={classes.welcome}>
          <p>
            ברוכים הבאים למוכנים ובגדול – המערכת לתרגול מבחני הכניסה לבית הספר
            הארצי להנדסאים בקריית הטכניון
          </p>
        </div>
        <div className={classes.login}>
          <h1>כניסה</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">התחבר</button>
          </form>
          <div className={classes.warning}>
            <p>שימו לב! פלטפורמה זו הינה כלי עזר ואינה תחליף ללמידה עצמית</p>
          </div>
        </div>
      </div>
      <Popup
        header="שגיאה בהתחברות"
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <div className={classes.popupContent}>
          <p style={{ color: "black" }}>{loginErrorMessage}</p>
        </div>
      </Popup>
    </div>
  );
}

export default LoginPage;
