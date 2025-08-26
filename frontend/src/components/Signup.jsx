
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate()
  const backEndUrl = import.meta.env.VITE_BACKEND_URL


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData
    if (!name || !email || !password) {
      toast.error("Fill the input fields");
      return;
    }

    try {
      const res = await fetch(`${backEndUrl}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Signup failed");
        return;
      }

      const data = await res.json();

      toast.success('Sign up successful');
      navigate('/');

    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-md mx-auto py-12 px-6 ">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 mt-10"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          <label className="text-sm font-medium">
            Name
          </label>
          <input
            name="name"
            type="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm font-medium">
            Email
          </label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="your@email.com"
            className="p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm font-medium">
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
            className="bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-xl font-semibold mt-2 cursor-pointer"
          >
            Sign Up
          </button>
          <div>
            <Link to={'/'} className='w-full flex justify-center items-center 
            text-sm text-blue-300 underline hover:text-white transition-all'>Already have an account ?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;