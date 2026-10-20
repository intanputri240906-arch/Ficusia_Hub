import "./fiturjuni.css";

// AUTH-02 - Logout
// AC: (1) tombol logout tersedia; (2) sesi pengguna diakhiri;
// (3) setelah logout kembali ke halaman login/awal.
// onLogout = fungsi dari App untuk mengosongkan user (mis. () => setUser(null)).
function Logout({ navigate, user, onLogout }) {
  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("login");
  };

  return (
    <div className="jn-page">
      <div className="jn-center jn-card">
        <span className="jn-label">FICUSIA HUB</span>
        <h1>Keluar dari Sistem?</h1>

        <p className="jn-desc">
          {user
            ? "Sesi kamu akan diakhiri, sehingga akunmu tidak dapat diakses oleh pengguna lain pada perangkat ini."
            : "Kamu belum masuk ke sistem."}
        </p>

        {user ? (
          <>
            <button className="jn-btn jn-btn-danger" onClick={handleLogout}>
              Ya, Logout
            </button>
            <button
              className="jn-btn jn-btn-outline"
              onClick={() => navigate("profile")}
            >
              Batal
            </button>
          </>
        ) : (
          <button className="jn-btn" onClick={() => navigate("login")}>
            Ke Halaman Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Logout;
