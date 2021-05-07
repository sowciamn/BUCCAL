import axios from 'axios'

// 共通のヘッダーを設定したaxiosのインスタンス作成
const gasApi = axios.create({
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
})

// response共通処理
// errorが含まれていたらrejectする
gasApi.interceptors.response.use(res => {
  if (res.data.error) {
    return Promise.reject(res.data.error)
  }
  return Promise.resolve(res)
}, err => {
  return Promise.reject(err)
})

/**
 * APIのURLを設定します
 * @param {String} url
 */
const setUrl = url => {
  gasApi.defaults.baseURL = url
}

/**
 * authTokenを設定します
 * @param {String} token
 */
let authToken = ''
const setAuthToken = token => {
  authToken = token
}

/**
 * カレンダーのIDを設定します
 * @param {String} calId
 */
 let calendarId = ''
 const setCalendarId = calId => {
  calendarId = calId
}

/**
 * 指定年月のデータを取得します
 * @param {String} startDate
 * @param {String} endDate
 * @returns {Promise}
 */
const fetch = (startDate, endDate) => {
  return gasApi.post('', {
    method: 'GET',
    authToken,
    params: {
      calendarId,
      startDate,
      endDate
    }
  })
}

export default {
  setUrl,
  setAuthToken,
  setCalendarId,
  fetch
}