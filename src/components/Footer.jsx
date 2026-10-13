
export default function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <button
          className="footer-brand"
          onClick={() => navigate("home")}
        >
          FICUSIA HUB
        </button>

        <p>
          A creative space for the next generation of artists.
        </p>

        <div className="footer-links">
          <button onClick={() => navigate("artworks")}>
            Discover Art
          </button>

          <button onClick={() => navigate("creators")}>
            Creators
          </button>

          <button onClick={() => navigate("jobs")}>
            Career
          </button>
        </div>

        <span className="footer-copy">
          © 2026 FICUSIA HUB. Made for creative minds.
        </span>
      </div>
    </footer>
  );
}