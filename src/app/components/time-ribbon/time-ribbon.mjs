
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

  #wrapper = this.$(".wrapper", { host: false });

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

      const template = document.createElement("template")

      const li = document.createElement("li")
      li.classList.add("ribbon__section-item")
      li.classList.add(`ribbon__section-item--${brand}`)
      width && li.style.setProperty("--width", `${width}px`)

      const itemText = document.createElement("div")
      itemText.classList.add("ribbon__section-item-text")

      const titleTxt = day ? `${day} M[month][1]` : month ? M[month][0] : undefined
      if (titleTxt) {
        const title = document.createElement("h2")
        title.classList.add("ribbon__section-item-title")
        itemText.appendChild(title)
      }

      const p = document.createElement("p")
      p.innerText = body
      itemText.appendChild(p)

      li.appendChild(itemText)

      const itemImages = document.createElement("div")
      itemImages.classList.add("ribbon__section-item-images")

      for (const src of (images ?? [])) {
        const img = new Image(`${base}${src}`)
        itemImages.appendChild(img)
      }

      li.appendChild(itemImages)

      template.appendChild(li)

      acc[year] = [...(acc[year] ?? []), { order, template }]
      return acc
    }, {})

    console.log(sections)
  }

  onScroll = () => {
    requestAnimationFrame(() => this.style.setProperty("--scroll-left", this.scrollLeft))
  }
}
