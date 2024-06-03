// ? Element 常用表单校验规则

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  const regexp = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
  if (value === "") callback("请输入手机号码");
  if (!regexp.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    return callback();
  }
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email:any) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 验证手机号
 * @param str
 * @returns {*|boolean}
 */
export function validPhone(str:any) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(str)
}

/**
 * 中文字母数字
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str:any) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(str)
}

/**
 * 小写字母
 * @param {string} str
 * @returns {Boolean}
 */
 export function validLowerCase(str:any) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 大写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str:any) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 大小写字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str:any) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 身份证
 * @param {string} str
 * @returns {Boolean}
 */
export function validIdCard(str:any) {
  const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
  return reg.test(str)
}
