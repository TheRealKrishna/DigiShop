import Styles from "../../css/navbar/Navbar.module.css"
import logoRectangle from "../../assets/logo/logo-rectangle.png"
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BsHandbag } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FloatingCart from "../cart/FloatingCart";

export default function Navbar() {
	const [searchBarVisibility, setSearchBarVisibility] = useState<Boolean>(false)
	const navigate = useNavigate()
	const toggleSearchBar = () => setSearchBarVisibility(!searchBarVisibility)
	const dispatch = useDispatch()
	const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
	const user = useSelector((state: any) => state.user.user);
	const handleLogout = async () => {
		localStorage.clear()
		dispatch(logout())
		toast.error("Logged out successfully!")
	}

	return (
		<nav className={Styles.navbar}>
			<div className={Styles.navbarContent}>
				<div className={Styles.navbarLeftContainer} style={{ display: searchBarVisibility ? "none" : "flex" }}>
					<GiHamburgerMenu className={Styles.hamburgerMenu} />
					<div className={Styles.logoContainer}><img src={logoRectangle} alt="logoRectangle" /></div>
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
					<div className={Styles.searchBarContainer}>
						<IoSearchOutline />
						<input type="text" placeholder="Search DigiShop" />
					</div>
					<div className={Styles.menuIcons}>
						<IoSearch className={Styles.toggleSearchIcon} onClick={toggleSearchBar} />
						<CDropdown autoClose placement="bottom-start" variant='nav-item'>
							<CDropdownToggle caret={false} disabled={!isLoggedIn} color="transparent"><FaRegUser onClick={() => isLoggedIn ? null : navigate("/auth/login")} /></CDropdownToggle>
							<CDropdownMenu>
								<CDropdownItem>Action</CDropdownItem>
								<CDropdownItem>Another action</CDropdownItem>
								<CDropdownDivider />
								<CDropdownItem onClick={handleLogout}>Logout</CDropdownItem>
							</CDropdownMenu>
						</CDropdown>
						<div className={Styles.cartContainer}>
							<CDropdown autoClose="outside" placement="bottom-start" variant='nav-item'>
								<CDropdownToggle caret={false} color="transparent"><BsHandbag style={{ strokeWidth: "0.02rem" }} /></CDropdownToggle>
								<CDropdownMenu className={Styles.floatingCartMenu}>
									<FloatingCart/>
								</CDropdownMenu>
							</CDropdown>
							{
								user?.cart?.cartItems?.length > 0 && <p>{user?.cart?.cartItems?.length}</p>
							}
						</div>
					</div>
				</div>
				<div className={Styles.mobileSearchBarContainer} style={{ display: searchBarVisibility ? "flex" : "none" }}>
					<div style={{ width: "100%" }}>
						<IoSearchOutline />
						<input type="text" placeholder="Search DigiShop" />
					</div>
					<IoMdCloseCircleOutline style={{ display: searchBarVisibility ? "block" : "none", cursor: "pointer" }} onClick={toggleSearchBar} />
				</div>
			</div>
		</nav>
	)
}
