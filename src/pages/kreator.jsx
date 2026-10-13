
function Kreator({ navigate }) {
  const creators = [
    {
      name: "Intan Rahmadani Putri",
      role: "3D Artist",
      skill: "3D Animation",
      badge: "Sprout",
    },
    {
      name: "Andi Pratama",
      role: "Character Designer",
      skill: "Character Design",
      badge: "Creator",
    },
    {
      name: "Siti Aulia",
      role: "Concept Artist",
      skill: "Concept Art",
      badge: "Creator",
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
            CREATOR DIRECTORY
          </span>

          <h1>
            Discover Creators
          </h1>

          <p>
            Find creative talent based on their
            specializations and skills.
          </p>
        </div>

        <div className="creator-grid">
          {creators.map((item, index) => (
            <div
              className="creator-card"
              key={index}
            >
              <div className="creator-avatar">
                {item.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <span className="profile-badge">
                {item.badge}
              </span>

              <h3>
                {item.name}
              </h3>

              <p>
                {item.role}
              </p>

              <span className="creator-skill">
                {item.skill}
              </span>

              <button
                className="secondary-btn"
                onClick={() => navigate("profile")}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Kreator;