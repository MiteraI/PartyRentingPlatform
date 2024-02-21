import { AdminMenu, EntitiesMenu, AccountMenu } from '../../menus';;
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import React, { useState } from "react"
import { Home, Brand } from '../header-components';
import { IHeaderProps } from '../header';

const HeaderAdmin: React.FC<IHeaderProps> = (props: IHeaderProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);


    return (
        <Navbar style={{ marginBottom: "70px" }} data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
            <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
            <Brand />
            <Collapse isOpen={menuOpen} navbar>
                <Nav id="header-tabs" className="ms-auto" navbar>
                    <Home />
                    {props.isAuthenticated && <EntitiesMenu />}
                    {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
                    <AccountMenu isAuthenticated={props.isAuthenticated} />
                </Nav>
            </Collapse>
        </Navbar>
    )
}


export default HeaderAdmin;