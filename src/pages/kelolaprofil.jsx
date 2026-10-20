import { useState } from "react";
import "./fiturjuni.css";
import HeaderFiturJuni from "../components/HeaderFiturJuni";

// PROF-01 - Kelola Profil Kreator
// Sebagai Kreator, saya ingin mengelola bio, CV, skill, spesialisasi,
// dan kontak agar profil saya profesional.
function KelolaProfil({ navigate, user }) {
  const [form, setForm] = useState({
    specialization: "",
    bio: "",
    cvLink: "",
    cvFileName: "",
    contactEmail: "",
    phone: "",
    portfolioLink: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(null);

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills([...skills, value]);
    setSkillInput("");
  };

  const removeSkill = (name) =>
    setSkills(skills.filter((item) => item !== name));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved({ ...form, skills });
  };

  return (
    <div className="jn-page">
      <HeaderFiturJuni navigate={navigate} backTo="profile" backLabel="← Profile" />

      <main className="jn-container">
        <span className="jn-label">CREATOR WORKSPACE</span>
        <h1 className="jn-title">Kelola Profil Kreator</h1>
        <p className="jn-desc">
          Kelola bio, CV, skill, spesialisasi, dan kontak agar profilmu
          terlihat profesional.
        </p>

        <form className="jn-card jn-form" onSubmit={handleSubmit}>
          <label htmlFor="jn-specialization">Spesialisasi</label>
          <input
            id="jn-specialization"
            placeholder="Contoh: 3D Animator, Concept Artist"
            value={form.specialization}
            onChange={updateField("specialization")}
          />

          <label htmlFor="jn-bio">Bio</label>
          <textarea
            id="jn-bio"
            rows={5}
            placeholder="Ceritakan tentang dirimu..."
            value={form.bio}
            onChange={updateField("bio")}
          />

          <label htmlFor="jn-skill">Skill / Software</label>
          <div className="jn-row">
            <input
              id="jn-skill"
              placeholder="Contoh: Blender"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button
              type="button"
              className="jn-btn jn-btn-outline"
              onClick={addSkill}
            >
              Tambah
            </button>
          </div>

          {skills.length > 0 && (
            <div className="jn-row-wrap">
              {skills.map((item) => (
                <span className="jn-chip" key={item}>
                  {item}
                  <button
                    type="button"
                    className="jn-chip-x"
                    aria-label={`Hapus skill ${item}`}
                    onClick={() => removeSkill(item)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <label htmlFor="jn-cv">CV (tautan atau unggah file)</label>
          <input
            id="jn-cv"
            placeholder="https://drive.google.com/..."
            value={form.cvLink}
            onChange={updateField("cvLink")}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              setForm({ ...form, cvFileName: file ? file.name : "" });
            }}
          />

          <label htmlFor="jn-email">Email Kontak</label>
          <input
            id="jn-email"
            type="email"
            placeholder="name@example.com"
            value={form.contactEmail}
            onChange={updateField("contactEmail")}
          />

          <label htmlFor="jn-phone">No. WhatsApp / Telepon</label>
          <input
            id="jn-phone"
            placeholder="08xxxxxxxxxx"
            value={form.phone}
            onChange={updateField("phone")}
          />

          <label htmlFor="jn-link">Link Portofolio / Sosial Media</label>
          <input
            id="jn-link"
            placeholder="https://artstation.com/username"
            value={form.portfolioLink}
            onChange={updateField("portfolioLink")}
          />

          <div className="jn-row" style={{ marginTop: 16 }}>
            <button className="jn-btn">Simpan Profil</button>
            <button
              type="button"
              className="jn-btn jn-btn-outline"
              onClick={() => navigate("profile")}
            >
              Batal
            </button>
          </div>
        </form>

        {saved && (
          <div className="jn-card">
            <span className="jn-label">PREVIEW PROFIL</span>
            <h2>{(user && user.name) || "Creator"}</h2>
            {saved.specialization && (
              <p>
                <strong>{saved.specialization}</strong>
              </p>
            )}
            {saved.bio && <p>{saved.bio}</p>}

            {saved.skills.length > 0 && (
              <div className="jn-row-wrap">
                {saved.skills.map((item) => (
                  <span className="jn-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            )}

            <ul className="jn-muted">
              {(saved.cvLink || saved.cvFileName) && (
                <li>CV: {saved.cvFileName || saved.cvLink}</li>
              )}
              {saved.contactEmail && <li>Email: {saved.contactEmail}</li>}
              {saved.phone && <li>Telepon: {saved.phone}</li>}
              {saved.portfolioLink && <li>Link: {saved.portfolioLink}</li>}
            </ul>

            <p className="jn-success">Profil berhasil disimpan.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default KelolaProfil;
