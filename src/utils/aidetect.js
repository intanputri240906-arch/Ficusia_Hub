// =====================================================================
// Deteksi karya AI (berbasis metadata file) - Ficusia Hub
//
// Yang diperiksa di dalam file (tanpa server):
//  - PNG text chunk dari generator (Stable Diffusion/A1111 "parameters",
//    ComfyUI "prompt"/"workflow", NovelAI, dll.)
//  - IPTC/XMP DigitalSourceType = trainedAlgorithmicMedia
//  - Nama tool AI di metadata (Midjourney, DALL-E, Firefly, Leonardo, dll.)
//  - Content Credentials (C2PA) yang menyebut tool AI
//
// BATAS: kalau metadata dihapus (screenshot, export ulang, kompres sosmed),
// cara ini tidak bisa mengenali karya AI. Untuk deteksi dari isi gambar
// (piksel) perlu layanan/model di server. Hubungkan lewat env
// VITE_AI_DETECT_URL: endpoint POST multipart (field "image") yang
// membalas JSON { "ai_probability": 0..1 }.
// =====================================================================

const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];

const NAME_RULES = [
  { re: /midjourney/i, reason: "Metadata menyebut Midjourney" },
  { re: /dall[-·\s]?e/i, reason: "Metadata menyebut DALL·E (OpenAI)" },
  { re: /stable[\s-]?diffusion|stablediffusion/i, reason: "Metadata menyebut Stable Diffusion" },
  { re: /novelai/i, reason: "Metadata menyebut NovelAI" },
  { re: /leonardo\.?ai/i, reason: "Metadata menyebut Leonardo.Ai" },
  { re: /adobe firefly/i, reason: "Metadata menyebut Adobe Firefly" },
  { re: /generative (fill|expand)/i, reason: "Metadata menyebut Generative Fill/Expand (Adobe)" },
  { re: /bing image creator/i, reason: "Metadata menyebut Bing Image Creator" },
  { re: /made with google ai|google imagen|\bimagen\b/i, reason: "Metadata menyebut Google AI/Imagen" },
  { re: /comfyui/i, reason: "Metadata menyebut ComfyUI" },
  { re: /ideogram/i, reason: "Metadata menyebut Ideogram" },
];

function latin1(bytes) {
  let out = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return out;
}

async function inflate(bytes) {
  if (typeof DecompressionStream === "undefined") return "";
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
    const buf = await new Response(stream).arrayBuffer();
    return new TextDecoder().decode(buf);
  } catch {
    return "";
  }
}

async function readPngText(bytes) {
  const items = [];
  if (!PNG_SIG.every((b, i) => bytes[i] === b)) return items;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let pos = 8;
  while (pos + 8 <= bytes.length) {
    const len = view.getUint32(pos);
    const type = latin1(bytes.subarray(pos + 4, pos + 8));
    const start = pos + 8;
    const end = start + len;
    if (end > bytes.length) break;
    const data = bytes.subarray(start, end);

    if (type === "tEXt") {
      const nul = data.indexOf(0);
      if (nul > 0) items.push({ key: latin1(data.subarray(0, nul)), value: latin1(data.subarray(nul + 1)) });
    } else if (type === "iTXt") {
      const nul = data.indexOf(0);
      if (nul > 0) {
        const key = latin1(data.subarray(0, nul));
        const compressed = data[nul + 1] === 1;
        let p = nul + 3;
        while (p < data.length && data[p] !== 0) p++;
        p++;
        while (p < data.length && data[p] !== 0) p++;
        p++;
        const body = data.subarray(p);
        const value = compressed ? await inflate(body) : new TextDecoder().decode(body);
        items.push({ key, value });
      }
    } else if (type === "zTXt") {
      const nul = data.indexOf(0);
      if (nul > 0) {
        items.push({ key: latin1(data.subarray(0, nul)), value: await inflate(data.subarray(nul + 2)) });
      }
    }

    if (type === "IEND") break;
    pos = end + 4;
  }
  return items;
}

export async function detectAIImage(file) {
  const reasons = [];
  const notes = [];
  let strong = false;

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // 1) PNG text chunks
  const textItems = await readPngText(bytes);
  for (const { key, value } of textItems) {
    const k = key.toLowerCase();
    if (k === "parameters" && /steps:/i.test(value) && /sampler/i.test(value)) {
      reasons.push("Parameter generator gambar (Steps/Sampler) ditemukan di metadata PNG");
      strong = true;
    }
    if ((k === "prompt" || k === "workflow") && /class_type|"nodes"/.test(value)) {
      reasons.push("Workflow ComfyUI ditemukan di metadata PNG");
      strong = true;
    }
    if (k === "sd-metadata" || k === "dream" || k === "invokeai_metadata") {
      reasons.push(`Metadata generator AI (${key}) ditemukan`);
      strong = true;
    }
  }

  // 2) Pindai byte awal & akhir file (XMP/IPTC/EXIF/C2PA)
  const head = bytes.subarray(0, Math.min(bytes.length, 1024 * 1024));
  const tail = bytes.length > head.length ? bytes.subarray(Math.max(head.length, bytes.length - 256 * 1024)) : new Uint8Array(0);
  const raw = latin1(head) + "\n" + latin1(tail) + "\n" + textItems.map((t) => `${t.key}=${t.value}`).join("\n");

  if (/trainedAlgorithmicMedia/i.test(raw)) {
    reasons.push("Penanda IPTC/XMP: dibuat oleh media algoritmik terlatih (AI)");
    strong = true;
  }

  for (const rule of NAME_RULES) {
    if (rule.re.test(raw) && !reasons.includes(rule.reason)) {
      reasons.push(rule.reason);
      strong = true;
    }
  }

  if (/c2pa|jumbf/i.test(raw) && !strong) {
    notes.push("File memiliki Content Credentials (C2PA), tetapi tidak menyebut tool AI.");
  }

  // 3) Layanan deteksi eksternal (opsional)
  let apiProbability = null;
  const url = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_AI_DETECT_URL : "";
  if (url) {
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch(url, { method: "POST", body: form });
      const json = await res.json();
      const p = Number(json.ai_probability ?? json.score);
      if (!Number.isNaN(p)) apiProbability = p;
    } catch {
      notes.push("Layanan deteksi eksternal tidak dapat dihubungi; hanya metadata yang diperiksa.");
    }
  }

  let status = "clean";
  if (strong) status = "ai";
  else if (apiProbability !== null && apiProbability >= 0.7) status = "ai";
  else if (apiProbability !== null && apiProbability >= 0.4) status = "maybe";

  if (apiProbability !== null) {
    reasons.push(`Skor layanan deteksi: ${Math.round(apiProbability * 100)}% kemungkinan AI`);
  }

  if (status === "clean") {
    notes.push(
      "Tidak ditemukan penanda AI pada metadata. Ini bukan jaminan: metadata bisa terhapus (mis. screenshot atau export ulang)."
    );
  }

  return { status, reasons, notes, apiProbability };
}
