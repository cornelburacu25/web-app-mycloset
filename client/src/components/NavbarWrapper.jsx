import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavbarWrapper= ( {children} ) => {

    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        if (location.pathname == '/login' || location.pathname == '/register' || location.pathname == '/account-activation'
         || location.pathname == '/forgot-password' || location.pathname == '/change-password') {
            setShowNavbar(false);
        }
        else {
            setShowNavbar(true);
        }
    }, [location] )

    return (
        <div>
            { showNavbar && children }
        </div>
    )
}
export default NavbarWrapper;