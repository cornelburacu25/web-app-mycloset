import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const LogoImg = styled.img`
    width: 100px
`;

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: relative;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: ${(props) => (props.active ? "block" : "none")};
    text-align: center;
    padding: 2rem 0;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  transition: 0.2s;
  color: black;
  margin-right: 2rem;
  margin-left: 1rem;
  &:last-child {
    background: black;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    color: white;
    &:hover {
      color: white;
    }
    &.${(props) => props.activeclassname} {
      color: #007dfc;
    }
  }

  &.${(props) => props.activeclassname} {
    color: #007dfc;
  }

  &:hover {
    color: #007dfc;
  }

  @media (max-width: 768px) {
    display: block;
    margin: 0.5rem auto;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  display: none;
  position: absolute;
  right: 20px;
  top: 21px;
  color: black;
  font-size: 1.8rem;
  cursor: pointer;
  @media (max-width: 768px){
    display: block;
  }
`;

const UserIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 20px;
  margin-left: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

export {
  LogoImg,
  NavbarWrapper,
  NavLinkWrapper,
  StyledNavLink,
  StyledFontAwesomeIcon,
  UserIconWrapper,
  DropdownMenu,
  DropdownItem
};
