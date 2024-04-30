import { useEffect } from "react";
import Banner from "./layout/Banner";


export default function Home() {

    useEffect(() => {
        document.title = "DigiShop - Shop Digitally"
    }, [])

    return (
        <>
            <Banner />
        </>
    )
}
