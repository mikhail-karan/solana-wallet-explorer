export const state = () => ({
  pubKey: null, 
})

export const mutations = {
  setKey(state, _pubKey) {
    state.pubKey = _pubKey
  }
}

export const getters = {
  getPubKey: state => {return state.pubKey}
}