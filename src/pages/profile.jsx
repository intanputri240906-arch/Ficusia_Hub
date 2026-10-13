
function Profile({ navigate }) {
  const portfolio = [
    {
      title: "The Forest Behind the Mist",
      category: "3D Animation",
      tool: "Blender",
      image: "/src/assets/hero.png",
    },
    {
      title: "The Coastal Guardian Robot",
      category: "3D Animation",
      tool: "Blender",
      image: "/src/assets/hero.png",
    },
    {
      title: "The Floating City",
      category: "Concept Art",
      tool: "Adobe Photoshop",
      image: "/src/assets/hero.png",
    },
  ];

  return (
    <div className="profile-container">
      {/* PROFILE HEADER */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-photo">IP</div>

          <div className="profile-info">
            <div className="profile-name">
              <h1>Intan Rahmadani Putri</h1>
              <span className="profile-badge">Sprout</span>
            </div>

            <p className="profile-role">
              Animation Student · Batam State Polytechnic
            </p>

            <p className="profile-description">
              A creator passionate about animation, character
              design, and digital artwork.
            </p>

            <div className="profile-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("editprofile")}
              >
                Edit Profile
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  alert("Profile sharing will be available soon.")
                }
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE CONTENT */}
        <div className="profile-content">
          <div className="profile-main">
            {/* SPECIALIZATIONS */}
            <div className="profile-section">
              <h3>Specializations</h3>

              <div className="specialization-list">
                <span>3D Animation</span>
                <span>Character Design</span>
                <span>Concept Art</span>
              </div>
            </div>

            {/* ABOUT ME */}
            <div className="profile-section">
              <h3>About Me</h3>

              <p>
                I am an animation student interested in animation,
                character design, and digital artwork. I continue
                to develop my skills in creating visual content
                using various design and animation software.
              </p>
            </div>

            {/* PORTFOLIO */}
            <div className="profile-section">
              <div className="section-title">
                <h3>Portfolio</h3>

                <button
                  className="text-btn"
                  onClick={() => navigate("karya")}
                >
                  View All →
                </button>
              </div>

              <div className="portfolio-grid">
                {portfolio.map((item, index) => (
                  <div className="portfolio-card" key={index}>
                    <div className="portfolio-image">
                      <img src={item.image} alt={item.title} />
                    </div>

                    <div className="portfolio-body">
                      <h4>{item.title}</h4>
                      <p>{item.category}</p>

                      <span className="tool-tag">
                        {item.tool}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJECT EXPERIENCE */}
            <div className="profile-section">
              <h3>Project Experience</h3>

              <div className="project-item">
                <div className="project-dot"></div>

                <div>
                  <h4>Digital Animation Project</h4>

                  <p>
                    A learning project focused on creating
                    digital animation artwork.
                  </p>

                  <span>
                    2026 · Project-Based Learning
                  </span>
                </div>
              </div>
            </div>

            {/* CV */}
            <div className="profile-section">
              <h3>Curriculum Vitae</h3>

              <div className="cv-box">
                <div>
                  <strong>Curriculum Vitae</strong>
                  <p>Intan Rahmadani Putri's CV</p>
                </div>

                <button
                  className="secondary-btn"
                  onClick={() => alert("CV viewing will be available soon.")}
                >
                  View CV
                </button>
              </div>
            </div>
          </div>

          {/* PROFILE SIDEBAR */}
          <div className="profile-sidebar">
            {/* SOFTWARE SKILLS */}
            <div className="sidebar-card">
              <h3>Software Skills</h3>

              <div className="skill-list">
                <span>Blender</span>
                <span>Adobe Photoshop</span>
                <span>Adobe Illustrator</span>
                <span>Adobe After Effects</span>
              </div>
            </div>

            {/* CREATOR BADGE */}
            <div className="sidebar-card">
              <h3>Creator Badge</h3>

              <div className="badge-box">
                <div className="badge-icon">S</div>

                <div>
                  <strong>Sprout</strong>

                  <p>
                    A creator who has recently joined
                    Ficusia Hub.
                  </p>
                </div>
              </div>
            </div>

            {/* INFORMATION */}
            <div className="sidebar-card">
              <h3>Information</h3>

              <div className="info-item">
                <span>Program</span>
                <strong>Animation</strong>
              </div>

              <div className="info-item">
                <span>Status</span>
                <strong>Student</strong>
              </div>

              <div className="info-item">
                <span>Location</span>
                <strong>Batam</strong>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTON */}
        <div className="profile-actions">
          <button
            className="secondary-btn"
            onClick={() => navigate("home")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;