
export default function Home({ navigate }) {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">

          <div className="eyebrow">
            <span className="hero-dot"></span>
            THE CREATIVE COMMUNITY
          </div>

          <h1>
            Your imagination.
            <br />
            <span>Your next opportunity.</span>
          </h1>

          <p className="hero-description">
            A creative home for animation students, alumni,
            and studios to share artwork, discover talent,
            and explore new career opportunities.
          </p>

          <div className="hero-buttons">
            <button
              className="home-button primary-button"
              onClick={() => navigate("artworks")}
            >
              Explore Artworks <span>↗</span>
            </button>

            <button
              className="home-button secondary-button"
              onClick={() => navigate("register")}
            >
              Create Your Profile
            </button>
          </div>

          <div className="hero-community">
            <div className="community-avatars">
              <span>M</span>
              <span>R</span>
              <span>N</span>
              <span>+</span>
            </div>

            <p>
              <strong>A community for creative minds</strong>
              <br />
              Share your talent with the world.
            </p>
          </div>
        </div>

        {/* Featured Artwork */}
        <div className="hero-artwork">
          <div className="artwork-top">
            <span>FEATURED CREATOR</span>
            <span>01 / 04</span>
          </div>

          <div className="artwork-orbit orbit-one"></div>
          <div className="artwork-orbit orbit-two"></div>

          <div className="artwork-planet">
            <div className="planet-ring"></div>
            <div className="planet-highlight"></div>
          </div>

          <div className="artwork-label">
            <div className="creator-avatar">MA</div>

            <div className="creator-information">
              <strong>Worlds by Mira</strong>
              <span>Concept Artist · Class of 2026</span>
            </div>

            <span className="artwork-arrow">↗</span>
          </div>

          <div className="artwork-side-text">
            DREAM
            <br />
            IN COLOR
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="home-features">
        <div className="feature-item">
          <span>01</span>
          <p>Showcase Your Portfolio</p>
        </div>

        <div className="feature-item">
          <span>02</span>
          <p>Connect with Creators</p>
        </div>

        <div className="feature-item">
          <span>03</span>
          <p>Discover Career Paths</p>
        </div>
      </section>

      {/* Artwork Section */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span className="eyebrow">
              FRESH FROM THE COMMUNITY
            </span>

            <h2>
              Made with imagination<span>.</span>
            </h2>

            <p>
              Explore ideas, experiments, and worlds
              created by our creative community.
            </p>
          </div>

          <button
            className="home-text-link"
            onClick={() => navigate("artworks")}
          >
            View All Artworks ↗
          </button>
        </div>

        <div className="home-art-grid">

          <article className="home-art-card">
            <div className="home-art-image art-lilac">
              <span className="art-category">CONCEPT ART</span>
              <div className="art-circle"></div>
              <div className="art-object object-purple"></div>
              <span className="art-image-title">A World of Wonder</span>
            </div>

            <div className="home-art-info">
              <div>
                <h3>The Quiet Planet</h3>
                <p>By Mira Anjani</p>
              </div>
              <span className="art-like">♡</span>
            </div>
          </article>

          <article className="home-art-card">
            <div className="home-art-image art-peach">
              <span className="art-category">CHARACTER DESIGN</span>
              <div className="art-circle"></div>
              <div className="art-object object-peach"></div>
              <span className="art-image-title">Made of Courage</span>
            </div>

            <div className="home-art-info">
              <div>
                <h3>Little Guardian</h3>
                <p>By Rafi Mahendra</p>
              </div>
              <span className="art-like">♡</span>
            </div>
          </article>

          <article className="home-art-card">
            <div className="home-art-image art-blue">
              <span className="art-category">3D ANIMATION</span>
              <div className="art-circle"></div>
              <div className="art-object object-blue"></div>
              <span className="art-image-title">Find Your Orbit</span>
            </div>

            <div className="home-art-info">
              <div>
                <h3>Beyond the Blue</h3>
                <p>By Nadia Putri</p>
              </div>
              <span className="art-like">♡</span>
            </div>
          </article>

        </div>
      </section>

      {/* Career Section */}
      <section className="home-career">
        <div className="career-content">
          <span className="eyebrow">
            YOUR NEXT CHAPTER
          </span>

          <h2>
            Good things happen
            <br />
            when talent meets opportunity.
          </h2>

          <p>
            Find internships, freelance projects, and
            creative roles made for people like you.
          </p>

          <button
            className="home-button primary-button"
            onClick={() => navigate("jobs")}
          >
            Explore Opportunities <span>↗</span>
          </button>
        </div>

        <div className="career-art">
          <div className="career-sun"></div>

          <div className="career-sticker sticker-one">
            CREATIVITY
            <br />
            <strong>IN MOTION</strong>
          </div>

          <div className="career-sticker sticker-two">
            NEW
            <br />
            PERSPECTIVES ↗
          </div>

          <span className="career-star">✳</span>
        </div>
      </section>

      {/* Join Section */}
      <section className="home-join">
        <span className="eyebrow">
          YOUR STORY BELONGS HERE
        </span>

        <h2>
          Make room for your
          <br />
          <span>next big idea.</span>
        </h2>

        <p>
          Build your creative identity and let the right
          people discover your work.
        </p>

        <button
          className="home-button primary-button"
          onClick={() => navigate("register")}
        >
          Join Ficusia Hub <span>↗</span>
        </button>
      </section>

    </div>
  );
}