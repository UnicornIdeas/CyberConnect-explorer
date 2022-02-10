<template>
  <div >
    Identity: {{identity}}

    <v-data-table
      :headers="headers"
      :items="followers"
      :options.sync="options"
      :server-items-length="totalFollowers"
      :loading="loading"

      ></v-data-table>
      Followers:
      <ul>
        <li v-for="(item, index) in followers" :key="item.address">
         {{index}} -- {{item.address}} --- {{item.domain}} !!! {{ mutualFollowQuery(address, item.address)}} 
        </li>
      </ul>
      Followings:
      <ul>
        <li v-for="(item, index) in followings" :key="item.address">
         {{index}} -- {{item.address}} --- {{item.domain}} 
        </li>
      </ul>
      Friends:
       <ul>
        <li v-for="(item, index) in friends" :key="item.address">
         {{index}} -- {{item.address}} --- {{item.domain}} 
        </li>
      </ul>
  </div>
</template>

<script>
import * as myModule from '../functions.js'

/*
query IdentityQuery{
  identity(address: "0x148d59faf10b52063071eddf4aaf63a395f2d41c", network: ETH) {
    domain
  }
}
*/
//import axios from 'axios'
//import { DEMO, MUTUAL_FOLLOW_QUERY } from '../graphql/queries.js'
//import { IDENTITY_QUERY } from '../graphql/queries.js'
export default {
  name: 'HelloWorld',
  data() {
    return {
      address: "0x148d59faf10b52063071eddf4aaf63a395f2d41c",
      identity: '',
      totalFollowers: 0,
      followers: [],
      followings: [],
      friends: [],
      options: {},
      loading: true,
      headers: [
        {
          text: 'Address',
          align: 'start',
          value: 'follower'
        },
        {
          text: 'Domain',
          value: 'domain'
        }
      ],
      watch: {
        options:{
          handler(){
            this.getDataFromApi()
          },
          deep: true,
        },
      }
    }
  },
  methods: {
    
  },
  async mounted() {
    /*
    try {
      var result = await axios({
        method: "POST",
        url: "https://api.cybertino.io/connect/",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:8081",
          "Access-Control-Allow-Credentials": "true",
          //"Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
          //"Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        },
        data: {
          query: DEMO
        }
      });
      this.identity = result.data.data.identity.domain
    } catch (error){
      console.error(error)
    }

    (async() => {
      this.identity = await this.identityQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c", 10,1)
    })

    console.log(this.identity)
    this.followers = this.identity.followers
    this.followers.forEach(follower => this.loadMutualConn(this.address, follower.address))
    //this.identityQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c", 10,1)
    //this.mutualFollowQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c","0xcfee57ac521e68759cea2020f7682ffc483bf4f3")
    */
   //myModule.getRecommendationList("0x148d59faf10b52063071eddf4aaf63a395f2d41c", "SOCIAL")
   //myModule.getRecommendationList("0x148d59faf10b52063071eddf4aaf63a395f2d41c", "DEFI")
   //myModule.getRecommendationList("0x148d59faf10b52063071eddf4aaf63a395f2d41c", "NFT")
   //myModule.getRecommendationList("0x148d59faf10b52063071eddf4aaf63a395f2d41c", "GAME")

    myModule.createUniqueList("0x1169b2743c45864e2182849ca881e7df1868ea8f")
    //myModule.getAllRecommendations("0xcfee57ac521e68759cea2020f7682ffc483bf4f3")
    //console.log(Math.round(268.56))

    //myModule.getPoapTokens("0x983110309620d911731ac0932219af06091b6744")
  }
  
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
