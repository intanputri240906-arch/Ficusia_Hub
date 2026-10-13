
function Login({ login, navigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      name: "Intan Rahmadani Putri",
      email: "intan@gmail.com",
    });
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="logo-icon">F</div>
          <span>FICUSIA HUB</span>
        </div>

        <div className="login-intro">
          <span className="section-label">
            PORTFOLIO & CAREER DIRECTORY
          </span>

          <h1>
            Showcase your work.
            <br />
            Discover opportunities.
          </h1>

          <p>
            Build your creator profile, showcase your portfolio,
            and discover opportunities in the animation industry.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <span className="login-small">
            WELCOME BACK
          </span>

          <h2>Sign in to Ficusia Hub</h2>

          <p className="login-description">
            Sign in to manage your profile and portfolio.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              defaultValue="intan@gmail.com"
              required
            />

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              defaultValue="12345"
              required
            />

            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>
          </form>

          <div className="login-register">
            <span>Don't have an account?</span>

            <button
              type="button"
              onClick={() => navigate("register")}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;