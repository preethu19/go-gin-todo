import React from "react";
import {Navbar, Container} from 'react-bootstrap';
import logo from './header-logo.png';
import './header.css';


const Header = () => {
    return(
    <Navbar bg="dark" variant="dark" className="header">
        <Container>
        <Navbar.Brand href="#home">
            <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            />{' '}
        Todo App
        </Navbar.Brand>
        </Container>
    </Navbar>
    )
}

export default Header;