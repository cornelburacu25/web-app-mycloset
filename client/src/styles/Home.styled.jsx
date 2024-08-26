import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  padding: 20px;
  gap: 10px; 
`;

export const ImageBox = styled.div`
  width: 100%; 
  height: 100%; 
`;

export const SideImageBox = styled.div`
  width: 80%; 
  height: 100%; 
  margin: auto; 
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
`;

export const CenterText = styled.div`
  text-align: center;
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  align-self: center;
  padding: 0px;
`;

export const MainText = styled.h1`
  font-size: 2.5rem;
  margin: 10px 0;
`;

export const SubText = styled.p`
  font-size: 1.5rem;
  margin: 10px 0;
`;

export const StyledLink = styled(NavLink)`
  display: inline-block;
  margin-top: 10px;
  background: black;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  cursor: pointer;
  color: white;
  text-decoration: none;
  transition: 0.2s;
  &:hover {
    color: white;
  }
`;

export const AboutSection = styled.div`
  margin: 50px 0;
`;

export const AboutHeader = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: left;
  margin-left: 50px;
`;

export const AboutText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  text-align: left;
  margin-left: 50px;
`;

export const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 20px;
`;

export const Icon = styled(FontAwesomeIcon)`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-left: 50px;
`;

export const AboutImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;
