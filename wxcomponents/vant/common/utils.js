export function isDef(value) {
  return value !== undefined && value !== null;
}
export function isObj(x) {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}
export function isNumber(value) {
  return /^\d+(\.\d+)?$/.test(value);
}
export function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
export function nextTick(fn) {
  setTimeout(() => {
    fn();
  }, 1000 / 30);
}
let systemInfo = null;
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = wx.getSystemInfoSync();
  }
  return systemInfo;
}
export function addUnit(value) {
  if (!isDef(value)) {
    return undefined;
  }
  value = String(value);
  return isNumber(value) ? `${value}px` : value;
}
export function requestAnimationFrame(cb) {
  const systemInfo = getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return nextTick(cb);
  }
  return uni
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(() => {
      cb();
    });
}
