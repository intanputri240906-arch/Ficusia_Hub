import { useState } from "react";
import "../pages/fiturjuni.css";

// INT-01 - Like & Komentar (komponen yang dipakai di halaman detail karya)
function LikeKomentar({ user, navigate }) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const requireLogin = () => {
    if (!user) {
      navigate("login");
      return true;
    }
    return false;
  };

  const toggleLike = () => {
    if (requireLogin()) return;
    setLiked(!liked);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (requireLogin()) return;
    if (!text.trim()) return;

    setComments([
      ...comments,
      { id: Date.now(), author: user.name, text: text.trim() },
    ]);
    setText("");
  };

  const deleteComment = (id) =>
    setComments(comments.filter((c) => c.id !== id));

  return (
    <div className="jn-interaction">
      <button
        type="button"
        className={`jn-btn ${liked ? "" : "jn-btn-outline"}`}
        onClick={toggleLike}
      >
        {liked ? "♥ Liked" : "♡ Like"} · {liked ? 1 : 0}
      </button>

      <h2>Komentar ({comments.length})</h2>

      {comments.length === 0 && (
        <p className="jn-muted">Belum ada komentar.</p>
      )}

      <ul className="jn-comments">
        {comments.map((c) => (
          <li className="jn-comment" key={c.id}>
            <div>
              <strong>{c.author}</strong>
              <p>{c.text}</p>
            </div>

            {user && user.name === c.author && (
              <button
                type="button"
                className="jn-link-btn"
                onClick={() => deleteComment(c.id)}
              >
                Hapus
              </button>
            )}
          </li>
        ))}
      </ul>

      {user ? (
        <form className="jn-form" onSubmit={submitComment}>
          <textarea
            rows={3}
            placeholder="Tulis komentar..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div>
            <button className="jn-btn">Kirim Komentar</button>
          </div>
        </form>
      ) : (
        <p className="jn-muted">
          Masuk terlebih dahulu untuk memberi like dan komentar.
        </p>
      )}
    </div>
  );
}

export default LikeKomentar;
