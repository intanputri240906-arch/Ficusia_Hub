
export default function ArtworkCard({
  title = "Untitled Artwork",
  creator = "Creative Artist",
  category = "Digital Art",
  image,
  likes = 0,
  onClick,
}) {
  return (
    <article className="artwork-card">
      <button
        className="artwork-card-visual"
        onClick={onClick}
        aria-label={`View ${title}`}
      >
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="artwork-placeholder">
            <span className="artwork-placeholder-shape">✳</span>
            <span>{category}</span>
          </div>
        )}

        <span className="artwork-category">
          {category}
        </span>
      </button>

      <div className="artwork-card-info">
        <div>
          <h3>{title}</h3>
          <p>By {creator}</p>
        </div>

        <span className="artwork-likes">
          ♡ {likes}
        </span>
      </div>
    </article>
  );
}