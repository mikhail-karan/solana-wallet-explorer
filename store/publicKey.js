//import {Storage} from '@nuxtjs/auth-next'

export const state = () => ({  
  //pubKey: sessionStorage.getItem('pubKey') || null, 
  pubKey: null
})

export const mutations = {
  setKey(state, _pubKey) {
    //debugger
    //sessionStorage.setItem('pubKey', _pubKey);
    //Auth.$storage.setUniversal('pubKey', _pubKey)
    //Storage.setUniversal('pubKey', _pubKey)
    state.pubKey = _pubKey
  }
}


export const getters = {
  getPubKey: state => {
    //debugger
    
    //let self = this;
    //let _pubKey = sessionStorage.getItem('pubKey');
    //let _pubKey = Auth.$storage.getUniversal('pubKey');
    //let _pubKey = Storage.getUniversal('pubKey');
    /*
    if ( _pubKey ) {
      state.pubKey = _pubKey
    }
    return state.pubKey       
    */
  }
}

