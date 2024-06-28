import { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../store/authSlice";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/flixview.png";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state?.auth?.user?.data)
  const dispatch = useDispatch()

  const handleAuth = async () => {
    if (!user) {
      navigate("/login")
    }
    else {
      await dispatch(logout());
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(user);
  }, [location, user])

  const openSearch = () => {
    setMobileMenu(false)
    setShowSearch(true)
  }

  const openMobileMenu = () => {
    setMobileMenu(true)
    setShowSearch(false)
  }

  const searchQueryHandler = (event) => {
    if (event.key == "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000)
    }
  }

  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenu(false);
  }

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  }

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar)
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY])


  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="" />
          <span className="logo-text">FlixView</span>
        </div>
        <ul className="menuItems">
          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
          <li className="menuItem" onClick={() => navigationHandler("movie")}>Movies</li>
          <li className="menuItem" onClick={() => navigationHandler("tv")}>TV Shows</li>
          <li className="menuItem" onClick={() => handleAuth()}>
            {!user ? <span>Login</span> : <span>Logout</span>}
          </li>
        </ul>

        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          {mobileMenu ? (<VscChromeClose onClick={() => setMobileMenu(false)} />) : (<SlMenu onClick={openMobileMenu} />)}
        </div>
      </ContentWrapper>


    {/* Search */}
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className='searchInput'>
              <input type='text' placeholder='Search for a movie or tv show.....'
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler} />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;