import { useState } from "react";
import axios from "axios";
import AdminPage from "./AdminPage";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const API =  "https://url-shortner-t0v7.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    try {
      const res = await axios.post(`${API}/api/shorten`, { longUrl });
      setShortUrl(res.data.shortUrl);
      setLongUrl("");
    } catch (err) {
      console.error(err);
      alert("Error shortening URL");
    }
  };

  if (showAdmin) {
    return <AdminPage onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl text-blue-800 font-bold">URL Shortener</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter long URL "
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-80"
        />
        <button
          type="submit"
         className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Shorten
        </button>
      </form>

      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}

      <div style={{ marginTop: 30 }}>
        <button
          onClick={() => setShowAdmin(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
        >
          View Admin Page
        </button>
      </div>
    </div>
  );
}
