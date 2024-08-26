import React from "react";
import { LogoImg } from "../styles/Navbar.styled";
import logo from "../assets/sitelogo.svg"
import { Link } from "react-router-dom";

export const Logo = () => {
    return ( 
    <Link to="/">
        <LogoImg src={logo} alt="logo" />
    </Link>
    )
};

