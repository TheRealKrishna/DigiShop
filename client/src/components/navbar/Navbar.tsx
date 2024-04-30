import Styles from "../../css/navbar/Navbar.module.css"
import logoRectangle from "../../assets/logo/logo-rectangle.png"
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BsHandbag } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import FloatingCart from "../cart/FloatingCart";
import Dropdown from 'react-bootstrap/Dropdown';


export default function Navbar() {
	const [searchBarVisibility, setSearchBarVisibility] = useState<Boolean>(false)
	const navigate = useNavigate();
	const toggleSearchBar = () => setSearchBarVisibility(!searchBarVisibility)
	const dispatch = useDispatch()
	const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
	const user = useSelector((state: any) => state.user.user);
	const [cartToggle, setCartToggle] = useState<boolean>(false)
	const [searchQuery, setSearchQuery] = useState("")

	const handleLogout = async () => {
		localStorage.clear()
		dispatch(logout())
		toast.error("Logged out successfully!")
	}

	const handleSearch = async (e: any) => {
		e.preventDefault();
		navigate(`/search?q=${searchQuery}`);
		setSearchBarVisibility(false);
	}

	return (
		<nav className={Styles.navbar}>
			<div className={Styles.navbarContent}>
				<div className={Styles.navbarLeftContainer} style={{ display: searchBarVisibility ? "none" : "flex" }}>
					<GiHamburgerMenu className={Styles.hamburgerMenu} />
					<Link to="/" className={Styles.logoContainer}><img src={logoRectangle} alt="logoRectangle" /></Link>
					<div className={Styles.categoryContainer}>
						<ul>
							<li><a href="/">Category</a></li>
							<li><a href="/">Category</a></li>
							<li><a href="/">Category</a></li>
							<li><a href="/">Category</a></li>
							<li><a href="/">Category</a></li>
						</ul>
					</div>
				</div>
				<div className={Styles.navbarRightContainer} style={{ display: searchBarVisibility ? "none" : "flex" }}>
					<form className={Styles.searchBarContainer} onSubmit={handleSearch}>
						<IoSearchOutline />
						<input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search DigiShop" />
					</form>
					<div className={Styles.menuIcons}>
						<IoSearch className={Styles.toggleSearchIcon} onClick={toggleSearchBar} />
						<Dropdown autoClose placement="bottom-start">
							<Dropdown.Toggle as={"i"} disabled={!isLoggedIn} color="transparent"><FaRegUser onClick={() => isLoggedIn ? null : navigate("/auth/login")} /></Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item>Action</Dropdown.Item>
								<Dropdown.Item>Another action</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<div className={Styles.cartContainer}>
							<Dropdown show={cartToggle} onToggle={() => setCartToggle(!cartToggle)} autoClose="outside" placement="bottom-start">
								<Dropdown.Toggle as={"i"} split={false} color="transparent"><BsHandbag style={{ strokeWidth: "0.02rem" }} /></Dropdown.Toggle>
								<Dropdown.Menu className={Styles.floatingCartMenu}>
									<FloatingCart setCartToggle={setCartToggle} />
								</Dropdown.Menu>
							</Dropdown>
							{
								user?.cart?.cartItems?.length > 0 && <p>{user?.cart?.cartItems?.length}</p>
							}
						</div>
					</div>
				</div>
				<div className={Styles.mobileSearchBarContainer} style={{ display: searchBarVisibility ? "flex" : "none" }}>
					<form style={{ width: "100%" }} onSubmit={handleSearch}>
						<IoSearchOutline />
						<input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search DigiShop" />
					</form>
					<IoMdCloseCircleOutline style={{ display: searchBarVisibility ? "block" : "none", cursor: "pointer" }} onClick={toggleSearchBar} />
				</div>
			</div>
		</nav>
	)
}
