import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "./App.css";

const BACKEND_URL = "http://localhost:3000";

export default function App() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/guestbook`);
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const submitComment = async () => {
    setSuccessMsg("");
    setErrorMsg("");
    if (!name.trim() || !comment.trim()) {
      setErrorMsg("⚠️ Please fill in both fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), comment: comment.trim() }),
      });
      if (!res.ok) throw new Error();
      setSuccessMsg("🎉 Message sent! Thank you!");
      setName("");
      setComment("");
      await fetchComments();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("❌ Failed to send. Try again.");
    }
    setSubmitting(false);
  };

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("en-PH", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="app">

      {/* PARTICLES */}
      {engineReady && (
        <Particles
          id="tsparticles"
          options={{
            background: { color: { value: "#0d0000" } },
            fpsLimit: 60,
            particles: {
              number: { value: 100, density: { enable: true } },
              color: { value: ["#dc2626", "#ef4444", "#f97316", "#fca5a5", "#ffffff"] },
              shape: { type: "circle" },
              opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: { enable: true, speed: 0.8 }
              },
              size: { value: { min: 1, max: 4 } },
              links: {
                enable: true,
                distance: 140,
                color: "#dc2626",
                opacity: 0.25,
                width: 1,
              },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                outModes: { default: "bounce" },
              },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 120 },
                push: { quantity: 4 },
              },
            },
          }}
        />
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-dot">●</span> GuestSignbook
        </div>
        <a href="#guestbook" className="nav-btn">Sign Now</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="badge">🔴 Live Guestbook</div>
          <h1>
            Leave Your <br />
            <span className="gradient">Mark Here</span>
          </h1>
          <p className="tagline">
            Sign the guestbook and be part of something. <br />
            Every message matters.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{comments.length}</span>
              <span className="stat-label">Signatures</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Welcome</span>
            </div>
          </div>
          <a href="#guestbook" className="hero-btn">
            ✍️ Sign the Guestbook
          </a>
        </div>

        {/* Floating orbs */}
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </section>

      {/* GUESTBOOK */}
      <section className="guestbook" id="guestbook">
        <div className="guestbook-inner">

          <div className="section-header">
            <h2 className="section-title">Guestbook 📖</h2>
            <p className="section-sub">Leave a message — I'd love to hear from you!</p>
          </div>

          {/* FORM */}
          <div className="form-card">
            <h3>✍️ Leave a Message</h3>

            <div className="field">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="Juan Dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                maxLength={60}
              />
            </div>

            <div className="field">
              <label>Your Message *</label>
              <textarea
                placeholder="Write something nice! 😊"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                maxLength={300}
                rows={4}
              />
              <span className="char-count">{comment.length}/300</span>
            </div>

            <button
              className="submit-btn"
              onClick={submitComment}
              disabled={submitting}
            >
              {submitting ? "⏳ Sending..." : "✉️ Send Message"}
            </button>

            {successMsg && <p className="success">{successMsg}</p>}
            {errorMsg && <p className="error">{errorMsg}</p>}
          </div>

          {/* COMMENTS */}
          <div className="comments-section">
            <h3>💬 Messages ({comments.length})</h3>

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading messages...</p>
              </div>
            )}

            {!loading && comments.length === 0 && (
              <div className="empty">No messages yet. Be the first! 👆</div>
            )}

            {comments.map((c) => (
              <div className="comment-card" key={c.id}>
                <div className="comment-header">
                  <div className="avatar">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{c.name}</strong>
                    <span className="date">{formatDate(c.created_at)}</span>
                  </div>
                </div>
                <p className="comment-text">{c.comment}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Built with ⚛️ React + 🪺 NestJS + 🗄️ Supabase</p>
      </footer>

    </div>
  );
}