import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  height: 344px;
  margin-right: 30px;
  margin-left: 40px;
  @media (max-width: 850px) {
    margin-right: 10px;
    margin-left: 10px;
  }
  @media (max-width: 750px) {
    margin-right: 50px;
    margin-left: 50px;
  }

`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
`;

export const NavItem = styled.div`
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s;
  color: ${props => props.isSelected ? '#007bff' : 'black'};
  @media (max-width: 950px) {
    font-size: smaller;
  }
  @media (max-width: 850px) {
    font-size: x-small;
  }

  &:hover {
    color: #007bff;
  }

  &:not(:last-child)::after {
    color: black;
  }
`;

export const ScrollableContent = styled.div`
flex: 1; /* Take the remaining space */
overflow-y: auto; /* Allow vertical scrolling */
box-sizing: border-box
scrollbar-width: none;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  grid-gap: 10px;
  padding: 10px;
  justify-items: center;
  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
`;