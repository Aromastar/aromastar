import { Swiper, SwiperOptions } from 'swiper'
import 'swiper/css'

let currentEventSlide: number = 0
let eventTitle: NodeListOf<HTMLElement> = document.querySelectorAll('.events-gallery__name')
const ACTIVE_SLIDE_CLASSNAME = 'is-active'
const SLIDE_INDEX_DATA_ATTRIBUTE = 'data-slide-index'

const swiper = new Swiper('#swiper', {
  loop: true,
  slidesPerView: 'auto',
  centeredSlides: true,
  init: false,
  speed: 500
} as SwiperOptions)

swiper.on('slideChange', () => {
  eventTitle[currentEventSlide].classList.remove(ACTIVE_SLIDE_CLASSNAME)
  currentEventSlide = Number(swiper.slides[swiper.activeIndex].getAttribute(SLIDE_INDEX_DATA_ATTRIBUTE))
  eventTitle[currentEventSlide].classList.add(ACTIVE_SLIDE_CLASSNAME)
})

swiper.init()
