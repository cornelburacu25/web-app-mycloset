import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode";

const RequireAuth = () => {
    const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        // Retrieve the token from local storage
        const token = Cookies.get("token");
        console.log("Token:", token); // Log the token value
      
        // If token exists, set authorization header and check authentication
        if (!token) {
          navigate("/login");
          return;
        } else {
          const decodedToken = jwtDecode(`${token}`);
          console.log(decodedToken); // Object that contains id
      
          if (decodedToken.exp * 1000 < Date.now()) {
            navigate('/login');
            return;
          }
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
}

  return (
    <>
      <Outlet />
    </>
  );
};

export default RequireAuth;
