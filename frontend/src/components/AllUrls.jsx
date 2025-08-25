import React, { useState, useEffect } from 'react';

const AllUrls = () => {
  const [allUrls, setAllUrls] = useState([]);
  const backEndUrl = import.meta.env.VITE_BACKEND_URL



  useEffect(() => {
    let isMounted = true;


    const fetchUrls = async () => {
      try {
        const res = await fetch(`${backEndUrl}/test`,{
          credentials:'include'
        });
        const data = await res.json();
        if (isMounted) {
          setAllUrls(data);
        }
      } catch (err) {
        console.error("Error fetching URLs:", err);
      }


    };

    if (allUrls.length===0) {
      fetchUrls();
    }


    return () => {
      isMounted = false;
    };
  }, [backEndUrl,allUrls.length]);





  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">📜 URL History</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allUrls.length === 0 ? (<p className="text-center text-gray-400 col-span-full">No History</p>
        ) : (allUrls.map((url, index) => (
          <div

            key={index}
            className="bg-gray-800 border overflow-auto border-gray-700 rounded-xl p-4 shadow-md text-white hover:shadow-lg transition"
          >
            <p className="text-blue-400 font-semibold">Short ID:</p>
            <a
              href={`${backEndUrl}/url/${url.shortId}`}
              target="_blank"
              rel="noreferrer"
              className="break-words underline  text-blue-300 hover:text-blue-400 transition"
            >
              {`${backEndUrl}/url/${url.shortId}`}
            </a>

            <p className="mt-3 text-green-400 font-semibold">Original URL:</p>
            <p className="break-words text-gray-300">{url.redirectUrl}</p>

            <p className="mt-3 text-sm text-yellow-400">
              Visits: <span className="font-bold">{url.visitHistory.length}</span>
            </p>
          </div>
        )))}
      </div>
    </div>
  );
};

export default AllUrls;
