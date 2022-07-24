const mobileMenuBtn = document.getElementById('mobile-menu-btn')
const mobileMenu = document.getElementById('mobile-menu')
const MOBILE_MENU_SHOWN_CLASSNAME = 'is-shown'

mobileMenuBtn!.addEventListener('click', () => {
  mobileMenu!.classList.toggle(MOBILE_MENU_SHOWN_CLASSNAME)
})

mobileMenu!.addEventListener('click', () => {
  mobileMenu!.classList.toggle(MOBILE_MENU_SHOWN_CLASSNAME)
})
