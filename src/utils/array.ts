export {}

declare global {
  interface Array<T = any> {
    move(from: number, to: number): Array<T>
    pushOrReplace(key: keyof T, obj: T): void
    isEmpty: () => boolean
    isSame: <T>(arr: T[]) => boolean
  }
}

Array.prototype.move = function(from: number, to: number) {
  this.splice(to, 0, this.splice(from, 1)[0])
  return this
}

Array.prototype.pushOrReplace = function(key, obj) {
  const index = this.findIndex(item => item[key] === obj[key]);
  index === -1 ? this.push(obj) : this[index] = obj;
}

Array.prototype.isEmpty = function() {
  return !(Array.isArray(this) && this.length > 0);
}

Array.prototype.isSame = function(arr) {
  return Array(this) && Array(arr) && this.length === arr.length && this.every((value, index) => value === arr[index]);
}