<template>
  <div class="container">
    <div>
      <!-- Logo / -->
      <h4 class="subtitle">
        Manage your Solana assets and liabilities in one simple interface
      </h4>
      <br />
      <b-container fluid="md">
        <b-row>
          <b-col>
            <div v-if="!pubKeyInit">
              <input
                type="text"
                v-on:keyup.enter="connectWalletFromPubKey"
                v-model="manPubKey"
              />
              &nbsp;&nbsp;
              <button class="button--green" @click="connectWalletFromPubKey">
                Let's Go!
              </button>
            </div>
          </b-col>
        </b-row>
        <b-row align-h="center" v-if="pubKeyError">
          <b-col>
            <p>Incorrect public key</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="m-3"> -- OR -- </b-col>
        </b-row>
        <b-row>
          <b-col>
            <button
              v-if="!pubKeyInit"
              class="button--green"
              @click="connectWallet"
            >
              Connect Wallet
            </button>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import Wallet from "@project-serum/sol-wallet-adapter";
export default {
  data() {
    return {
      pubKeyInit: false,
      balance: "",
      pubKeyError: false,
      manPubKey: "2HQmxjk3i2y9RBDzw4CtXwMDt2YPDrNZYLdBxJ2ouD5Y",
    };
  },
  computed: {
    walletPubKey() {
      return this.$store.getters.getPubKey;
    },
  },
  mounted() {
    if (this.$store.getters.getPubKey) {
      this.$router.push("dashboard");
      return;
    }
  },
  methods: {
    async connectWalletFromPubKey() {
      console.log("pubkey: " + this.manPubKey);

      const network = clusterApiUrl("mainnet-beta");
      const connection = new Connection(network);

      let _key = null;
      try {
        _key = new PublicKey(this.manPubKey);
      } catch (error) {
        console.log(error);
        this.pubKeyError = true;
        return;
      }

      const accountInfo = await connection.getAccountInfo(_key).catch((e) => {
        console.log("key doesn`t match");
      });
      console.log("Account Info: " + accountInfo);
      this.$store.dispatch("setKeyAction", _key.toBase58());
      this.$router.push("dashboard");
    },

    async connectWallet() {
      const providerUrl = "https://www.sollet.io";
      let selectedWallet = new Wallet(providerUrl);
      let self = this;
      selectedWallet.on("connect", (publicKey) => {
        self.$store.dispatch("setKeyAction", publicKey.toBase58());
        this.$router.push("dashboard");

        //JSON RPC Test
        // const networkUrl = 'https://api.mainnet-beta.solana.com'
        // axios.post(networkUrl, {
        //   jsonrpc: '2.0',
        //   id: 1,
        //   method: 'getTokenAccountsByOwner',
        //   params: [publicKey.toBase58(),
        //     {
        //       "programId": 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        //       // "mint": "BmLbrYtcWneUY2dYjerwTVoCwVvEbvEBuNqtEz5DRveg"
        //     }
        //   ]
        // })
        // .then(res => {
        //   console.log(res)
        //   debugger
        //   let {mint, owner, amount} = this.parseTokenAccountData(res.data.result.value[0].account.data)
        //   console.log('mint : ', mint) //Array
        // })
      });
      selectedWallet.on("disconnect", () => console.log("Disconnected"));

      selectedWallet.connect();
    },
  },
};
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
  text-align: left;
}

.links {
  padding-top: 15px;
}

input {
  border: 1px solid gray;
  min-width: 450px;
  padding: 5px;
}
</style>
