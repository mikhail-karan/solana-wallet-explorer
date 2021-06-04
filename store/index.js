export const state = () => ({
  pubKey: null
})

export const mutations = {
  setKey(state, _pubKey) {
    state.pubKey = _pubKey
  }
}

export const actions = {
  setKeyAction({commit}, key){
    localStorage.setItem('pubKey', key)
    commit('setKey', key)
  }
}


export const getters = {

  getPubKey: state => {
   return state.pubKey
  }
}