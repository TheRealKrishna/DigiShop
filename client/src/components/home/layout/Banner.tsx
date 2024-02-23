import { CCarousel, CCarouselItem, CImage } from '@coreui/react'
import banner1 from "../../../assets/home/Banners/1.png"
import banner2 from "../../../assets/home/Banners/2.png"
import banner3 from "../../../assets/home/Banners/3.png"
import banner4 from "../../../assets/home/Banners/4.png"
import banner1_mobile from "../../../assets/home/Banners/1_mobile.png"
import banner2_mobile from "../../../assets/home/Banners/2_mobile.png"
import banner3_mobile from "../../../assets/home/Banners/3_mobile.png"
import banner4_mobile from "../../../assets/home/Banners/4_mobile.png"
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Styles from "../../../css/home/layout/Banner.module.css"

export default function Banner() {
    return (
        <>
            <CCarousel controls indicators interval={3000} className={Styles.carousel}>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner1} alt="slide 1" />
                </CCarouselItem>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner2} alt="slide 2" />
                </CCarouselItem>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner3} alt="slide 3" />
                </CCarouselItem>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner4} alt="slide 4" />
                </CCarouselItem>
            </CCarousel>

            <CCarousel controls indicators interval={3000} className={Styles.mobileCarousel}>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner1_mobile} alt="slide 1" />
                </CCarouselItem>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner2_mobile} alt="slide 2" />
                </CCarouselItem>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner3_mobile} alt="slide 3" />
                </CCarouselItem>
                <CCarouselItem>
                    <CImage className="d-block w-100" src={banner4_mobile} alt="slide 4" />
                </CCarouselItem>
            </CCarousel>
        </>
    )
}
