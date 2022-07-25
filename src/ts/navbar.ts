if ('IntersectionObserver' in window && window.innerWidth > 720) {
  const sections = document.querySelectorAll('.js-section')
  const navbar = document.getElementById('navbar') as HTMLElement
  let currentLink: HTMLElement | null

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (currentLink) currentLink.classList.remove('is-active')
        currentLink = navbar.querySelector(`.section-${ target.getAttribute('id') as string }`)
        currentLink?.classList.add('is-active')
      }
    })
  }, {
    rootMargin: "-200px"
  })

  sections.forEach(section => {
    observer.observe(section)
  })
}
