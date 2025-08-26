// src/components/Login.jsx

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


const Login = ({ setIsAuthenticated, setRole }) => {

  const backEndUrl = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData
    if (!email || !password) {
      toast.error('Enter Credenstials first')
      return
    }

    try {

      const res = await fetch(`${backEndUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        toast.error(errorData.message || "Login failed");
        return
      }
      toast.success("User Logged in Successfully")
      const data = await res.json()

      setIsAuthenticated(true)

      if (data.role === "ADMIN") {

        setRole("ADMIN")
      }
     window.location.href = '/urlapp'

    } catch (err) {
      toast('Error Logging In')
    }


  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-md mx-auto py-12 px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 mt-10"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            className="p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-xl font-semibold mt-2"
          >
            Log In
          </button>
          <div>
            <Link to={'/signup'} className='w-full flex justify-center items-center  
            text-sm text-blue-300 underline hover:text-white transition-all'>Create an account</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;