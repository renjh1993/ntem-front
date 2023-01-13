/**
 * 校验身份证号
 */
const idCardPattern = /\d{17}[\d|x]|\d{15}/
const validateIdCard = (rule, value, callback) => {
  if (!idCardPattern.test(value)) {
    callback(new Error('身份证号为空或不合法'))
  } else {
    callback()
  }
}
/**
 * 校验手机号
 */
const phonePattern = /0?(13|14|15|18|17)[0-9]{9}/
const validatePhone = (rule, value, callback) => {
  if (!phonePattern.test(value)) {
    callback(new Error('手机号为空不合法'))
  } else {
    callback()
  }
}
/**
 * 校验毕业证编号
 */
const graduateNumberPattern = /^[A-Za-z0-9]+$/
const validategraduateNumber = (rule, value, callback) => {
  if (!value) {
    callback(new Error('毕业证编号不能为空'))
  } else if (!graduateNumberPattern.test(value)) {
    callback(new Error('毕业证编号只能包含数字和字母'))
  } else {
    callback()
  }
}
/**
 * 校验email
 */
const emailPattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
const validateEmail = (rule, value, callback) => {
  if (!emailPattern.test(value)) {
    callback(new Error('email为空或不合法'))
  } else {
    callback()
  }
}
export {
  validateIdCard,
  validatePhone,
  validategraduateNumber,
  validateEmail
}
