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
         {{index}} -- {{item.address}} --- {{item.domain}} !!! {{item.mutual}}
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
      Recommendations reason
      <ul>
        <li v-for="(item, index) in recommendations" :key="item.address">
          {{index}} -- {{item.address}} --- {{item.recommendationReason}}
        </li>
      </ul>
  </div>
</template>

<script>

import axios from 'axios'
import { DEMO } from '../graphql/queries.js'
import * as myModule from "../functions.js"
export default {
  name: 'HelloWorld',
  data() {
    return {
      address: "0x148d59faf10b52063071eddf4aaf63a395f2d41c",
      identity: '',
      totalFollowers: 0,
      followers: [],
      followings: [],
      recommendations: [],
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
     
    }
  },
  methods: {
   
    

    async mutualConn(followers){
      followers.forEach(async(item) =>{
        await this.mutualFollowQuery(this.address, item.address)
      })
    
    },

    async loadMutualConn(from, to){
      console.log("hjsdhsj")
      var mutual = await myModule.mutualFollowQuery(from,to)
      this.followers.filter(follower => follower.address == to).forEach(follower => follower.mutual=mutual)
    
    }
   
  },
  async mounted() {
    try {
      var result = await axios({
        method: "POST",
        url: "https://api.cybertino.io/connect/",
        data: {
          query: DEMO
        }
      });
      this.identity = result.data.data.identity.domain
    } catch (error){
      console.error(error)
    }

    
     myModule.identityQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c", 10,1).then(response =>{
        console.log("Returned:",response)
        this.followers = response.identity.followers.list
        this.followings = response.identity.followings.list
        this.followers.forEach(follower => this.loadMutualConn(this.address, follower.address))
        
     }) 
    
   
    

    myModule.recommendationQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c", "SOCIAL", 10,1).then(response =>{
      this.recommendations = response
    })

    //this.identityQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c", 10,1)
    myModule.mutualFollowQuery("0x148d59faf10b52063071eddf4aaf63a395f2d41c","0xcfee57ac521e68759cea2020f7682ffc483bf4f3")
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
