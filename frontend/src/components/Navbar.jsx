import React from 'react';
import toast from 'react-hot-toast';
import { CgLogOut } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {

  const backEndUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await fetch(`${backEndUrl}/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    
      
      setIsAuthenticated(false)
    

      navigate('/');
      toast.success('Logged Out succesfully')
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-md p-4 flex items-center justify-between">
      <div onClick={()=>navigate('/urlapp')} className="cursor-pointer max-w-7xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          🔗 URL Shortener
        </h1>
      </div>

      <div onClick={logout}><CgLogOut className='w-8 sm:w-10 h-10 text-white' /></div>

    </nav>
  );
};

export default Navbar;
