import React, { Component } from 'react';
import ReactDOM from 'react-dom'
/*
//import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav } from 'mdbreact';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
*/

export default function NavigationBar() {

    return (
        <header>
            <div className="nav">
                <input type="checkbox" id="nav-check" />
                <div className="nav-header">
                    <div className="nav-title">
                        DOTA 2 GAME
                    </div>
                </div>
                <div className="nav-btn">
                    <label for="nav-check">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                </div>

                <div className="nav-links">
                    <a href="">Ceva util</a>
                    <a href="">Ceva util1</a>
                    <a href="">Ceva util2</a>
                    <a href="">Ceva util3</a>
                    <a href="">Ceva util4</a>
                </div>
            </div>
        </header>
    );

}

ReactDOM.render(<NavigationBar />, document.getElementById('root'));

