import React, { useState,useEffect } from 'react';
import Navbar from './components/Navbar';
import AllUrls from './components/AllUrls';

const App = () => {
  const backEndUrl = import.meta.env.VITE_BACKEND_URL 
  
  const [inputUrl, setInputUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [toggleComp, setToggleComp] = useState(false);


    useEffect(() => {
    const storedUrl = localStorage.getItem("shortUrl");
    if (storedUrl) {
      setShortUrl(storedUrl);
    }
  }, []);

  const handleToggle = () => {
    setToggleComp(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

    if (!inputUrl.trim() || !urlRegex.test(inputUrl)) {
      alert("Please enter a valid URL before generating.");
      return;
    }

    try {
      const res = await fetch(`${backEndUrl}/url`, {
        method: "POST",
          headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: inputUrl })
      });

      const data = await res.json();
       const newShortUrl=`${backEndUrl}/url/${data.id}`
      setShortUrl(newShortUrl);
      localStorage.setItem("shortUrl", newShortUrl); 


      setInputUrl("");

    } catch (err) {
      console.log("Error submitting URL", err);
    }
  };

  const handleDelete = async () => {
    await fetch(`${backEndUrl}/delete`);
    setToggleComp(prev => !prev);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar />

        <div className="max-w-3xl mx-auto py-12 px-6">

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4"
          >
            <label htmlFor="url" className="text-sm font-medium">
              Enter your original URL
            </label>
            <input
              id="url"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://example.com"
              className="p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-xl font-semibold"
            >
              Generate
            </button>
          </form>

          {shortUrl && (
            <div className="mt-6 bg-green-900 text-green-300 px-4 py-3 rounded-xl">
              <p>
                Short URL:{" "}
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-green-400 transition"
                >
                  {shortUrl}
                </a>
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleToggle}
              className="bg-purple-600 hover:bg-purple-700 transition-all py-2 px-5 rounded-xl font-medium"
            >
              View History
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 transition-all py-2 px-5 rounded-xl font-medium"
            >
              Delete History
            </button>
          </div>

          {toggleComp && (
            <div className="mt-10">
              <AllUrls />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
