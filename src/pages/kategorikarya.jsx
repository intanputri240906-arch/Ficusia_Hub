import { useState } from "react";
import "./fiturjuni.css";
import HeaderFiturJuni from "../components/HeaderFiturJuni";

const baseCategories = [
  "3D Animation",
  "2D Animation",
  "Concept Art",
  "Motion Graphics",
];

const initialWorks = [
  { id: 1, title: "The Forest Behind the Mist", creator: "Intan Rahmadani Putri", category: "3D Animation", color: "#52765b", letter: "F" },
  { id: 2, title: "The Coastal Guardian", creator: "Juni Friskenny Sinaga", category: "Concept Art", color: "#b77955", letter: "C" },
  { id: 3, title: "The Floating City", creator: "Rafi Pratama", category: "Concept Art", color: "#657ca5", letter: "F" },
  { id: 4, title: "A Little Digital World", creator: "Dewi Lestari", category: "2D Animation", color: "#9b83a9", letter: "D" },
];

// PORT-02 - Kategori Karya
// Sebagai Kreator, saya ingin memberi kategori pada setiap karya
// agar mudah dicari.
function KategoriKarya({ navigate }) {
  const [works, setWorks] = useState(initialWorks);
  const [extraCategories, setExtraCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [filter, setFilter] = useState("All");

  const allCategories = [...baseCategories, ...extraCategories];

  const changeCategory = (id, category) =>
    setWorks(works.map((w) => (w.id === id ? { ...w, category } : w)));

  const addCategory = (e) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;

    if (allCategories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      alert("Kategori tersebut sudah ada.");
      return;
    }

    setExtraCategories([...extraCategories, name]);
    setNewCategory("");
  };

  const visibleWorks =
    filter === "All" ? works : works.filter((w) => w.category === filter);

  const countOf = (category) =>
    works.filter((w) => w.category === category).length;

  return (
    <div className="jn-page">
      <HeaderFiturJuni navigate={navigate} backTo="upload" backLabel="← Upload" />

      <main className="jn-container">
        <span className="jn-label">CREATOR WORKSPACE</span>
        <h1 className="jn-title">Kategori Karya</h1>
        <p className="jn-desc">
          Beri kategori pada setiap karya agar mudah dicari pengunjung.
        </p>

        <form className="jn-card jn-row" onSubmit={addCategory}>
          <input
            className="jn-input"
            placeholder="Tambah kategori baru (mis. Character Design)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="jn-btn">Tambah</button>
        </form>

        <div className="jn-row-wrap" style={{ margin: "20px 0" }}>
          <button
            type="button"
            className={`jn-chip ${filter === "All" ? "jn-chip-active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All ({works.length})
          </button>

          {allCategories.map((c) => (
            <button
              type="button"
              key={c}
              className={`jn-chip ${filter === c ? "jn-chip-active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c} ({countOf(c)})
            </button>
          ))}
        </div>

        <div className="jn-list">
          {visibleWorks.map((work) => (
            <article className="jn-item" key={work.id}>
              <div className="jn-thumb" style={{ background: work.color }}>
                {work.letter}
              </div>

              <div className="jn-item-info">
                <h3>{work.title}</h3>
                <p>By {work.creator}</p>
                <span className="jn-chip">{work.category}</span>
              </div>

              <select
                className="jn-select"
                aria-label={`Kategori untuk ${work.title}`}
                value={work.category}
                onChange={(e) => changeCategory(work.id, e.target.value)}
              >
                {allCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </article>
          ))}

          {visibleWorks.length === 0 && (
            <p className="jn-muted">Belum ada karya pada kategori ini.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default KategoriKarya;
