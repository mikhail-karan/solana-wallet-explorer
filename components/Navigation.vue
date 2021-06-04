<template>
    <div>
        <b-navbar toggleable="lg" type="light" variant="light">
            <b-navbar-brand href="" @click="$router.push('/')">Solana Wallet Explorer</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
            
            <!--
            <b-navbar-nav>
                <b-nav-item href="#">Link</b-nav-item>
                <b-nav-item href="#" disabled>{{pubKey}}}</b-nav-item>
            </b-navbar-nav>
            -->
            
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">

                <b-nav-item href="#" v-if="pubKey" disabled>{{pubKey}}</b-nav-item>
                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>User</em>
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item href="#" v-if="pubKey" @click="disconnect()">Disconnect</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // pubKey: null
    }
  },

  computed: {
    pubKey() {
      //return new PublicKey(this.$store.getters['publicKey/getPubKey']) || null
      
      //if ( this.$auth.$storage.getUniversal('pubKey') ) {
      // if ( this.$auth.$storage.watch('pubKey') ) {        
      //   return new PublicKey(this.$auth.$storage.getState('pubKey')) 
      // } else {
      //   return null
      // }
      return this.$store.getters.getPubKey
    }
  },
  // computed: mapState({
      
  //   //pubKey: state => new PublicKey(state.publicKey.pubKey ? state.publicKey.pubKey : null) 
    
  //   pubKey: state => {
  //       if ( state.publicKey.pubKey ) {
  //           return new PublicKey(state.publicKey.pubKey) 
  //       } else {
  //           return null
  //       }
  //   }

  // }),

  mounted(){
    console.log('Nav mounted');
    // this.$auth.$storage.watchState('pubKey', newValue => {
    //     console.log('pubkey State Changed')
    //     this.pubKey = newValue
    //   })
  },
  methods:{

    disconnect() {
      console.log('disconnecting...');
      // this.$auth.$storage.setUniversal('pubKey', null);
      localStorage.removeItem('pubKey')
      this.$store.commit('setKey', null)
      //this.$store.commit('publicKey/setKey', null);
      this.$router.push('/');
    }

  }
  
}
</script>

<style>

</style>