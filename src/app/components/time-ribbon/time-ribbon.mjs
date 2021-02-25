
import { AbstractComponent } from "../abstract/index.mjs"
import { CSS, HTML } from "../utils.mjs"

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

  onScroll = () => {
    requestAnimationFrame(() => this.style.setProperty("--scroll-left", this.scrollLeft))
  }
}
