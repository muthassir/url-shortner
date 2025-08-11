import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage({ onBack }) {
  const [urls, setUrls] = useState([]);
  const API = "http://localhost:5000";

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/urls`);
        setUrls(res.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching admin list");
      }
    };
    fetch();
  }, [API]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={onBack}
            className=" cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            ← Back
          </button>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left">Original URL</th>
                <th className="px-6 py-3 text-left">Short URL</th>
                <th className="px-6 py-3 text-left">Clicks</th>
                <th className="px-6 py-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-3 max-w-xs truncate">
                    <a
                      href={u.original_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {u.original_url}
                    </a>
                  </td>
                  <td className="px-6 py-3">
                    <a
                      href={`${API}/${u.short_code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {`${API}/${u.short_code}`}
                    </a>
                  </td>
                  <td className="px-6 py-3 font-semibold">{u.clicks}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {urls.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No URLs found in the system.
          </p>
        )}
      </div>
    </div>
  );
}
