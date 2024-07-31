import React, { useEffect, useState } from "react";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [error,setError] = (null);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">
              {landlord.username.toUpperCase()}
            </span>{" "}
            for{" "}
            <span className="font-semibold"> {listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id=""
            rows="2"
            value={message}
            placeholder="Enter your message here.."
            className="w-full border p-3 rounded-lg"
            onChange={onChange}
          ></textarea>
          <a
            href={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white p-3 uppercase text-center rounded-lg hover:opacity-95 mt-4"
          >
            Send Message
          </a>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      )}
    </>
  );
}
