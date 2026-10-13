
function EditProfile({ navigate }) {
  return (
    <div className="auth-container">
      <form className="form-card">
        <h2>Edit Profile</h2>

        <label>Full Name</label>
        <input
          type="text"
          value="Intan Rahmadani Putri"
          readOnly
        />

        <label>Specialization</label>
        <input
          type="text"
          placeholder="Enter your specialization"
        />

        <label>Bio</label>
        <textarea
          placeholder="Tell us about yourself"
          rows="5"
        ></textarea>

        <label>Software Skills</label>
        <input
          type="text"
          placeholder="e.g. Blender, Photoshop"
        />

        <button
          type="button"
          className="primary-btn full"
          onClick={() => {
            alert("Your profile has been updated successfully.");
            navigate("profile");
          }}
        >
          Save Changes
        </button>

        <button
          type="button"
          className="secondary-btn full"
          onClick={() => navigate("profile")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditProfile;