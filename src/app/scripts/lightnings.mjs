
export class Lightnings extends EventTarget {
  static MIN_TIMEOUT = 3000
  static MAX_TIMEOUT = 5000

  #node = undefined
  #videos = []
  #timeoutDuration = 
    Math.round(Math.random() * (Lightnings.MAX_TIMEOUT - Lightnings.MIN_TIMEOUT) + Lightnings.MIN_TIMEOUT)

  constructor(node = document.createElement("div")) {
    super()
    this.#node = typeof node === "string" ? document.querySelector(node) : node
    this.#videos = this.#initVideo()
    this.#flash()
  }

  #initVideo = () => {
    return Array.from(this.#node.querySelectorAll("video"))
                .map(node => {
                  node.addEventListener("ended", this.#onEnded)
                  node.addEventListener("error", this.#onEnded)
                  node.autoplay = false
                  node.loop = false
                  node.muted = true
                  node.currentTime = 0
                  return node
                })
  }

  #shuffle = () => this.#videos = this.#videos.sort(() => .5 - Math.random())

  #flash = () => {
    requestAnimationFrame(() => {
      this.#videos.forEach(node => {
        node.classList.remove("lightnings__item--active")
        node.currentTime = 0
      })
      
      const firstNode = this.#videos[0]
      if (!firstNode) return
      firstNode.classList.add("lightnings__item--active")
      firstNode.play()
    })

    this.dispatchEvent(new Event("flash"))
  }

  #timeout = () => new Promise(resolve => setTimeout(resolve, this.#timeoutDuration))

  #onEnded = async () => {
    this.#shuffle()
    await this.#timeout()
    this.#flash()
  }
}