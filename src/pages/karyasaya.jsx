import "./fiturjuni.css";
import AiBadge from "../components/AiBadge.jsx";

// Daftar karya yang baru diposting + label AI-nya
function KaryaSaya({ works, navigate }) {
  return (
    <div className="jn-page">
      <main className="jn-container">
        <span className="jn-label">CREATOR WORKSPACE</span>
        <h1 className="jn-title">Karya Saya</h1>
        <p className="jn-desc">
          Karya yang kamu posting beserta hasil pemeriksaan AI-nya.
        </p>

        {works.length === 0 ? (
          <div className="jn-card">
            <p>Belum ada karya yang diposting.</p>
            <button className="jn-btn" onClick={() => navigate("upload")}>
              Upload Karya
            </button>
          </div>
        ) : (
          <div className="jn-list">
            {works.map((w) => (
              <article className="jn-item" key={w.id}>
                {w.previewUrl ? (
                  <img className="jn-thumb jn-thumb-img" src={w.previewUrl} alt={w.title} />
                ) : (
                  <div className="jn-thumb" style={{ background: "#52765b" }}>
                    {w.title.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="jn-item-info">
                  <h3>{w.title}</h3>
                  <p>
                    {w.category} · by {w.creator}
                  </p>
                  <AiBadge status={w.aiStatus} declared={w.aiDeclared} />
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default KaryaSaya;
