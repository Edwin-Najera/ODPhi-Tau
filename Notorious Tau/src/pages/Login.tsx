import { useState } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { showMessage } from "../utils/handle";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Popup from "../components/Admin/PopupFolder/Popup";
import sword from "../components/Photos/sword.png";
import Sparks from "../components/Admin/Spark";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });
  const navigate = useNavigate();

  const handleEnter = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role;

      if (role === "active" || role === "admin" || role === "bro") {
        navigate("/Onlybros/AllBros");
      } else if (role === "alumni") {
        navigate("/Onlybros/Alumni");
      } else {
        showMessage("No Role Assigned. Contact Admin", "save", setPopup);
      }
    } catch (error) {
      showMessage("Invalid Login", "save", setPopup);
      console.error(error);
    }
  };

  return (
    <>
      <Sparks />
      <div className="login-page">
        <img className="sword" src={sword} alt="sword" />
        <div className="login-form" onKeyDown={handleEnter}>
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: null })}
          duration={1000}
        />
      )}
    </>
  );
}

export default Login;
