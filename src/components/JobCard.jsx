
export default function JobCard({
  title = "Junior 3D Artist",
  company = "Creative Studio",
  location = "Batam, Indonesia",
  type = "Internship",
  category = "Animation",
  onApply,
  saved = false,
  onSave,
}) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="job-company-icon">
          {company.charAt(0).toUpperCase()}
        </div>

        <button
          className={`job-save-button ${saved ? "saved" : ""}`}
          onClick={onSave}
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <span className="job-category">{category}</span>

      <h3>{title}</h3>

      <p className="job-company">{company}</p>

      <div className="job-details">
        <span>⌖ {location}</span>
        <span>◷ {type}</span>
      </div>

      <button
        className="job-apply-button"
        onClick={onApply}
      >
        View Opportunity ↗
      </button>
    </article>
  );
}