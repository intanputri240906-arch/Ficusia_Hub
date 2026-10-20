import "../pages/fiturjuni.css";

// Label karya: "ai" = terdeteksi AI, "declared" = dideklarasikan kreator,
// "maybe" = kemungkinan AI, "clean" = tidak ditemukan indikasi AI.
function AiBadge({ status, declared }) {
  let kind = "clean";
  let text = "Karya Asli · tidak terdeteksi AI";

  if (status === "ai") {
    kind = "ai";
    text = "Terdeteksi AI";
  } else if (declared) {
    kind = "declared";
    text = "AI-Assisted · dideklarasikan kreator";
  } else if (status === "maybe") {
    kind = "maybe";
    text = "Kemungkinan AI";
  }

  return <span className={`jn-ai-badge jn-ai-${kind}`}>{text}</span>;
}

export default AiBadge;
