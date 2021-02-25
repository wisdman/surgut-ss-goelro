
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML, URL } from "../utils.mjs"

const STYLE = await CSS(import.meta.url)
const TEMPLATE = await HTML(import.meta.url)

const M = {
  1:  ["Январь"   , "Января"  ],
  2:  ["Февраль"  , "Февраля" ],
  3:  ["Март"     , "Марта"   ],
  4:  ["Апрель"   , "Апреля"  ],
  5:  ["Май"      , "Мая"     ],
  6:  ["Июнь"     , "Июня"    ],
  7:  ["Июль"     , "Июля"    ],
  8:  ["Август"   , "Августа" ],
  9:  ["Сентябрь" , "Сентября"],
  10: ["Окрябрь"  , "Октября" ],
  11: ["Ноябрь"   , "Ноября"  ],
  12: ["Декабрь"  , "Декабря" ],
}

const DATE_RX = /^(?:(?:(?<day>\d{1,2})\.)?(?<month>\d{1,2})\.)?(?<year>\d{4})$/

const ParseDate = dateStr => 
  Object.entries(DATE_RX.exec(dateStr)?.groups ?? {})
        .reduce((acc,[key, value]) => ({...acc, [key]: Number.parseInt(value) || null}), {})

export class TimeRibbonComponent extends AbstractComponent {
  static TAG_NAME = "ss-time-ribbon"
  
  static STYLES = STYLE
  static TEMPLATE = TEMPLATE

  #wrapper = this.$(".wrapper", { host: false })

  connectedCallback() {
    super.connectedCallback()
    const dataUrl = URL(window.location.origin, this.dataset.json)
    this.#updateContent(dataUrl)
  }

  #updateContent = async ({base, filename}) => {
    const data = await (await fetch(`${base}${filename}`)).json()

    const sections = data.reduce((acc, {body, brand, date, images, width}) => {
      const { day, month, year } = ParseDate(date)
      const order = (month || 0) * 100 + (day || 0)
      const title = day ? `${day} ${M[month][1]}` : month ? M[month][0] : undefined

      acc[year] = (acc[year] || "") + `
        <li class="ribbon__section-item ribbon__section-item--${brand || "default"}"
            style="--width: ${width}px; --order: ${order || 9999}">
          <div class="ribbon__section-item-text">
            ${title ? `<h2 class="ribbon__section-item-title">${title}</h2>` : ""}
            <p>${body}</p>
          </div>
          <div class="ribbon__section-item-images">
            ${ (images ?? []).map(src => `<img src="${base}${src}">`).join("") }
          </div>
        </li>
      `
      return acc
    }, {})

    const html = Object.entries(sections).map(([year, html]) => {
      return `
        <section class="ribbon__section" style="order: ${year || 6666}">
          <h1 class="ribbon__section-title"><span>${String(year).substr(2,2)}</span>${year}</h1>
          <ul class="ribbon__section-list">${html}</ul>
        </section>
      `
    })

    const template = document.createElement("template")
    template.innerHTML = `
      <div class="wrapper">
        ${html.join("")}
        <section class="ribbon__section" style="order: 9999">
        <h1 class="ribbon__section-title"><span>21</span>2021</h1>
        </section>
      <div>`

    this.#wrapper.innerHTML = ""
    this.#wrapper.appendChild(template.content.cloneNode(true))
  }

  onScroll = () => {
    requestAnimationFrame(() => this.style.setProperty("--scroll-left", this.scrollLeft))
  }
}
