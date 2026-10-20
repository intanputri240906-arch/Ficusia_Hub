import "./fiturjuni.css";
import HeaderFiturJuni from "../components/HeaderFiturJuni";
import LikeKomentar from "../components/LikeKomentar";

const defaultArtwork = {
  title: "The Forest Behind the Mist",
  creator: "Intan Rahmadani Putri",
  category: "3D Animation",
  tool: "Blender",
  color: "#52765b",
  letter: "F",
};

// Detail karya + INT-01 Like & Komentar
function DetailKarya({ navigate, user, artwork }) {
  const work = artwork || defaultArtwork;

  return (
    <div className="jn-page">
      <HeaderFiturJuni navigate={navigate} backTo="karya" backLabel="← Artworks" />

      <main className="jn-container">
        <div className="jn-detail-art" style={{ background: work.color }}>
          {work.letter}
        </div>

        <span className="jn-label">{work.category}</span>
        <h1 className="jn-title">{work.title}</h1>
        <p className="jn-desc">
          Created by {work.creator} · Tools used: {work.tool}
        </p>

        <div className="jn-card">
          <LikeKomentar user={user} navigate={navigate} />
        </div>
      </main>
    </div>
  );
}

export default DetailKarya;
