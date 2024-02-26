import { AdminMenu, EntitiesMenu, AccountMenu } from '../../menus';;
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import React, { useState } from "react"
import { Home, Brand } from '../header-components';
import { IHeaderProps } from '../header';
import { Storage } from 'react-jhipster';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

const HeaderAdmin: React.FC<IHeaderProps> = (props: IHeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const isAdmin = hasAnyAuthority(Storage.local.get("roles"), [AUTHORITIES.ADMIN]);
    const isAuthenticated = Storage.local.get("user");

    return (
        <Navbar style={{ marginBottom: "70px" }} data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
            <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
            <Brand />
            <Collapse isOpen={menuOpen} navbar>
                <Nav id="header-tabs" className="ms-auto" navbar>
                    <Home />
                    {isAuthenticated && <EntitiesMenu />}
                    {isAuthenticated && isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
                    <AccountMenu isAuthenticated={props.isAuthenticated} />
                </Nav>
            </Collapse>
        </Navbar>
    )
}


export default HeaderAdmin;