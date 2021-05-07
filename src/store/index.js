import Vue from 'vue'
import Vuex from 'vuex'
import gasApi from '../api/gasApi'

Vue.use(Vuex)

/**
 * State
 * Vuexの状態
 */
const state = {
  /** カレンダーデータ */
  calData: {},

  /** ローディング状態 */
  loading: {
    fetch: false,
  },

  /** エラーメッセージ */
  errorMessage: '',

  /** 設定 */
  settings: {
    appName: "BUCCAL",
    apiUrl: "",
    authToken: "",
    calendarId: "",
  }
}

/**
 * Mutations
 * ActionsからStateを更新するときに呼ばれます
 */
const mutations = {
  /** 指定範囲のカレンダーデータをセットします */
  setCalData(state, {
    startDate,
    endDate,
    list
  }) {
    const listKey = startDate + endDate
    state.calData[listKey] = list
  },

  /** ローディング状態をセットします */
  setLoading (state, { type, v }) {
    state.loading[type] = v
  },

  /** エラーメッセージをセットします */
  setErrorMessage (state, { message }) {
    state.errorMessage = message
  },

  /** 設定を保存します */
  saveSettings (state, { settings }) {
    state.settings = { ...settings }
    const { appName, apiUrl, authToken, calendarId } = state.settings
    document.title = appName
    gasApi.setUrl(apiUrl)
    gasApi.setAuthToken(authToken)
    gasApi.setCalendarId(calendarId)

    // カレンダーデータを初期化
    state.calData = {}

    localStorage.setItem('settings', JSON.stringify(settings))
  },

  /** 設定を読み込みます */
  loadSettings (state) {
    const settings = JSON.parse(localStorage.getItem('settings'))
    if (settings) {
      state.settings = Object.assign(state.settings, settings)
    }
    const { appName, apiUrl, authToken, calendarId } = state.settings
    document.title = appName
    gasApi.setUrl(apiUrl)
    gasApi.setAuthToken(authToken)
    gasApi.setCalendarId(calendarId)
  }

}

/**
 * Actions
 * 画面から呼ばれ、Mutationをコミットします
 */
const actions = {
  /** 指定年月のカレンダーデータを取得します */
  async fetchCalData({
    commit
  }, {
    startDate,
    endDate
  }) {
    const type = 'fetch'
    commit('setLoading', {
      type,
      v: true
    })
    try {
      const res = await gasApi.fetch(startDate, endDate)
      commit('setCalData', {
        startDate,
        endDate,
        list: res.data
      })
    } catch (e) {
      commit('setErrorMessage', {
        message: e
      })
      commit('setCalData', {
        startDate,
        endDate,
        list: []
      })
    } finally {
      commit('setLoading', {
        type,
        v: false
      })
    }
  },

  /** 設定を保存します */
  saveSettings ({ commit }, { settings }) {
    commit('saveSettings', { settings })
  },

  /** 設定を読み込みます */
  loadSettings ({ commit }) {
    commit('loadSettings')
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
})
