import { useState } from "react";
import axios from "axios";
import classes from "./login.module.css";
import Popup from "../../components/popup/Popup";
import { useAuth } from "../../context/AuthContext";
import { navigate } from "../../app/navigate";
import UserForm from "../../components/form/UserForm";

function LoginPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      const { token } = response.data;
      login(token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;
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
          <UserForm
            mode="login"
            onSubmit={handleLogin}
            onValidationError={(msg) => {
              setLoginErrorMessage(msg);
              setShowPopup(true);
            }}
            className={`${classes.form} ${classes.loginForm}`}
          />
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
