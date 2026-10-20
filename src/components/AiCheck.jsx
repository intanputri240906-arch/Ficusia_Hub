import { useEffect, useState } from "react";
import "../pages/fiturjuni.css";
import { detectAIImage } from "../utils/aidetect.js";
import AiBadge from "./AiBadge.jsx";

// Pemeriksaan AI di form upload: otomatis saat file dipilih + deklarasi kreator.
function AiCheck({ file, declared, onDeclaredChange, onResult }) {
  const [state, setState] = useState({ loading: false, result: null });

  useEffect(() => {
    let cancelled = false;

    if (!file) {
      setState({ loading: false, result: null });
      onResult(null);
      return undefined;
    }

    setState({ loading: true, result: null });
    detectAIImage(file)
      .then((result) => {
        if (cancelled) return;
        setState({ loading: false, result });
        onResult(result);
      })
      .catch(() => {
        if (cancelled) return;
        const result = {
          status: "clean",
          reasons: [],
          notes: ["File tidak dapat diperiksa."],
          apiProbability: null,
        };
        setState({ loading: false, result });
        onResult(result);
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  const { loading, result } = state;

  return (
    <div className="jn-ai-box">
      <strong>Pemeriksaan Karya AI</strong>

      {!file && (
        <p className="jn-muted">
          Pilih file karya, lalu sistem otomatis memeriksa apakah karya ini
          dibuat dengan AI.
        </p>
      )}

      {loading && <p className="jn-muted">Memeriksa karya...</p>}

      {result && (
        <div>
          <AiBadge status={result.status} declared={declared} />
          {result.reasons.length > 0 && (
            <ul className="jn-ai-reasons">
              {result.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
          {result.notes.map((n) => (
            <p className="jn-muted" key={n}>
              {n}
            </p>
          ))}
        </div>
      )}

      <label className="jn-ai-declare">
        <input
          type="checkbox"
          checked={declared}
          onChange={(e) => onDeclaredChange(e.target.checked)}
        />
        <span>Karya ini dibuat dengan bantuan AI (deklarasi kreator)</span>
      </label>
    </div>
  );
}

export default AiCheck;
