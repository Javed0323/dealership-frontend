import { useState, useRef, useCallback, useEffect } from "react";
import {
  GetCarMedia,
  UploadCarMedia,
  DeleteCarMedia,
  SetPrimaryMedia,
  UpdateCarMediaAlt,
} from "../api"; // adjust import path as needed
import { File, Image, Orbit, Video } from "lucide-react";
import { useParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaType = "image" | "video" | "360";

interface CarMediaItem {
  id: number;
  car_id: number;
  media_type: string;
  url: string; // original S3 key URL — used for delete/set-primary logic
  alt_text?: string;
  is_primary: boolean;
  uploaded_at: string;
}

interface UploadTask {
  id: string;
  file: File;
  preview: string;
  media_type: MediaType;
  alt_text: string;
  is_primary: boolean;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

interface CarMediaUploadProps {
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getAccept(type: MediaType) {
  if (type === "image") return "image/*";
  if (type === "video") return "video/*";
  return "image/*,video/*";
}

const TAB_META: {
  type: MediaType;
  label: string;
  icon: any;
  hint: string;
}[] = [
  {
    type: "image",
    label: "Photos",
    icon: <Image />,
    hint: "JPG, PNG, WEBP — up to 20 MB each",
  },
  {
    type: "video",
    label: "Videos",
    icon: <Video />,
    hint: "MP4, MOV, WEBM — up to 500 MB each",
  },
  {
    type: "360",
    label: "360° View",
    icon: <Orbit />,
    hint: "Equirectangular image for 360 viewer",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-cyan-400"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function MediaBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; color: string }> = {
    image: {
      label: "Photo",
      color: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    },
    video: {
      label: "Video",
      color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    "360": {
      label: "360°",
      color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
  };
  const m = map[type] ?? map["image"];
  return (
    <span
      className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border ${m.color}`}
    >
      {m.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CarMediaUpload({
  className = "",
}: CarMediaUploadProps) {
  const { id } = useParams();
  const carId = Number(id);
  const [activeTab, setActiveTab] = useState<MediaType>("image");
  const [queue, setQueue] = useState<UploadTask[]>([]);
  const [library, setLibrary] = useState<CarMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState("");
  const [previewItem, setPreviewItem] = useState<CarMediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // ── Fetch existing media
  useEffect(() => {
    (async () => {
      try {
        const data = await GetCarMedia(carId);
        setLibrary(Array.isArray(data) ? data : []);
      } catch {
        // non-fatal
      } finally {
        setLoading(false);
      }
    })();
  }, [carId]);

  // ── Drag-and-drop
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [activeTab], // eslint-disable-line
  );

  // ── Add files to queue
  const addFiles = (files: File[]) => {
    const tasks: UploadTask[] = files.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      media_type: activeTab,
      alt_text: "",
      is_primary: false,
      progress: 0,
      status: "pending",
    }));
    setQueue((q) => [...q, ...tasks]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  // ── Update task field
  const updateTask = (id: string, patch: Partial<UploadTask>) =>
    setQueue((q) => q.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  // ── Upload a single task
  const uploadTask = async (task: UploadTask) => {
    updateTask(task.id, { status: "uploading", progress: 10 });
    try {
      // Simulate progress ticks
      const tick = setInterval(() => {
        setQueue((q) =>
          q.map((t) =>
            t.id === task.id && t.progress < 85
              ? { ...t, progress: t.progress + 15 }
              : t,
          ),
        );
      }, 300);

      const result = await UploadCarMedia(carId, {
        file: task.file,
        media_type: task.media_type,
        alt_text: task.alt_text,
        is_primary: task.is_primary,
      });

      clearInterval(tick);
      updateTask(task.id, { status: "done", progress: 100 });
      setLibrary((lib) => [...lib, result as CarMediaItem]);

      // remove from queue after delay
      setTimeout(() => {
        setQueue((q) => q.filter((t) => t.id !== task.id));
        URL.revokeObjectURL(task.preview);
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      updateTask(task.id, { status: "error", error: msg });
    }
  };

  const uploadAll = () => {
    queue.filter((t) => t.status === "pending").forEach(uploadTask);
  };

  const removeTask = (id: string) => {
    setQueue((q) => {
      const t = q.find((x) => x.id === id);
      if (t) URL.revokeObjectURL(t.preview);
      return q.filter((x) => x.id !== id);
    });
  };

  // ── Library actions
  const handleDelete = async (mediaId: number) => {
    try {
      await DeleteCarMedia(carId, mediaId);
      setLibrary((lib) => lib.filter((m) => m.id !== mediaId));
    } catch {
      /* toast error */
    }
  };

  const handleSetPrimary = async (mediaId: number) => {
    try {
      await SetPrimaryMedia(carId, mediaId);
      setLibrary((lib) =>
        lib.map((m) => ({ ...m, is_primary: m.id === mediaId })),
      );
    } catch {
      /* toast error */
    }
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    try {
      await UpdateCarMediaAlt(carId, editingId, editingAlt);
      setLibrary((lib) =>
        lib.map((m) =>
          m.id === editingId ? { ...m, alt_text: editingAlt } : m,
        ),
      );
    } catch {
      /* toast error */
    } finally {
      setEditingId(null);
    }
  };

  const pendingCount = queue.filter((t) => t.status === "pending").length;

  return (
    <div
      className={`relative min-h-screen bg-[#0a0b0f] text-white font-sans ${className}`}
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* ── Background ambiance */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* ── Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-1">
              Car #{carId}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Media Manager
            </h1>
          </div>
          <div className="text-right text-sm text-zinc-500">
            <span className="text-white font-semibold">{library.length}</span>{" "}
            uploaded &nbsp;·&nbsp;
            <span className="text-white font-semibold">{queue.length}</span> in
            queue
          </div>
        </div>

        {/* ── Tab bar */}
        <div className="flex gap-1 p-1 bg-zinc-900/70 rounded-xl border border-zinc-800 w-fit">
          {TAB_META.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.type
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Drop Zone */}
        <div
          ref={dropRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center gap-4 ${
            dragging
              ? "border-cyan-400 bg-cyan-500/5 scale-[1.01]"
              : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 ${dragging ? "scale-110" : "group-hover:scale-105"} bg-zinc-800`}
          >
            {TAB_META.find((t) => t.type === activeTab)?.icon}
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg mb-1">
              {dragging ? "Drop to add" : "Drop files here"}
            </p>
            <p className="text-zinc-500 text-sm">
              or{" "}
              <span className="text-cyan-400 underline underline-offset-2">
                browse
              </span>{" "}
              &nbsp;·&nbsp;
              {TAB_META.find((t) => t.type === activeTab)?.hint}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={getAccept(activeTab)}
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* ── Upload Queue */}
        {queue.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-400">
                Upload Queue
              </h2>
              {pendingCount > 0 && (
                <button
                  onClick={uploadAll}
                  className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold rounded-lg transition-colors"
                >
                  ↑ Upload all ({pendingCount})
                </button>
              )}
            </div>

            <div className="grid gap-3">
              {queue.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                    {task.file.type.startsWith("video") ? (
                      <video
                        src={task.preview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={task.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MediaBadge type={task.media_type} />
                      <p className="text-sm font-medium text-white truncate">
                        {task.file.name}
                      </p>
                      <span className="text-xs text-zinc-500 ml-auto shrink-0">
                        {formatBytes(task.file.size)}
                      </span>
                    </div>

                    {/* Alt text input */}
                    <input
                      type="text"
                      placeholder="Alt text (optional)"
                      value={task.alt_text}
                      onChange={(e) =>
                        updateTask(task.id, { alt_text: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />

                    {/* Progress bar */}
                    {task.status !== "pending" && (
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            task.status === "error"
                              ? "bg-red-500"
                              : task.status === "done"
                                ? "bg-emerald-400"
                                : "bg-cyan-400"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}

                    {task.status === "error" && (
                      <p className="text-xs text-red-400">{task.error}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Primary toggle */}
                    <button
                      onClick={() =>
                        updateTask(task.id, { is_primary: !task.is_primary })
                      }
                      title="Set as primary"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        task.is_primary
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-zinc-800 text-zinc-500 hover:text-amber-400"
                      }`}
                    >
                      ★
                    </button>

                    {task.status === "pending" && (
                      <button
                        onClick={() => uploadTask(task)}
                        className="w-8 h-8 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                        title="Upload"
                      >
                        ↑
                      </button>
                    )}

                    {task.status === "uploading" && <Spinner />}

                    {task.status === "done" && (
                      <span className="text-emerald-400 text-lg">✓</span>
                    )}

                    {task.status !== "uploading" && (
                      <button
                        onClick={() => removeTask(task.id)}
                        className="w-8 h-8 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-500 rounded-lg flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Library */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-400">
            Uploaded Media
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-500 gap-3">
              <Spinner /> Loading media…
            </div>
          ) : library.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
              <span className="text-4xl">
                <File size={40} />
              </span>
              <p className="text-sm">No media uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {library.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-200 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square overflow-hidden">
                    {item.media_type === "video" ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewItem(item)}
                        muted
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.alt_text ?? ""}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewItem(item)}
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {item.is_primary && (
                        <span className="bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                          PRIMARY
                        </span>
                      )}
                      {item.media_type === "video" && (
                        <span className="bg-zinc-800/90 text-zinc-300 text-[10px] font-medium px-1.5 py-0.5 rounded">
                          VIDEO
                        </span>
                      )}
                    </div>

                    {/* Preview hint on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center pointer-events-none">
                      <span className="text-white text-xs font-medium">
                        Click to preview
                      </span>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="p-2 space-y-2 border-t border-zinc-800">
                    {/* Alt text row */}
                    {editingId === item.id ? (
                      <div
                        className="space-y-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          autoFocus
                          value={editingAlt}
                          onChange={(e) => setEditingAlt(e.target.value)}
                          placeholder="Alt text..."
                          className="w-full bg-zinc-800 border border-zinc-700 focus:border-cyan-500 rounded px-2 py-1 text-xs text-white focus:outline-none transition-colors"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={saveEdit}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-1 rounded transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs py-1 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingAlt(item.alt_text ?? "");
                        }}
                        className="w-full text-left text-xs text-zinc-500 hover:text-zinc-300 truncate transition-colors"
                        title={item.alt_text || "Add alt text"}
                      >
                        {item.alt_text ? (
                          <span className="text-zinc-400">{item.alt_text}</span>
                        ) : (
                          <span className="italic">+ Add alt text</span>
                        )}
                      </button>
                    )}

                    {/* Set Primary + Delete */}
                    {editingId !== item.id && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSetPrimary(item.id)}
                          disabled={item.is_primary}
                          title={
                            item.is_primary
                              ? "Already primary"
                              : "Set as primary"
                          }
                          className="flex-1 py-1 text-xs font-semibold rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          ★
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this media item?"))
                              handleDelete(item.id);
                          }}
                          title="Delete"
                          className="flex-1 py-1 text-xs font-semibold rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox preview */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            {previewItem.media_type === "video" ? (
              <video
                src={previewItem.url}
                controls
                autoPlay
                className="w-full h-full object-contain max-h-[70vh]"
              />
            ) : (
              <img
                src={previewItem.url}
                alt={previewItem.alt_text ?? ""}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            )}
            {previewItem.alt_text && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3 text-sm text-zinc-300">
                {previewItem.alt_text}
              </div>
            )}
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
