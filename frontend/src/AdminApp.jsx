import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

const AdminDashboard = ({ setIsAuthenticated }) => {
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        const res = await fetch(`${backEndUrl}/admin/urls`, {
          credentials: "include"
        });
        const data = await res.json();
        setUserUrls(data.urls || []);
      } catch (err) {
        console.error("Error fetching user URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-yellow-400">
          Admin Dashboard - All Shortened URLs
        </h1>

        {loading ? (
          <p className="text-center text-gray-400 text-lg">Loading...</p>
        ) : userUrls.length > 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* ✅ Responsive Scroll Wrapper */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left text-sm">
                <thead className="bg-gray-700 text-gray-300 uppercase">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Created By</th>
                    <th className="px-4 py-3 whitespace-nowrap">Short URL</th>
                    <th className="px-4 py-3 whitespace-nowrap">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {userUrls.map((url, index) => (
                    <tr
                      key={url._id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm break-words">{url.createdBy.email}</td>
                      <td className="px-4 py-3 text-blue-400 hover:underline break-all">
                        <a
                          href={`${backEndUrl}/url/${url.shortId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {`${backEndUrl}/url/${url.shortId}`}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm">{url.visitHistory.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">No URLs found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
