const bgVideo = document.querySelector('#bg-video') as HTMLVideoElement
const playBgVideo = () => {
  if (bgVideo.paused) bgVideo.play()
  document.removeEventListener('click', playBgVideo)
}

document.addEventListener('click', playBgVideo)
