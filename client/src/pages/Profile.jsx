import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    photo: currentUser.photo,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const [errorDelete, setErrorDelete] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, photo: downloadURL }));
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignoutUser = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(data.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setErrorDelete(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 cursor-pointer rounded-full mx-auto"
          src={formData.photo || currentUser.photo}
          alt=" profile"
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">
              Image Upload Error (image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg cursor-pointer"
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg cursor-pointer"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg cursor-pointer"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg cursor-pointer uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-600 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-600 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500 mt-5">{error ? error : " "}</p>}
      <p className="text-green-700 my -5">
        {updateSuccess ? "user update is successfully!" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-700 w-full">
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error Showing Listing" : ""}
      </p>
      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center mt-2 gap-5"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-16 w-16 object-contain"
                  src={listing.imageUrls[0]}
                  alt="listing image"
                />
              </Link>
              <Link
                className="flex-1 text-slate-700 font-semibold  hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
              <Link to={`/update-listing/${listing._id}`} >
              <button className="text-green-700 uppercase">Edit</button>
              </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
