import { useState } from "react";
import axios from "axios";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = async () => {
    const res = await axios.post("http://localhost:5000/auth/register", {
      email,
      password
    });

    setMessage(res.data);
  };

  const login = async () => {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password
    });

    setMessage(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>MERN Login System</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      <h3>{message}</h3>

    </div>
  );
}

export default App;