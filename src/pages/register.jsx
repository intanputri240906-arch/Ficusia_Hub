
import { useState } from "react";

function Register({ navigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Registration submitted successfully. Please sign in.");

    navigate("login");
  };

  return (
    <div className="auth-container">
      <form
        className="form-card"
        onSubmit={handleSubmit}
      >
        <h2>Create an Account</h2>

        <label htmlFor="register-name">Full Name</label>

        <input
          id="register-name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="register-email">Email Address</label>

        <input
          id="register-email"
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="register-password">Password</label>

        <input
          id="register-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="primary-btn full"
          type="submit"
        >
          Create Account
        </button>

        <p>
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("login")}
          >
            Sign In
          </button>
        </p>

      </form>
    </div>
  );
}

export default Register;