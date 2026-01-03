import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import assets from "../assets/assets.js";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  // keep form synced after refresh
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NO IMAGE SELECTED
      if (!selectedImg) {
        const success = await updateProfile({
          fullName: name,
          bio,
        });

        if (success) navigate("/");
        return;
      }

      // IMAGE SELECTED → COMPRESS (FAST)
      const compressedImage = await imageCompression(selectedImg, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);

      reader.onload = async () => {
        const success = await updateProfile({
          profilePic: reader.result,
          fullName: name,
          bio,
        });

        if (success) navigate("/");
      };
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${assets.bg})` }}
    >
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>

          {/* Avatar Upload */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic?.trim()
                  ? authUser.profilePic
                  : assets.avatar_icon
              }
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border border-gray-500"
            />
            Upload profile pic
          </label>

          <input
            type="file"
            id="avatar"
            accept=".png,.jpg,.jpeg"
            hidden
            onChange={(e) => setSelectedImg(e.target.files[0])}
          />

          {/* Name */}
          <input
            type="text"
            value={name}
            required
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio */}
          <textarea
            value={bio}
            required
            rows={4}
            placeholder="Write profile bio"
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Save */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-violet-500 text-white p-2 rounded-full text-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        {/* ================= PROFILE IMAGE ================= */}
        <img
          src={
            authUser?.profilePic?.trim()
              ? authUser.profilePic
              : assets.logo_icon
          }
          alt="profile"
          className="w-50 h-50 rounded-full object-cover mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
