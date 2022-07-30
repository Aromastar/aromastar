const lazyLoadImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('.lazy-load-image')
const IMAGE_LOADED_CLASSNAME: string = 'image-loaded'
const IMAGE_SRC_ATTR: string = 'data-lazy-src'
const IMAGE_TRANSITION_DURATION: number = 500

if ('IntersectionObserver' in window) {
  function onImageLoad(this: HTMLImageElement) {
    const blurredImage: HTMLElement = this.nextElementSibling as HTMLImageElement
    blurredImage.classList.add(IMAGE_LOADED_CLASSNAME)
    setTimeout(() => {
      blurredImage.remove()
    }, IMAGE_TRANSITION_DURATION)
    this.removeEventListener('load', onImageLoad)
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.setAttribute('src', target.getAttribute(IMAGE_SRC_ATTR) as string)
        target.addEventListener('load', onImageLoad)
        observer.unobserve(target)
      }
    })
  }, {})

  lazyLoadImages.forEach(lazyLoadImage => {
    imageObserver.observe(lazyLoadImage)
  })
} else {
  lazyLoadImages.forEach(lazyLoadImage => {
    lazyLoadImage.setAttribute('src', lazyLoadImage.getAttribute(IMAGE_SRC_ATTR) as string);
    (lazyLoadImage.nextElementSibling as HTMLImageElement).remove()
  })
}
