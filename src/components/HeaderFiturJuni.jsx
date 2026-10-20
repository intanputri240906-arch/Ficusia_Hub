import "../pages/fiturjuni.css";

function HeaderFiturJuni({ navigate, backTo = "home", backLabel = "← Home" }) {
  return (
    <header className="jn-header">
      <div className="jn-logo" onClick={() => navigate("home")}>
        <div className="jn-logo-icon">F</div>
        <span>FICUSIA HUB</span>
      </div>

      <button
        type="button"
        className="jn-back"
        onClick={() => navigate(backTo)}
      >
        {backLabel}
      </button>
    </header>
  );
}

export default HeaderFiturJuni;
