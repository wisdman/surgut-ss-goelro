
import { Lightnings } from "./lightnings.mjs"
import { Brands } from "./brands.mjs"

void async function main() {
  const lightnings = new Lightnings(".lightnings")
  const brands = new Brands(".brands")
  lightnings.addEventListener("flash", brands.randomFlash)
  brands.addEventListener("route", ({detail}) => {
    const routeClasses = Array.from(document.body.classList)
                              .filter(key => /^route--/.test(key))
    requestAnimationFrame(() => {
      document.body.classList.remove(...routeClasses)
      document.body.classList.add(`route--${detail}`)
    }) 
  })


  document.querySelectorAll(".part-5__main-article-list li").forEach(node => {
    node.addEventListener("click", () => {
      document.querySelector(".part-5__main").classList.add("move-me")
    })
  })


}()