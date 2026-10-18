
import React from "react";

export default function Home({ navigate }) {
  const goTo = (page) => {
    if (navigate) navigate(page);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#203b2c",
        background: "#ffffff",
      }}
    >
      <nav
        style={{
          height: "80px",
          padding: "0 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
          borderBottom: "1px solid #e5eae5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "#285d43",
              color: "white",
              padding: "12px 16px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "22px",
            }}
          >
            F
          </div>
          <strong style={{ fontSize: "19px", letterSpacing: "1px" }}>
            FICUSIA HUB
          </strong>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: "bold" }}>Home</span>
          <span
            onClick={() => goTo("artworks")}
            style={{ cursor: "pointer" }}
          >
            Discover Art
          </span>
          <span
            onClick={() => goTo("creators")}
            style={{ cursor: "pointer" }}
          >
            Creators
          </span>
          <span onClick={() => goTo("jobs")} style={{ cursor: "pointer" }}>
            Career
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => goTo("login")}
            style={buttonStyle("#ffffff", "#285d43", "#d6e1d8")}
          >
            Log In
          </button>
          <button
            onClick={() => goTo("register")}
            style={buttonStyle("#285d43", "#ffffff", "#285d43")}
          >
            Join the Hub ↗
          </button>
        </div>
      </nav>

      <section
        style={{
          minHeight: "500px",
          padding: "60px 7%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "50px",
          flexWrap: "wrap",
          background: "linear-gradient(120deg, #204e39, #67936b)",
          color: "white",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: "1 1 420px", maxWidth: "650px" }}>
          <p
            style={{
              letterSpacing: "2px",
              fontWeight: "bold",
              fontSize: "12px",
              color: "#dceba7",
            }}
          >
            THE CREATIVE COMMUNITY
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: "1.12",
              margin: "20px 0",
            }}
          >
            Your creativity.
            <br />
            <span style={{ color: "#dceba7" }}>
              Your next opportunity.
            </span>
          </h1>

          <p style={{ fontSize: "17px", lineHeight: "1.8", maxWidth: "540px" }}>
            Discover animation portfolios, connect with creative talent, and
            find your place in the creative industry.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "28px" }}>
            <button
              onClick={() => goTo("artworks")}
              style={buttonStyle("#ffffff", "#204e39", "#ffffff")}
            >
              Explore Artworks ↗
            </button>
            <button
              onClick={() => goTo("register")}
              style={buttonStyle("transparent", "#ffffff", "#b9d0bf")}
            >
              Become a Creator
            </button>
          </div>

          <p style={{ marginTop: "42px", fontSize: "14px", color: "#edf4df" }}>
            ✳ &nbsp; A creative space for animation students and alumni.
          </p>
        </div>

        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "380px",
            minHeight: "300px",
            borderRadius: "170px 170px 35px 35px",
            background: "linear-gradient(145deg, #cbdcb1, #6d966e)",
            border: "1px solid #b8d0b5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: "180px",
              fontWeight: "bold",
              color: "#f4f5e8",
              opacity: 0.95,
            }}
          >
            F
          </span>

          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              right: "14px",
              padding: "18px",
              borderRadius: "14px",
              background: "#214c37",
              color: "white",
              border: "1px solid #78977d",
            }}
          >
            <small style={{ letterSpacing: "2px" }}>CREATIVE SPOTLIGHT</small>
            <h3 style={{ marginBottom: "0" }}>Ideas become worlds.</h3>
          </div>

          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "-15px",
              padding: "18px",
              borderRadius: "12px",
              background: "white",
              color: "#234b37",
              fontSize: "13px",
            }}
          >
            ✳ &nbsp; Create something meaningful
          </div>
        </div>
      </section>
    </div>
  );
}

function buttonStyle(background, color, borderColor) {
  return {
    background,
    color,
    border: `1px solid ${borderColor}`,
    borderRadius: "10px",
    padding: "15px 21px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  };
}
