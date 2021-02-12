
export class Brands extends EventTarget {
  static ANIM_CLASS = "brands__box--flash"
  static ON_CLASS = "brands__box--on"

  #node = undefined
  #brandBosex = []

  constructor(node = document.createElement("div")) {
    super()
    this.#node = typeof node === "string" ? document.querySelector(node) : node
    this.#brandBosex = Array.from(this.#node.querySelectorAll(".brands__box"))
                            .map(node => {
                              node.addEventListener("click", () => this.#onClick(node))
                              node.classList.add(Brands.ON_CLASS)
                              node.classList.remove(Brands.ANIM_CLASS)
                              return node
                            })
  }

  #flash = (id) => {
    requestAnimationFrame(() => {
      this.#brandBosex[id].classList.add(Brands.ANIM_CLASS);
      setTimeout(() => this.#brandBosex[id].classList.remove(Brands.ANIM_CLASS), 1000);
    })
  }

  randomFlash = () => {
    const id = Math.floor(Math.random() * this.#brandBosex.length)
    this.#flash(id)
  }

  #onClick = (node) => {
    requestAnimationFrame(() => {
      this.#brandBosex.filter(item => item !== node).forEach(item => item.classList.remove(Brands.ON_CLASS))
    })
    this.dispatchEvent(new CustomEvent("route", { detail: node.dataset.route }))
  }
}