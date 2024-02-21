import Styles from "../../css/navbar/Navbar.module.css"
import logoRectangle from "../../assets/logo/Digishop-Logo-Rectangle.png"

export default function Navbar() {
    return (
        <nav className={Styles.navbar}>
            <div className={Styles.navbarContent}>
                <div className={Styles.logoContainer}><img src={logoRectangle} alt="" /></div>
                <div className={Styles.categoryContainer}>
                    <ul>
                        <li><a href="/">Category</a></li>
                        <li><a href="/">Category</a></li>
                        <li><a href="/">Category</a></li>
                        <li><a href="/">Category</a></li>
                        <li><a href="/">Category</a></li>
                    </ul>
                </div>
                <div className={Styles.searchBarContainer}>
                    
                </div>
            </div>
        </nav>
    )
}
