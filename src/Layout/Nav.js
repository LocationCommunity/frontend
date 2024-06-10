import React, { useState, useRef, useContext, useEffect } from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import { AuthContext } from '../Context/AuthContext'; // Context 임포트
import { LuMenu } from "react-icons/lu";
import { FaMap } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { PiWechatLogoFill } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { RiLoginBoxLine } from "react-icons/ri";
import Swal from "sweetalert2";


function Nav() {
    const { isLoggedIn, logout, nickname } = useContext(AuthContext); // Context 사용
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const navbarRef = useRef(null);

    const handleLogout = (event) => {
        event.preventDefault(); // 링크의 기본 동작(페이지 새로고침) 방지 , 바로 "/"로 맵핑되면 로그아웃이 실행되기전에 새로고침이 될 수 있어서 방지하는게 무조건 좋다.
        // const confirmed = window.confirm("정말로 로그아웃하시겠습니까?");
        // if (confirmed) {
        //     logout();
        // }
        Swal.fire ({ icon: 'question',
                        title: '로그아웃 확인',
                        text: '정말로 로그아웃 하시겠습니까?',
                        showCancelButton : true,
                        confirmButtonText: '예',
                        cancelButtonText: '아니오',

        })
        .then(result => {
            if (result.isConfirmed) {
                logout();
            }
        })
        
    

        
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log(`Menu toggled. New state: ${!isMenuOpen}`);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false); // 모달 창을 닫음
    };

    const handleCloseMenu = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            !menuButtonRef.current.contains(event.target) &&
            navbarRef.current &&
            !navbarRef.current.contains(event.target)
        ) {
            setIsMenuOpen(false);
            console.log('Menu closed.');
        }
    };

    

    useEffect(() => {
        document.addEventListener('mousedown', handleCloseMenu);
        return () => {
            document.removeEventListener('mousedown', handleCloseMenu);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (isMenuOpen && menuRef.current && menuButtonRef.current) {
                const menuRect = menuRef.current.getBoundingClientRect();
                const menuButtonRect = menuButtonRef.current.getBoundingClientRect();
                const { innerHeight } = window;

                // Calculate new top position
                let newTop = menuButtonRect.bottom + window.scrollY;
                if (newTop + menuRect.height > innerHeight) {
                    newTop = menuButtonRect.top - menuRect.height + window.scrollY;
                }

                menuRef.current.style.top = `${newTop}px`;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    return (
        <div className="navbar" ref={navbarRef}>
            <div className="navbarLogo">
                <img src={logo} alt="Logo" />
            </div>
            {isLoggedIn ? (
                <div className="welcomeMessage">{nickname} 님 환영합니다!</div>
            ) : null}
            <button ref={menuButtonRef} className="navbarMenuButton" onClick={toggleMenu}>
                <LuMenu />
            </button>
            {isMenuOpen && (
                <div className="modal" ref={menuRef}>
                    <div className="modalContent">
                        <span className="closeButton" onClick={toggleMenu}>&times;</span>
                        <ul className="modalMenu">
                            <li><Link to="/" onClick={handleLinkClick}><GoHome size={25} /> Home </Link></li>
                            <li><Link to="/weather/data" onClick={handleLinkClick}>Weather</Link></li>
                            <li><Link to="/boards/lists" onClick={handleLinkClick}>Boards</Link></li>
                            <li><Link to="/place/list" onClick={handleLinkClick}>Places</Link></li>
                            <li><Link to="/map" onClick={handleLinkClick}><FaMap size={25}/> Map </Link></li>
                            <li><Link to="/matching" onClick={handleLinkClick}>Matching</Link></li>
                            <li><Link to="/chat/room/list" onClick={handleLinkClick}><PiWechatLogoFill size={25}/> My Chat </Link></li>
                            <li><Link to="/members/my-info" onClick={handleLinkClick}><CgProfile size={25}/> My Info </Link></li>
                            {isLoggedIn ? (
                                <li><Link to="/" onClick={handleLogout}><RiLogoutBoxRLine size={25}/></Link></li>
                            ) : (
                                <li><Link to="/members/login" onClick={handleLinkClick}><RiLoginBoxLine size={25} /></Link></li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Nav;
