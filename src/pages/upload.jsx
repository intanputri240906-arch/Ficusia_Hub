
import { useState } from "react";

function Upload({ navigate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an artwork file.");
      return;
    }

    alert(
      "Your artwork form has been submitted. Saving artwork permanently will be available when the backend is connected."
    );

    navigate("karya");
  };

  return (
    <div className="simple-page">
      <nav className="inner-navbar">
        <div
          className="home-logo"
          onClick={() => navigate("home")}
        >
          <div className="logo-icon">F</div>
          <span>FICUSIA HUB</span>
        </div>

        <button
          type="button"
          className="navbar-back"
          onClick={() => navigate("home")}
        >
          ← Home
        </button>
      </nav>

      <main className="form-container">
        <div className="page-heading">
          <span className="section-label">PORTFOLIO</span>

          <h1>Upload Artwork</h1>

          <p>
            Add a new artwork to your creative portfolio.
          </p>
        </div>

        <form
          className="upload-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="artwork-title">Artwork Title</label>

          <input
            id="artwork-title"
            type="text"
            placeholder="e.g. The Forest Behind the Mist"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="artwork-category">Category</label>

          <select
            id="artwork-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Concept Art">Concept Art</option>
            <option value="3D Animation">3D Animation</option>
            <option value="Character Design">Character Design</option>
            <option value="Storyboard">Storyboard</option>
          </select>

          <label htmlFor="artwork-description">Description</label>

          <textarea
            id="artwork-description"
            placeholder="Tell us a little about your artwork..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="artwork-file">Artwork File</label>

          <div className="upload-box">
            <span>
              {file ? file.name : "+ Choose an artwork file"}
            </span>

            <input
              id="artwork-file"
              type="file"
              accept="image/*,video/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("profile")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Upload Artwork
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Upload;