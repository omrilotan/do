/**
 * @template T
 * @param {T[]} items
 * @returns {T} A random item
 */
export default (items) => items[Math.floor(Math.random() * items.length)];
