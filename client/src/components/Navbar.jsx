import React from "react";
import { useState } from "react";
import { Logo } from "./Logo";
import { NavLinkWrapper, NavbarWrapper, StyledFontAwesomeIcon, StyledNavLink, UserIconWrapper, DropdownMenu, DropdownItem } from "../styles/Navbar.styled";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [active, setActive] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        
        Cookies.remove('token');
        navigate('/login');
    };

    const handleAccountClick = () => {
        navigate('/myaccount');
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const link = [
        {
            page: "Home",
            href: "/"
        },
        {
            page: "MyClothes",
            href: "/myclothes"
        },
        {
            page: "MyOutfits",
            href: "/myoutfits"
        },
        {
            page: "OutfitPicker",
            href: "/outfitpicker"
        },
    ];
    return (
        <NavbarWrapper>
            <Logo />
            <StyledFontAwesomeIcon icon={faBars} onClick={() => setActive(!active)} />
            <NavLinkWrapper active={active ? "true" : undefined}>
                {link.map((link) => (
                    <StyledNavLink 
                        activeclassname="active" 
                        key={link.page} 
                        to={link.href}
                    >
                        {link.page}
                    </StyledNavLink>
                ))}
                {active ? (
                    <>
                        <StyledNavLink 
                            activeclassname="active" 
                            to="/myaccount"
                        >
                            MyAccount
                        </StyledNavLink>
                        <StyledNavLink 
                            activeclassname="active" 
                            to="/login"
                            onClick={handleLogout}
                        >
                            Logout
                        </StyledNavLink>
                    </>
                ) : (
                    <UserIconWrapper>
                        <FontAwesomeIcon icon={faUser} onClick={toggleDropdown} />
                        {dropdownOpen && (
                            <DropdownMenu>
                                <DropdownItem onClick={handleAccountClick}>MyAccount</DropdownItem>
                                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                            </DropdownMenu>
                        )}
                    </UserIconWrapper>
                )}
            </NavLinkWrapper>
        </NavbarWrapper>
    );
}

export default Navbar;