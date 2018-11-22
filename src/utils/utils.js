export const isWechat = () => {
  let ua = window.navigator.userAgent.toLowerCase()
  /* eslint-disable eqeqeq */
  return ua.match(/MicroMessenger/i) == 'micromessenger'
}

export const getQueryString = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
