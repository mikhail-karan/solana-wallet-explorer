<template>
  <div>
    <b-navbar toggleable="lg" type="lignt" variant="light">
      <b-navbar-brand href="" @click="$router.push('/')"
        >Solana Portfolio Dashboard</b-navbar-brand
      >

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
          <!-- b-nav-item href="#" v-if="pubKey" disabled>{{pubKey}}</b-nav-item -->
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content> Account </template>
            <!-- b-dropdown-item href="#">Profile</b-dropdown-item -->
            <b-dropdown-item href="#" v-if="!pubKey" @click="connect()"
              >Connect Wallet</b-dropdown-item
            >
            <b-dropdown-item href="#" v-if="pubKey" disabled>{{
              pubKey
            }}</b-dropdown-item>
            <b-dropdown-item href="#" v-if="pubKey" @click="disconnect()"
              >Disconnect</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import {
  Connection,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
import { mapState } from "vuex";
import { connectWallet } from "../utils/connection";
export default {
  data() {
    return {
      // pubKey: null
    };
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
      return this.$store.getters.getPubKey;
    },
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

  mounted() {
    console.log("Nav mounted");
    // this.$auth.$storage.watchState('pubKey', newValue => {
    //     console.log('pubkey State Changed')
    //     this.pubKey = newValue
    //   })
  },
  methods: {
    disconnect() {
      console.log("disconnecting...");
      // this.$auth.$storage.setUniversal('pubKey', null);
      localStorage.removeItem("pubKey");
      this.$store.commit("setKey", null);
      //this.$store.commit('publicKey/setKey', null);
      this.$router.push("/");
    },

    async connect() {
      //this.$root.$refs.index.connectWallet();
      let _pubKey = await connectWallet();
      if (_pubKey) {
        this.$store.dispatch("setKeyAction", _pubKey.toBase58());
        this.$router.push("dashboard");
      }
    },
  },
};
</script>

<style>
.navbar {
  background-color: black !important;
}

.nav-item.nav-item.nav-item a {
  color: white;
}

.nav-item.nav-item.nav-item a:hover {
  background-color: #555;
}

.navbar-nav .dropdown-menu {
  background-color: #444 !important;
}

.navbar-toggler > .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'><path stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/></svg>") !important;
}
</style>