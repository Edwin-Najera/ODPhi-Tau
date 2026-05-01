import { useState, Fragment } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import sword from "../components/Photos/sword.png";
import Sparks from "../components/Admin/Spark";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="login-page">
        <img className="sword" src={sword} alt="sword" />
        <Sparks />
        <div className="login-form">
          <h2>Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </Fragment>
  );
}

export default Login;
