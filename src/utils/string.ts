import {find} from 'linkifyjs';

export { }

declare global {
  interface String {
    formatText(): string
    capitalize(): string
    removeUnderscore(): string
    capitalizeFirstLetter: () => string
    contains: (...args: string[]) => boolean
    linkify(): { type: string, value: string, href: string }[]
    removeLineBreaks: () => string
    toFixedNumber: (fixedPoint?: number) => number
    isSame: (other: string) => boolean
    isSameCaseInsensitive: (other: string) => boolean
  }
}
String.prototype.capitalize = function() {
  return this.split(' ')
    .map(item => {
      if (item.length > 0) {
        return `${item[0].toUpperCase()}${item.substr(1)}`
      }
    })
    .join(' ')
}

//Above prototype name is wrong, It should be TitleCase not capitalize, so let's name below real capitalize prototype to capitalizeFirstLetter?

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.formatText = function() {
  return this.split('-').join(' ').capitalize();
}

String.prototype.removeUnderscore= function() {
  return this.replace(/_/g, " ").capitalize()
}

String.prototype.contains = function(...args: string[]): boolean {
  const self = this.toString();
  return args?.some((arg: string) => self.includes(arg));
}

String.prototype.linkify = function() {
  return find(this.toString());
}

String.prototype.removeLineBreaks = function() {
  return this.replace(/\n|\r/g, ' ')
}

String.prototype.toFixedNumber = function(fixedPoint = 1) {
  const thisString = Number(this);
  const fixedStringNumber = thisString.toFixed(fixedPoint);
  return Number(fixedStringNumber);
}

String.prototype.isSame = function(other = '' as string): boolean {
  return this.trim() === other.trim();
}

String.prototype.isSameCaseInsensitive = function(other = '' as string): boolean {
  return this.trim().toLowerCase() === other.trim().toLowerCase();
}