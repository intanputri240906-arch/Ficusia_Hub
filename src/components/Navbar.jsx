
function Navbar({ page, navigate, user, onLogout }) {
  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("home")}
      >
        <div className="navbar-logo">F</div>
        <span>FICUSIA HUB</span>
      </div>

      <div className="navbar-links">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => navigate("home")}
        >
          Home
        </button>

        <button
          className={page === "karya" ? "active" : ""}
          onClick={() => navigate("karya")}
        >
          Discover Art
        </button>

        <button
          className={page === "kreator" ? "active" : ""}
          onClick={() => navigate("kreator")}
        >
          Creators
        </button>

        <button
          className={page === "jobs" ? "active" : ""}
          onClick={() => navigate("jobs")}
        >
          Career
        </button>
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <button
              className="profile-nav-button"
              onClick={() => navigate("profile")}
            >
              My Profile
            </button>

            <button
              className="join-button"
              onClick={onLogout}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              className="login-nav-button"
              onClick={() => navigate("login")}
            >
              Log In
            </button>

            <button
              className="join-button"
              onClick={() => navigate("register")}
            >
              Join the Hub ↗
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;