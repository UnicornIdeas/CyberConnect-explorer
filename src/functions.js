 
 import { IDENTITY_QUERY } from './graphql/queries.js'
 import {  MUTUAL_FOLLOW_QUERY, RECOMMENDATION_QUERY } from './graphql/queries.js'

 import axios from 'axios'

export async function identityQuery(address, itemsPerPage, page){
    console.log(itemsPerPage, page)
    var after = (page-1)*itemsPerPage -1
    try{
      var result = await axios({
        method:"POST",
        url: "https://api.cybertino.io/connect/",
        data: {
          query: IDENTITY_QUERY,
          variables:{
            address: address,
            first: itemsPerPage,
            after: String(after)
          }
        },
       
      });
      return result.data.data
    } catch(error) {
      console.error(error)
    }
  }

  export async function recommendationQuery(address, filter, itemsPerPage, page){
    var after = (page-1)*itemsPerPage -1
    try {
      var result = await axios({
        method: "POST",
        url: "https://api.cybertino.io/connect/",
        data: {
          query: RECOMMENDATION_QUERY,
          variables:{
            address: address,
            filter: filter,
            first: itemsPerPage,
            after: String(after)
          }
        },
      });
      return result.data.data.recommendations.data.list
    }catch(error){
      console.log(error)
    }
  }

  export async function mutualFollowQuery(fromAddr, toAddr){
   
    try {
      var result = await axios({
        method: "POST",
        url: "https://api.cybertino.io/connect/",
        data: {
          query: MUTUAL_FOLLOW_QUERY,
          variables:{
            fromAddr: fromAddr,
            toAddr: toAddr
          }
        },
      });
      var isFollowed = result.data.data.followStatus.isFollowed
      var isFollowing = result.data.data.followStatus.isFollowing
      //console.log(isFollowed, isFollowing)
      if (isFollowed == true && isFollowing==true){
        return true
      }
      return false
    } catch (error){
      console.log(error)
    }
  }