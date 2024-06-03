/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time:number, label:string) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num:number, digits:number) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string:any) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 类型解释
 * @param value
 * @param options
 * @param v
 * @param l
 * @returns {string|*}
 */
export function paraphrase({ value = '' as any, options = [] as any, v = 'value', l = 'label' }) {
  const newData = options.filter((x:any) => {
    return x[v] === value
  })
  if (newData.length > 0) {
    return newData[0][l]
  }
  return ''
}

/**
 * 过滤小数多余 0
 * @param {*} value
 * @param {*} decimalLength
 * @returns
 */
export function cutZero(value = 0, decimalLength = 8) {
  const val = typeof (value) === 'number' ? value : parseFloat(value)
  const valArray = val.toFixed(decimalLength).split('.')
  const decimalArray:any = valArray[1].split('').reverse()
  const result = []
  for (let i = 0; i < decimalArray.length; i++) {
    if ((decimalArray[i] > 0 && result.length === 0) || result.length > 0) {
      result.push(decimalArray[i])
    }
  }

  return result.length > 0 ? `${valArray[0]}.${result.reverse().join('')}` : valArray[0]
}

/**
 * 马赛克 手机号
 * @param {*} tel
 * @returns
 */
export function mosaicPass(value:any) {
  if (!value) return value
  const reg = /\S/g
  const mosaicVal = value.replace(reg, '*')
  if (value.length > 6) {
    return mosaicVal.substring(0, 6)
  } else {
    return mosaicVal.padStart(6, '*')
  }
}

/**
 * 30:30:30 转 秒
 * @param timeString 
 * @returns 
 */
export function timeToSeconds(timeString:string) {
  const [hours, minutes, seconds] = timeString.split(':').map((v) => Number(v || 0));
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * 秒 转 30:30:30
 * @param seconds 
 * @returns 
 */
export function convertSecondsToHMS(seconds:number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hour: hours,
    minute: minutes,
    second: remainingSeconds
  };
}