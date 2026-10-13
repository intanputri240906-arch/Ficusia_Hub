
function JobListing({ navigate }) {
  const jobs = [
    {
      title: "3D Animator Intern",
      company: "Creative Studio",
      type: "Internship",
      location: "Batam",
    },
    {
      title: "Character Designer",
      company: "Animation House",
      type: "Freelance",
      location: "Remote",
    },
    {
      title: "Junior Animator",
      company: "Digital Studio",
      type: "Full-time",
      location: "Jakarta",
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
            CAREER
          </span>

          <h1>
            Career Opportunities
          </h1>

          <p>
            Discover job opportunities and collaboration
            opportunities in the animation industry.
          </p>
        </div>

        <div className="job-list">
          {jobs.map((job, index) => (
            <div
              className="job-card-new"
              key={index}
            >
              <div>
                <span className="job-type">
                  {job.type}
                </span>

                <h3>
                  {job.title}
                </h3>

                <p>
                  {job.company}
                </p>

                <small>
                  📍 {job.location}
                </small>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  alert(
                    `More details about ${job.title} will be available soon.`
                  )
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default JobListing;