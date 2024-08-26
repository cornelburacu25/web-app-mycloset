import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarContainer = styled.div`
    width: 250px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const SidebarList = styled.ul`
    list-style: none;
    padding: 0;
`;

export const SidebarItem = styled.li`
    margin: 20px 0;
`;

export const SidebarTitle = styled.div`
    font-weight: bold;
    margin-left: -55px;
    cursor: default;
`;

export const StyledNavLink = styled(NavLink)`
text-decoration: none;
color: inherit;

&.${(props) => props.activeClassName} {
  color: #007dfc;
}

&:hover {
  color: #007dfc;
}
`;