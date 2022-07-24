const eventsVideo: HTMLVideoElement = document.getElementById('events-video') as HTMLVideoElement
const eventsVideoButton: HTMLButtonElement = document.getElementById('events-video-btn') as HTMLButtonElement
const EVENTS_VIDE_BTN_HIDDEN_CLASSNAME = 'is-hidden'

eventsVideoButton.addEventListener('click', () => {
  if (eventsVideo.paused) {
    eventsVideo.play()
    eventsVideoButton.classList.add(EVENTS_VIDE_BTN_HIDDEN_CLASSNAME)
    return
  }

  eventsVideo.pause()
  eventsVideoButton.classList.remove(EVENTS_VIDE_BTN_HIDDEN_CLASSNAME)
})
