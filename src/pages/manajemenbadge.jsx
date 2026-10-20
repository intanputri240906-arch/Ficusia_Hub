import { useState } from "react";
import "./fiturjuni.css";
import HeaderFiturJuni from "../components/HeaderFiturJuni";

const initialBadges = [
  { name: "Sprout", desc: "Mahasiswa aktif" },
  { name: "Sapling", desc: "Lulusan baru" },
  { name: "Ficus", desc: "Praktisi profesional" },
];

const initialCreators = [
  { name: "Intan Rahmadani Putri", role: "3D Animator", badge: "Ficus", initials: "IP", color: "#37745b" },
  { name: "Juni Friskenny Sinaga", role: "Concept Artist", badge: "Sapling", initials: "JS", color: "#ba7958" },
  { name: "Rafi Pratama", role: "Motion Designer", badge: "Sprout", initials: "RP", color: "#6379a8" },
];

// BADGE-01 - Manajemen Badge
// Sebagai Admin, saya ingin mengelola badge Sprout, Sapling, dan Ficus.
// Admin = user.role === "admin" atau email diawali "admin".
function ManajemenBadge({ navigate, user }) {
  const [badges, setBadges] = useState(initialBadges);
  const [creators, setCreators] = useState(initialCreators);
  const [saved, setSaved] = useState(false);

  const isAdmin =
    !!user &&
    (user.role === "admin" ||
      (user.email || "").toLowerCase().startsWith("admin"));

  const changeDesc = (name, desc) => {
    setBadges(badges.map((b) => (b.name === name ? { ...b, desc } : b)));
    setSaved(false);
  };

  const changeBadge = (creatorName, badge) => {
    setCreators(
      creators.map((c) => (c.name === creatorName ? { ...c, badge } : c))
    );
    setSaved(false);
  };

  return (
    <div className="jn-page">
      <HeaderFiturJuni navigate={navigate} />

      <main className="jn-container">
        <span className="jn-label">ADMIN PANEL</span>
        <h1 className="jn-title">Manajemen Badge</h1>
        <p className="jn-desc">
          Kelola badge Sprout, Sapling, dan Ficus untuk setiap kreator.
        </p>

        {!isAdmin ? (
          <div className="jn-card">
            <p>
              Halaman ini khusus Admin. Untuk demo, masuk dengan akun yang
              emailnya diawali <strong>admin</strong> (contoh:
              admin@ficusia.id).
            </p>
            <button
              className="jn-btn"
              onClick={() => navigate(user ? "home" : "login")}
            >
              {user ? "Kembali ke Home" : "Sign In"}
            </button>
          </div>
        ) : (
          <>
            <div className="jn-card">
              <h3>Daftar Badge</h3>
              <div className="jn-legend">
                {badges.map((b) => (
                  <div className="jn-legend-row" key={b.name}>
                    <span className={`jn-badge jn-badge-${b.name.toLowerCase()}`}>
                      {b.name}
                    </span>
                    <input
                      className="jn-input"
                      aria-label={`Deskripsi badge ${b.name}`}
                      value={b.desc}
                      onChange={(e) => changeDesc(b.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="jn-list" style={{ marginTop: 20 }}>
              {creators.map((c) => (
                <article className="jn-item" key={c.name}>
                  <div
                    className="jn-thumb jn-thumb-round"
                    style={{ background: c.color }}
                  >
                    {c.initials}
                  </div>

                  <div className="jn-item-info">
                    <h3>{c.name}</h3>
                    <p>{c.role}</p>
                    <span className={`jn-badge jn-badge-${c.badge.toLowerCase()}`}>
                      {c.badge}
                    </span>
                  </div>

                  <select
                    className="jn-select"
                    aria-label={`Badge untuk ${c.name}`}
                    value={c.badge}
                    onChange={(e) => changeBadge(c.name, e.target.value)}
                  >
                    {badges.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} - {b.desc}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
            </div>

            <div className="jn-row" style={{ marginTop: 20 }}>
              <button className="jn-btn" onClick={() => setSaved(true)}>
                Simpan Perubahan
              </button>
              {saved && <span className="jn-success">Badge berhasil disimpan.</span>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ManajemenBadge;
