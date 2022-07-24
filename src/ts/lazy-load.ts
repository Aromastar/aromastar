// const isIntersectionObserverSupported = (): boolean =>
//   typeof IntersectionObserver !== 'undefined'
// const lazyLoadImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('.lazy-load-img')


// const observer = new IntersectionObserver((entries, observer) => {
//   entries.forEach(({ target, isIntersecting }) => {
//     console.log(target)
//     if (isIntersecting) {
//       const image = target.querySelector('.image--original') as HTMLImageElement
//       const imageBlurred = target.querySelector('.image--blurred') as HTMLImageElement
//       console.log(image)

//       image.setAttribute('src', target.getAttribute('data-src') as string);
//       image.addEventListener('load', () => {
//         image.classList.remove('is-loading')
//         setTimeout(imageBlurred.remove, 300)
//       })

//       observer.unobserve(target);
//   }
//   })
// }, {
//   rootMargin: '0px',
//   threshold: 1.0
// })

// lazyLoadImages.forEach(lazyImage => {
//   observer.observe(lazyImage)
// })
