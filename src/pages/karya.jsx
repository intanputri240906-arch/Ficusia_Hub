
import hero from "../assets/hero.png";

function Karya({ navigate }) {
  const artworks = [
    {
      title: "The Forest Behind the Mist",
      category: "3D Animation",
      creator: "Intan Rahmadani Putri",
    },
    {
      title: "The Coastal Guardian Robot",
      category: "3D Animation",
      creator: "Intan Rahmadani Putri",
    },
    {
      title: "The Floating City",
      category: "Concept Art",
      creator: "Intan Rahmadani Putri",
    },
  ];

  return (
    <div className="simple-page">
      <nav className="inner-navbar">
        <div
          className="home-logo"
          onClick={() => navigate("home")}
        >
          <div className="logo-icon">
            F
          </div>

          <span>
            FICUSIA HUB
          </span>
        </div>

        <button
          className="navbar-back"
          onClick={() => navigate("home")}
        >
          ← Home
        </button>
      </nav>

      <main className="page-container">
        <div className="page-heading">
          <span className="section-label">
            PORTFOLIO
          </span>

          <h1>
            Explore Artworks
          </h1>

          <p>
            Discover creative works from artists in the
            Ficusia Hub community.
          </p>
        </div>

        <div className="gallery-grid">
          {artworks.map((item, index) => (
            <div
              className="gallery-card"
              key={index}
            >
              <img
                src={hero}
                alt={item.title}
              />

              <div className="gallery-content">
                <span>
                  {item.category}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  By {item.creator}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate("upload")}
        >
          + Upload Artwork
        </button>
      </main>
    </div>
  );
}

export default Karya;