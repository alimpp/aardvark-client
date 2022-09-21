import Vue from 'vue'
import moment from 'moment'
import { extendMoment } from 'moment-range'

// @ts-ignore
const momentRange = extendMoment(moment);

export const getDefaultLocale = () => {
  if (typeof window === 'undefined') return 'en'

  // @ts-ignore
  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  return locale
}

export const EventBus = new Vue()

export const checkIfTargetIsAllowedToCloseComponent = (classesArray, target) => {
  if (!target) return false
  return classesArray.some(classes =>
    classes.every(c =>
      (target.classList ?? []).contains(c)
    )
  )
}

export const hasDateBetweenMinMaxDate = (date, minDate, maxDate, range) => {
  return {
    isBefore: (range ? date.start : date).isBefore(minDate),
    isAfter: (range ? date.end : date).isAfter(maxDate)
  }
}

export const forceUpdateComputedData = (updateMsg) => updateMsg || 'updated'

export const getDateMoment = (value, format, range) => {
  if (range) {
    if (typeof value === 'string') throw new Error('[MazPicker] range mode is enable: value must be an object like this \'{ start: null, end: null }\' or \'null\'')
    return {
      start: value && value.start ? moment(value.start, format) : null,
      end: value && value.end ? moment(value.end, format) : null
    }
  } else {
    return value ? moment(value, format) : null
  }
}

export const getFormattedValue = (value, format, formatted, range) => {
  // @ts-ignore
  const formatValue = (v) => moment(v, format).format(formatted) ? moment(v, format).format(formatted).capitalize() : ''
  return range && value
    ? value.start || value.end ? `${value.start ? formatValue(value.start) : '...'} - ${value.end ? formatValue(value.end) : '...'}` : null
    : value ? formatValue(value) : null
}

const DEFAULT_FORMAT_OPTIONS = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}

export const getFormattedValuesIntl = (payload = {}) => {
  const {
    locale = 'en',
    opts = DEFAULT_FORMAT_OPTIONS,
    dates = [new Date()]
  } = payload
  // @ts-ignore
  return dates.map(d => d ? new Intl.DateTimeFormat(locale, opts).format(d).capitalize() : '...').join(' - ')
}

export const ArrayHourRange = (start, end, twoDigit, isAfternoon, disabledHours) => {
  return Array(end - start + 1).fill(0).map((_, idx) => {
    const n = start + idx
    const number = !isAfternoon ? n : n + 12
    return {
      value: number,
      item: (twoDigit && (n < 10) ? '0' : '') + n,
      disabled: disabledHours.includes(number)
    }
  })
}

export const ArrayMinuteRange = (start, end, twoDigit, step = 1, disabledMinutes) => {
  const len = Math.floor(end / step) - start

  return Array(len).fill(0).map((_, idx) => {
    const number = start + idx * step
    const txtMinute = (twoDigit && (number < 10) ? '0' : '') + number
    return {
      value: number,
      item: txtMinute,
      disabled: disabledMinutes.includes(number)
    }
  })
}

export const getTimeFormat = (format) => {
  const hasTime = format.includes('T')
  return hasTime ? format.split('T')[1] : format.split(' ').slice(1).join(' ')
}

export const scrollSmoothElement = (elem, parentHeight, hasSmoothEffect, itemHeight = 28) => {
  if (!elem) return
  const selected = elem.querySelector('.time-picker__column__item.maz-active')
  if (selected) {
    const boundsSelected = selected.getBoundingClientRect()
    const boundsElem = elem.getBoundingClientRect()
    if (boundsSelected && boundsElem) {
      const scrollValue = (itemHeight / 2) + boundsSelected.top - boundsElem.top - parentHeight / 2
      elem.scrollBy({
        top: scrollValue,
        behavior: hasSmoothEffect ? 'smooth' : 'auto'
      })
    }
  }
}

export const findNearestNumberInList = (list, number) => {
  const closest = list.reduce((prev, curr) => {
    return (Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev)
  })

  return closest
}

export const getValue = (scroll, itemHeight = 28) =>{
  const scrollTop = scroll?.target?.scrollTop ?? 0
  return Math.round(scrollTop / itemHeight)
}

export default class Month {
  constructor(month, year, locale) {
    this.start = momentRange([year, month])
    this.end = this.start.clone().endOf('month')
    this.startNextMonth = this.start.clone().add(1, 'M')
    this.endNextMonth = this.start.clone().add(1, 'M').endOf('month')
    this.startPreviousMonth = this.start.clone().subtract(1, 'M')
    this.endPreviousMonth = this.start.clone().subtract(1, 'M').endOf('month')
    this.month = month
    this.year = year
  }

  getWeekStart() {
    return this.start.weekday()
  }

  getFormatted() {
    // @ts-ignore
    return this.start.format('MMMM') ? this.start.format('MMMM').capitalize() : ''
  }

  getYear() {
    return this.start.format('YYYY')
  }

  getWeeks() {
    return this.end.week() - this.start.week() + 1
  }

  getMonthDays() {
    const r1 = momentRange.range(this.start, this.end).by('days')
    return Array.from(r1)
  }

  getPreviousMonthDays() {
    const r1 = momentRange.range(this.startPreviousMonth, this.endPreviousMonth).by('days')
    const results = Array.from(r1)
    return results.slice(results.length - this.getWeekStart(), results.length)
  }

  getNextMonthDays() {
    const totalDaysLength = this.getWeekStart() + this.getMonthDays().length
    const numberRestDays = totalDaysLength > 35 ? 42 - totalDaysLength : 35 - totalDaysLength
    const r1 = momentRange.range(this.startNextMonth, this.endNextMonth).by('days')
    const results = Array.from(r1)
    return results.slice(0, numberRestDays)
  }
}

export const getWeekDays =(locale = 'en', firstDay = null) => {
  const firstDayNumber = firstDay === 0
    ? 7
    : firstDay || momentRange.localeData(locale).firstDayOfWeek()
  let days = momentRange.weekdaysShort()
  const keep = days.splice(firstDayNumber)
  const stay = days
  days = keep.concat(stay)
  // @ts-ignore
  return days.map(d => d ? d.capitalize() : '')
}

export const getMonthsByFormat = (format) => {
  // @ts-ignore
  return Array.apply(0, Array(12)).map((_, i) => momentRange().month(i).format(format) ? momentRange().month(i).format(format).capitalize() : '')
}
