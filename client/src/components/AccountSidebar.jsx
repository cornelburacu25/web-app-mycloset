import React from 'react';
import { SidebarContainer, SidebarList, SidebarItem, SidebarTitle, StyledNavLink } from '../styles/AccountSidebar.styled';

const AccountSidebar = () => {
    return (
        <SidebarContainer>
            <SidebarList>
                <SidebarItem>
                    <SidebarTitle>My Account</SidebarTitle>
                </SidebarItem>
                <SidebarItem>
                    <StyledNavLink to="edit-profile" activeClassName="active">
                        Edit Profile
                    </StyledNavLink>
                </SidebarItem>
                <SidebarItem>
                    <StyledNavLink to="change-password" activeClassName="active">
                        Change Password
                    </StyledNavLink>
                </SidebarItem>
                <SidebarItem>
                    <StyledNavLink to="statistics" activeClassName="active">
                        Statistics
                    </StyledNavLink>
                </SidebarItem>
            </SidebarList>
        </SidebarContainer>
    );
};

export default AccountSidebar;
