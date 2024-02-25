import Styles from "../../css/loaders/Loader.module.css"

export default function Loader() {
    return (
        <div className={Styles.loaderContainer}>
            <span className={Styles.loader}></span>
        </div>
    )
}
