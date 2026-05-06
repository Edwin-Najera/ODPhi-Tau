import { useState, Fragment } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import sword from "../components/Photos/sword.png";
import Sparks from "../components/Admin/Spark";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        navigate("/AllBros");
      } else if (role === "alumni") {
        navigate("/Alumni");
      } else {
        alert("No role assigned, contact admin");
      }
    } catch (error) {
      alert("Invalid Login");
      console.error(error);
    }
  };

  return (
    <Fragment>
      <Sparks />
      <div className="login-page">
        <img className="sword" src={sword} alt="sword" />
        <div className="login-form">
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
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
          <br />
          <br />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
