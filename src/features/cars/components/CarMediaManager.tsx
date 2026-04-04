// pages/CarMediaManager.tsx
// Full media manager — Images / Videos / 360° tabs
// Accessed via /admin/cars/:id/media

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetCarMedia,
  UploadCarMedia,
  DeleteCarMedia,
  SetPrimaryMedia,
} from "../api";

interface MediaItem {
  id: number;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  media_type: "image" | "video" | "360";
}

type Tab = "image" | "video" | "360";

const ACCEPT: Record<Tab, string> = {
  image: "image/jpeg,image/png,image/webp",
  video: "video/mp4",
  "360": "image/jpeg,image/png,image/webp",
};

const LABELS: Record<Tab, string> = {
  image: "Images",
  video: "Videos",
  "360": "360°",
};

const css = `

  .cmm-root {
    --bg:           #ffffff;
    --surface:      #f8f8f7;
    --surface2:     #f2f0ec;
    --border:       #e8e6e1;
    --border-soft:  #f0ede8;
    --text:         #1a1916;
    --text-muted:   #8a8680;
    --text-faint:   #b5b2ad;
    --accent:       #1a1916;
    --accent-fg:    #ffffff;
    --danger:       #dc2626;
    --success:      #16a34a;
    --warning:      #ca8a04;
    --shadow:       0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
    font-family: 'Figtree', sans-serif;
    color: var(--text);
    background: #f5f3ef;
    min-height: 100vh;
    padding: 40px 24px 80px;
  }

  @media (prefers-color-scheme: dark) {
    .cmm-root {
      --bg:           #111110;
      --surface:      #161614;
      --surface2:     #1a1916;
      --border:       #282724;
      --border-soft:  #1e1d1b;
      --text:         #e8e6e1;
      --text-muted:   #6b6966;
      --text-faint:   #3d3c3a;
      --accent:       #e8e6e1;
      --accent-fg:    #111110;
      --shadow:       0 1px 3px rgba(0,0,0,0.3);
      background: #0c0c0b;
    }
  }

  .cmm-container { max-width: 900px; margin: 0 auto; }

  /* Header */
  .cmm-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--text-muted); cursor: pointer;
    background: none; border: none; padding: 0; margin-bottom: 24px;
    transition: color 0.15s; font-family: 'Figtree', sans-serif;
  }
  .cmm-back:hover { color: var(--text); }

  .cmm-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 6px;
    display: flex; align-items: center; gap: 8px;
  }
  .cmm-eyebrow::before { content:''; display:inline-block; width:16px; height:1px; background:var(--text-muted); }
  .cmm-title { font-size: 26px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 28px; }

  /* Tabs */
  .cmm-tabs {
    display: flex; gap: 2px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }

  .cmm-tab {
    font-family: 'Figtree', sans-serif; font-size: 13.5px; font-weight: 500;
    padding: 10px 18px; border: none; background: none; cursor: pointer;
    color: var(--text-muted); position: relative;
    transition: color 0.15s;
    display: flex; align-items: center; gap: 7px;
  }
  .cmm-tab.active { color: var(--text); }
  .cmm-tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 2px; background: var(--accent); border-radius: 2px 2px 0 0;
  }

  .cmm-tab-count {
    font-family: 'DM Mono', monospace; font-size: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text-muted); padding: 2px 6px; border-radius: 99px;
  }

  /* Layout */
  .cmm-body { display: flex; flex-direction: column; gap: 20px; }

  /* Drop zone */
  .cmm-drop {
    border: 1.5px dashed var(--border); border-radius: 14px;
    padding: 36px 24px;
    display: flex; flex-direction: column; align-items: center;
    gap: 8px; cursor: pointer; transition: all 0.18s;
    background: var(--bg); text-align: center;
  }
  .cmm-drop:hover, .cmm-drop.drag { border-color: var(--accent); background: var(--surface); }
  .cmm-drop-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px; transition: transform 0.15s;
  }
  .cmm-drop:hover .cmm-drop-icon, .cmm-drop.drag .cmm-drop-icon { transform: translateY(-2px); }
  .cmm-drop-title { font-size: 14px; font-weight: 500; }
  .cmm-drop-sub { font-size: 12.5px; color: var(--text-muted); }

  /* Image grid */
  .cmm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }

  .cmm-card {
    border-radius: 12px; overflow: hidden;
    border: 1.5px solid var(--border);
    background: var(--surface);
    transition: border-color 0.15s;
    display: flex; flex-direction: column;
  }
  .cmm-card.primary { border-color: var(--accent); }

  .cmm-card-thumb {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: var(--surface2);
  }

  .cmm-card-thumb img, .cmm-card-thumb video {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.2s;
  }
  .cmm-card:hover .cmm-card-thumb img,
  .cmm-card:hover .cmm-card-thumb video { transform: scale(1.03); }

  .cmm-primary-badge {
    position: absolute; top: 7px; left: 7px;
    background: var(--accent); color: var(--accent-fg);
    font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 3px 7px; border-radius: 5px; pointer-events: none;
  }

  .cmm-card-actions {
    position: absolute; top: 7px; right: 7px;
    display: flex; gap: 5px; opacity: 0; transition: opacity 0.15s;
  }
  .cmm-card:hover .cmm-card-actions { opacity: 1; }

  .cmm-icon-btn {
    width: 28px; height: 28px; border-radius: 7px; border: none;
    background: rgba(0,0,0,0.5); color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; backdrop-filter: blur(4px);
  }
  .cmm-icon-btn:hover { background: rgba(0,0,0,0.75); }
  .cmm-icon-btn.star { background: rgba(245,158,11,0.85); }
  .cmm-icon-btn.star:hover { background: rgba(245,158,11,1); }
  .cmm-icon-btn.del:hover { background: rgba(220,38,38,0.85); }

  /* Card footer */
  .cmm-card-footer {
    padding: 10px 12px;
    border-top: 1px solid var(--border-soft);
    display: flex; flex-direction: column; gap: 6px;
  }

  .cmm-alt-input {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    border-radius: 7px; color: var(--text); font-family: 'Figtree', sans-serif;
    font-size: 12px; padding: 5px 9px; outline: none; transition: border-color 0.15s;
  }
  .cmm-alt-input:focus { border-color: var(--accent); }
  .cmm-alt-input::placeholder { color: var(--text-faint); }

  .cmm-card-meta {
    display: flex; align-items: center; justify-content: space-between;
  }

  .cmm-set-primary-btn {
    font-family: 'Figtree', sans-serif; font-size: 11.5px; font-weight: 500;
    color: var(--text-muted); background: none; border: none; cursor: pointer;
    padding: 0; transition: color 0.15s; display: flex; align-items: center; gap: 4px;
  }
  .cmm-set-primary-btn:hover { color: var(--text); }
  .cmm-set-primary-btn.is-primary { color: #f59e0b; }

  /* Upload progress on card */
  .cmm-upload-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px; padding: 16px;
  }
  .cmm-upload-track { width:100%; height:3px; background:rgba(255,255,255,0.2); border-radius:99px; overflow:hidden; }
  .cmm-upload-fill { height:100%; background:white; border-radius:99px; transition:width 0.2s ease; }
  .cmm-upload-pct { font-family:'DM Mono',monospace; font-size:11px; color:rgba(255,255,255,0.8); }

  /* Empty state */
  .cmm-empty {
    padding: 56px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 14px;
  }
  .cmm-empty-icon {
    width:44px; height:44px; border-radius:12px;
    background:var(--surface); border:1px solid var(--border);
    display:flex; align-items:center; justify-content:center; margin-bottom:4px;
  }
  .cmm-empty-title { font-size:14px; font-weight:500; }
  .cmm-empty-sub { font-size:12.5px; color:var(--text-muted); }

  /* Upload error */
  .cmm-error-overlay {
    position:absolute; inset:0;
    background:rgba(220,38,38,0.75);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:6px; padding:12px;
  }
  .cmm-retry-btn {
    background:rgba(255,255,255,0.2); border:none; color:white;
    border-radius:6px; padding:4px 10px; font-size:11px; cursor:pointer;
    font-family:'Figtree',sans-serif;
  }
  .cmm-retry-btn:hover { background:rgba(255,255,255,0.35); }

  /* 360 label */
  .cmm-360-badge {
    position:absolute; bottom:7px; right:7px;
    background:rgba(0,0,0,0.6); color:white;
    font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.08em;
    text-transform:uppercase; padding:3px 7px; border-radius:5px;
    backdrop-filter:blur(4px);
  }
`;

interface PendingFile {
  localId: string;
  file: File;
  preview: string;
  state: "uploading" | "error";
  progress: number;
}

export default function CarMediaManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const carId = Number(id);

  const [tab, setTab] = useState<Tab>("image");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    GetCarMedia(carId).then(setMedia);
  }, [carId]);

  const byTab = media.filter((m) => m.media_type === tab);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newPending: PendingFile[] = arr.map((file) => ({
      localId: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      state: "uploading",
      progress: 0,
    }));
    setPending((p) => [...p, ...newPending]);
    newPending.forEach(uploadFile);
  };

  const uploadFile = async (pf: PendingFile) => {
    const tick = setInterval(() => {
      setPending((prev) =>
        prev.map((p) =>
          p.localId === pf.localId
            ? { ...p, progress: Math.min(p.progress + 12, 88) }
            : p,
        ),
      );
    }, 180);

    try {
      const uploaded: MediaItem = await UploadCarMedia(carId, {
        file: pf.file,
        media_type: tab,
        is_primary: false,
        alt_text: "",
      });
      clearInterval(tick);
      setPending((p) => p.filter((x) => x.localId !== pf.localId));
      setMedia((prev) => [...prev, uploaded]);
    } catch {
      clearInterval(tick);
      setPending((prev) =>
        prev.map((p) =>
          p.localId === pf.localId ? { ...p, state: "error" } : p,
        ),
      );
    }
  };

  const handleSetPrimary = async (itemId: number) => {
    await SetPrimaryMedia(carId, itemId);
    setMedia((prev) =>
      prev.map((m) => ({ ...m, is_primary: m.id === itemId })),
    );
  };

  const handleDelete = async (itemId: number) => {
    await DeleteCarMedia(carId, itemId);
    setMedia((prev) => prev.filter((m) => m.id !== itemId));
  };

  const tabCounts = {
    image: media.filter((m) => m.media_type === "image").length,
    video: media.filter((m) => m.media_type === "video").length,
    "360": media.filter((m) => m.media_type === "360").length,
  };

  return (
    <>
      <style>{css}</style>
      <div className="cmm-root">
        <div className="cmm-container">
          {/* Back */}
          <button
            className="cmm-back"
            onClick={() => navigate(`/admin/car/${carId}/edit`)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to car
          </button>

          <div className="cmm-eyebrow">Car #{carId}</div>
          <h1 className="cmm-title">Media Manager</h1>

          {/* Tabs */}
          <div className="cmm-tabs">
            {(["image", "video", "360"] as Tab[]).map((t) => (
              <button
                key={t}
                className={`cmm-tab${tab === t ? " active" : ""}`}
                onClick={() => setTab(t)}
              >
                {LABELS[t]}
                {tabCounts[t] > 0 && (
                  <span className="cmm-tab-count">{tabCounts[t]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="cmm-body">
            {/* Drop zone */}
            <div
              className={`cmm-drop${drag ? " drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT[tab]}
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                }}
              />
              <div className="cmm-drop-icon">
                {tab === "video" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="1.6"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                    <polygon
                      points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                      fill="var(--text-muted)"
                    />
                  </svg>
                ) : tab === "360" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="1.6"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 010 20M2 12h20" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="1.6"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path
                      d="M21 15l-5-5L5 21"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <p className="cmm-drop-title">
                {tab === "video"
                  ? "Drop MP4 videos here or click to browse"
                  : tab === "360"
                    ? "Drop 360° images here or click to browse"
                    : "Drop images here or click to browse"}
              </p>
              <p className="cmm-drop-sub">
                {tab === "video"
                  ? "MP4 only"
                  : "JPG, PNG, WEBP · Multiple allowed"}
              </p>
            </div>

            {/* Grid */}
            {byTab.length === 0 && pending.length === 0 ? (
              <div className="cmm-empty">
                <div className="cmm-empty-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path
                      d="M21 15l-5-5L5 21"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="cmm-empty-title">
                  No {LABELS[tab].toLowerCase()} yet
                </p>
                <p className="cmm-empty-sub">
                  Upload files using the drop zone above.
                </p>
              </div>
            ) : (
              <div className="cmm-grid">
                {/* Confirmed */}
                {byTab.map((item) => (
                  <div
                    key={item.id}
                    className={`cmm-card${item.is_primary ? " primary" : ""}`}
                  >
                    <div className="cmm-card-thumb">
                      {item.media_type === "video" ? (
                        <video src={item.url} muted playsInline />
                      ) : (
                        <img src={item.url} alt={item.alt_text ?? ""} />
                      )}

                      {item.is_primary && (
                        <span className="cmm-primary-badge">Primary</span>
                      )}

                      {item.media_type === "360" && (
                        <span className="cmm-360-badge">360°</span>
                      )}

                      <div className="cmm-card-actions">
                        <button
                          className={`cmm-icon-btn${item.is_primary ? " star" : ""}`}
                          title="Set as primary"
                          onClick={() => handleSetPrimary(item.id)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={item.is_primary ? "white" : "none"}
                            stroke="white"
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                        <button
                          className="cmm-icon-btn del"
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                          >
                            <path
                              d="M18 6L6 18M6 6l12 12"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="cmm-card-footer">
                      {tab === "image" && (
                        <div className="cmm-card-meta">
                          <button
                            className={`cmm-set-primary-btn${item.is_primary ? " is-primary" : ""}`}
                            onClick={() => handleSetPrimary(item.id)}
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill={item.is_primary ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {item.is_primary ? "Primary" : "Set primary"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pending */}
                {pending.map((pf) => (
                  <div key={pf.localId} className="cmm-card">
                    <div className="cmm-card-thumb">
                      <img src={pf.preview} alt="" />
                      {pf.state === "uploading" && (
                        <div className="cmm-upload-overlay">
                          <div className="cmm-upload-track">
                            <div
                              className="cmm-upload-fill"
                              style={{ width: `${pf.progress}%` }}
                            />
                          </div>
                          <span className="cmm-upload-pct">{pf.progress}%</span>
                        </div>
                      )}
                      {pf.state === "error" && (
                        <div className="cmm-error-overlay">
                          <span
                            style={{
                              color: "white",
                              fontSize: 12,
                              fontFamily: "'Figtree',sans-serif",
                            }}
                          >
                            Failed
                          </span>
                          <button
                            className="cmm-retry-btn"
                            onClick={() => uploadFile(pf)}
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="cmm-card-footer">
                      <div
                        style={{
                          height: 28,
                          background: "var(--surface2)",
                          borderRadius: 7,
                          animation: "pulse 1.4s ease infinite",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
