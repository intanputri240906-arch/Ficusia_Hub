
import { useState } from "react";

const artworks = [
  {
    id: 1,
    title: "The Forest Behind the Mist",
    creator: "Intan Rahmadani Putri",
    category: "3D Animation",
    tool: "Blender",
    color: "#52765b",
    letter: "F",
  },
  {
    id: 2,
    title: "The Coastal Guardian",
    creator: "Juni Friskenny Sinaga",
    category: "Concept Art",
    tool: "Photoshop",
    color: "#b77955",
    letter: "C",
  },
  {
    id: 3,
    title: "The Floating City",
    creator: "Rafi Pratama",
    category: "Concept Art",
    tool: "Procreate",
    color: "#657ca5",
    letter: "F",
  },
  {
    id: 4,
    title: "A Little Digital World",
    creator: "Dewi Lestari",
    category: "2D Animation",
    tool: "Toon Boom",
    color: "#9b83a9",
    letter: "D",
  },
];

const creators = [
  {
    name: "Intan Rahmadani Putri",
    role: "3D Animator",
    badge: "Ficus",
    initials: "IP",
    color: "#37745b",
  },
  {
    name: "Juni Friskenny Sinaga",
    role: "Concept Artist",
    badge: "Sapling",
    initials: "JS",
    color: "#ba7958",
  },
  {
    name: "Rafi Pratama",
    role: "Motion Designer",
    badge: "Sprout",
    initials: "RP",
    color: "#6379a8",
  },
];

const jobs = [
  {
    title: "Junior 3D Animator",
    company: "Studio Kepri Kreatif",
    type: "Internship",
    location: "Batam",
  },
  {
    title: "Motion Designer",
    company: "Batam Pixel Works",
    type: "Full-time",
    location: "Batam",
  },
  {
    title: "Concept Artist",
    company: "Nusantara Games",
    type: "Freelance",
    location: "Remote",
  },
];

const categories = [
  "All Works",
  "3D Animation",
  "2D Animation",
  "Concept Art",
  "Motion Graphics",
];

function App() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Works");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = (
      artwork.title + " " +
      artwork.creator + " " +
      artwork.category + " " +
      artwork.tool
    ).toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Works" || artwork.category === category;

    return matchesSearch && matchesCategory;
  });

  const signOut = () => {
    setUser(null);
    navigate("home");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      window.alert("Please enter your email and password.");
      return;
    }

    setUser({
      name: email.split("@")[0] || "Creator",
      email,
      role: "Creator",
    });

    navigate("creator-dashboard");
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      window.alert("Please complete all required fields.");
      return;
    }

    setUser({
      name: fullName,
      email,
      role: "Creator",
    });

    navigate("creator-dashboard");
  };

  const ArtworkCard = ({ artwork }) => (
    <article className="artwork-card">
      <button
        type="button"
        className="artwork-visual"
        style={{ background: artwork.color }}
        onClick={() => {
          setSelectedArtwork(artwork);
          navigate("artwork-detail");
        }}
        aria-label={`View ${artwork.title}`}
      >
        <span>{artwork.letter}</span>
        <small>{artwork.category}</small>
      </button>

      <div className="artwork-info">
        <span className="eyebrow">{artwork.category}</span>
        <h3>{artwork.title}</h3>
        <p>By {artwork.creator}</p>
        <div className="artwork-bottom">
          <span className="tool-label">{artwork.tool}</span>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setSelectedArtwork(artwork);
              navigate("artwork-detail");
            }}
          >
            View Work ↗
          </button>
        </div>
      </div>
    </article>
  );

  const CreatorCard = ({ creator }) => (
    <article className="creator-card">
      <div
        className="creator-avatar"
        style={{ background: creator.color }}
      >
        {creator.initials}
      </div>

      <span className={`badge badge-${creator.badge.toLowerCase()}`}>
        {creator.badge}
      </span>

      <h3>{creator.name}</h3>
      <p>{creator.role}</p>

      <button
        type="button"
        className="button button-outline"
        onClick={() => navigate("creator-profile")}
      >
        View Profile
      </button>
    </article>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div
          className="brand"
          onClick={() => navigate("home")}
          role="button"
          tabIndex={0}
        >
          <span className="brand-mark">F</span>
          <span>FICUSIA HUB</span>
        </div>

        <nav className="main-nav">
          <button
            className={page === "home" ? "nav-active" : ""}
            onClick={() => navigate("home")}
          >
            Home
          </button>

          <button
            className={page === "artworks" ? "nav-active" : ""}
            onClick={() => navigate("artworks")}
          >
            Discover Art
          </button>

          <button
            className={page === "creators" ? "nav-active" : ""}
            onClick={() => navigate("creators")}
          >
            Creators
          </button>

          <button
            className={page === "careers" ? "nav-active" : ""}
            onClick={() => navigate("careers")}
          >
            Career
          </button>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <button
                className="button button-outline"
                onClick={() => navigate("creator-dashboard")}
              >
                My Dashboard
              </button>
              <button className="button button-primary" onClick={signOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                className="button button-outline"
                onClick={() => navigate("login")}
              >
                Log In
              </button>
              <button
                className="button button-primary"
                onClick={() => navigate("register")}
              >
                Join the Hub ↗
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        {page === "home" && (
          <>
            <section className="hero-section">
              <div className="hero-content">
                <span className="eyebrow hero-eyebrow">
                  THE CREATIVE COMMUNITY
                </span>

                <h1>
                  Your creativity.
                  <br />
                  <span>Your next opportunity.</span>
                </h1>

                <p>
                  Discover animation portfolios, connect with creative
                  talent, and find your place in the creative industry.
                </p>

                <div className="hero-actions">
                  <button
                    className="button button-light"
                    onClick={() => navigate("artworks")}
                  >
                    Explore Artworks ↗
                  </button>

                  <button
                    className="button button-hero-outline"
                    onClick={() => navigate("register")}
                  >
                    Become a Creator
                  </button>
                </div>

                <div className="hero-note">
                  <span>✳</span>
                  A creative space for animation students and alumni.
                </div>
              </div>

              <div className="hero-art">
                <div className="hero-art-main">
                  <span>F</span>
                  <div className="hero-art-caption">
                    <small>CREATIVE SPOTLIGHT</small>
                    <strong>Ideas become worlds.</strong>
                  </div>
                </div>

                <div className="floating-note note-top">
                  <span>✳</span> Create something meaningful
                </div>

                <div className="floating-note note-bottom">
                  <strong>01 / 04</strong>
                  <span>Featured projects</span>
                </div>
              </div>
            </section>

            <section className="section-block">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">EXPLORE THE COMMUNITY</span>
                  <h2>Find your inspiration.</h2>
                  <p>
                    Explore original work from emerging animation talent.
                  </p>
                </div>

                <button
                  className="text-link"
                  onClick={() => navigate("artworks")}
                >
                  Explore All Works ↗
                </button>
              </div>

              <div className="category-list">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={`category-chip ${
                      category === item ? "category-active" : ""
                    }`}
                    onClick={() => {
                      setCategory(item);
                      navigate("artworks");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="artwork-grid">
                {artworks.slice(0, 3).map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            </section>

            <section className="section-block">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">MEET THE CREATORS</span>
                  <h2>Talent worth discovering.</h2>
                  <p>
                    Meet artists bringing new ideas to life.
                  </p>
                </div>

                <button
                  className="text-link"
                  onClick={() => navigate("creators")}
                >
                  Meet All Creators ↗
                </button>
              </div>

              <div className="creator-grid">
                {creators.map((creator) => (
                  <CreatorCard key={creator.name} creator={creator} />
                ))}
              </div>
            </section>

            <section className="career-banner">
              <div>
                <span className="eyebrow">YOUR NEXT CHAPTER</span>
                <h2>Great work deserves great opportunities.</h2>
                <p>
                  Find internships, freelance projects, and career
                  opportunities in the creative industry.
                </p>
              </div>

              <button
                className="button button-light"
                onClick={() => navigate("careers")}
              >
                Explore Careers ↗
              </button>
            </section>
          </>
        )}

        {page === "artworks" && (
          <section className="inner-page">
            <span className="eyebrow">THE GALLERY</span>
            <h1>Discover Artworks</h1>
            <p className="page-description">
              Explore creative projects from the Ficusia Hub community.
            </p>

            <div className="filter-panel">
              <input
                type="search"
                placeholder="Search artworks, creators, or tools..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="artwork-grid">
              {filteredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>

            {filteredArtworks.length === 0 && (
              <p>No artworks found. Try another search or category.</p>
            )}
          </section>
        )}

        {page === "creators" && (
          <section className="inner-page">
            <span className="eyebrow">CREATOR DIRECTORY</span>
            <h1>Meet the Creators</h1>
            <p className="page-description">
              Discover artists, animators, and designers in our community.
            </p>

            <div className="creator-grid">
              {creators.map((creator) => (
                <CreatorCard key={creator.name} creator={creator} />
              ))}
            </div>
          </section>
        )}

        {page === "careers" && (
          <section className="inner-page">
            <span className="eyebrow">CAREER DIRECTORY</span>
            <h1>Creative Opportunities</h1>
            <p className="page-description">
              Find your next internship, freelance project, or full-time role.
            </p>

            <div className="job-list">
              {jobs.map((job) => (
                <article className="job-card" key={job.title}>
                  <div className="job-icon">↗</div>

                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                    <div className="job-meta">
                      <span>{job.type}</span>
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <button
                    className="button button-outline"
                    onClick={() => navigate("login")}
                  >
                    View Opportunity
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === "artwork-detail" && (
          <section className="inner-page detail-layout">
            <button
              className="text-link"
              onClick={() => navigate("artworks")}
            >
              ← Back to Artworks
            </button>

            {selectedArtwork && (
              <>
                <div
                  className="detail-art"
                  style={{ background: selectedArtwork.color }}
                >
                  {selectedArtwork.letter}
                </div>

                <span className="eyebrow">{selectedArtwork.category}</span>
                <h1>{selectedArtwork.title}</h1>
                <p>Created by {selectedArtwork.creator}</p>
                <p>Tools used: {selectedArtwork.tool}</p>

                <button
                  className="button button-primary"
                  onClick={() => navigate(user ? "creator-dashboard" : "login")}
                >
                  {user ? "Back to Dashboard" : "Sign In to Interact"}
                </button>
              </>
            )}
          </section>
        )}

        {page === "creator-profile" && (
          <section className="inner-page">
            <button
              className="text-link"
              onClick={() => navigate("creators")}
            >
              ← Back to Creators
            </button>

            <div className="profile-preview">
              <div className="creator-avatar large-avatar">IP</div>
              <span className="badge badge-ficus">Ficus</span>
              <h1>Intan Rahmadani Putri</h1>
              <p>3D Animator · Animation Student</p>
              <p>
                Passionate about animation, character design, and
                creating digital worlds.
              </p>

              <h2>Specializations</h2>
              <div className="category-list">
                <span className="category-chip">3D Animation</span>
                <span className="category-chip">Character Design</span>
                <span className="category-chip">Concept Art</span>
              </div>
            </div>
          </section>
        )}

        {(page === "login" || page === "register") && (
          <section className="auth-page">
            <div className="auth-card">
              <span className="eyebrow">FICUSIA HUB COMMUNITY</span>

              <h1>
                {page === "login" ? "Welcome Back" : "Join the Community"}
              </h1>

              <p>
                {page === "login"
                  ? "Sign in to continue your creative journey."
                  : "Create your account and showcase your creativity."}
              </p>

              <form
                onSubmit={page === "login" ? handleLogin : handleRegister}
              >
                {page === "register" && (
                  <>
                    <label htmlFor="full-name">Full Name</label>
                    <input
                      id="full-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                    />
                  </>
                )}

                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button className="button button-primary auth-submit">
                  {page === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              <p className="auth-switch">
                {page === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  className="text-link"
                  onClick={() => navigate(page === "login" ? "register" : "login")}
                >
                  {page === "login" ? "Create Account" : "Sign In"}
                </button>
              </p>
            </div>
          </section>
        )}

        {page === "creator-dashboard" && (
          <section className="inner-page">
            <span className="eyebrow">CREATOR WORKSPACE</span>
            <h1>Welcome, {user?.name || "Creator"}.</h1>
            <p className="page-description">
              Manage your creative profile and portfolio.
            </p>

            <div className="dashboard-grid">
              <article className="dashboard-card">
                <span className="dashboard-icon">✳</span>
                <h3>My Portfolio</h3>
                <p>Showcase and manage your creative work.</p>
                <button
                  className="button button-outline"
                  onClick={() => navigate("artworks")}
                >
                  Explore Works
                </button>
              </article>

              <article className="dashboard-card">
                <span className="dashboard-icon">＋</span>
                <h3>Upload Artwork</h3>
                <p>Add new projects to your portfolio.</p>
                <button
                  className="button button-outline"
                  onClick={() => navigate("upload")}
                >
                  Upload Work
                </button>
              </article>

              <article className="dashboard-card">
                <span className="dashboard-icon">◎</span>
                <h3>My Profile</h3>
                <p>Build your professional creator profile.</p>
                <button
                  className="button button-outline"
                  onClick={() => navigate("creator-profile")}
                >
                  View Profile
                </button>
              </article>
            </div>
          </section>
        )}

        {page === "upload" && (
          <section className="inner-page">
            <span className="eyebrow">CREATOR WORKSPACE</span>
            <h1>Upload Artwork</h1>
            <p className="page-description">
              Add a new project to your creative portfolio.
            </p>

            <form
              className="upload-form"
              onSubmit={(event) => {
                event.preventDefault();
                window.alert(
                  "This is a frontend demo. Artwork storage will be connected later."
                );
              }}
            >
              <label htmlFor="work-title">Artwork Title</label>
              <input id="work-title" required placeholder="Enter artwork title" />

              <label htmlFor="work-category">Category</label>
              <select id="work-category">
                {categories.slice(1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <label htmlFor="work-description">Description</label>
              <textarea
                id="work-description"
                rows={5}
                placeholder="Describe your artwork and creative process..."
              />

              <label htmlFor="work-file">Artwork File</label>
              <input
                id="work-file"
                type="file"
                accept="image/*,video/*"
              />

              <button className="button button-primary auth-submit">
                Publish Artwork
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark">F</span>
          <strong>FICUSIA HUB</strong>
        </div>

        <p>A creative space for animation talent.</p>

        <div className="footer-links">
          <button onClick={() => navigate("home")}>Home</button>
          <button onClick={() => navigate("artworks")}>Explore Art</button>
          <button onClick={() => navigate("careers")}>Career</button>
          <button onClick={() => navigate("login")}>Sign In</button>
        </div>

        <small>© 2026 Ficusia Hub · Politeknik Negeri Batam</small>
      </footer>
    </div>
  );
}

export default App;