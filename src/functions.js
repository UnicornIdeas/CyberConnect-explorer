 
 import { IDENTITY_QUERY } from './graphql/queries.js'
 import {  MUTUAL_FOLLOW_QUERY, RECOMMENDATION_QUERY } from './graphql/queries.js'

 import axios from 'axios'
 const web3 = require('web3')

  export function assignMutualConnections(fromAddr, followers){
    var newfollowers=[]
    followers.forEach(element => {
      mutualFollowQuery(fromAddr, element.address).then(response =>{
        element.mutual = response
        newfollowers.push(element)
      })
    });
   
    return newfollowers
  }

    async function axiosRequest(query, variables){
    try{
        var result = await axios({
            method: "POST",
            url:  "https://api.cybertino.io/connect/",
            data: {
                query: query,
                variables: variables
            },
        });
        return result.data.data
    } catch(error){
        console.log(error)
        return {}
    }
  }

  export async function identityQuery(address, itemsPerPage, page){
    const query = IDENTITY_QUERY
    const after = (page-1)*itemsPerPage -1
    
    const variables = {
        address: address,
        first: itemsPerPage,
        after: String(after)
    }
    var result = await axiosRequest(query, variables)
    if (result == {}) return result
    return result
   
  }

  export async function recommendationQuery(address, filter, itemsPerPage, page){
    const query = RECOMMENDATION_QUERY
    const after = (page-1)*itemsPerPage -1
    const variables = {
        address: address,
        filter: filter,
        first: itemsPerPage,
        after: String(after)
      }
      var result = await axiosRequest(query, variables)
      if (result == {}) return {}
      return result
  }

 async function mutualFollowQuery(fromAddr, toAddr){
    const query = MUTUAL_FOLLOW_QUERY
    const variables = {
        fromAddr: fromAddr,
        toAddr: toAddr
      }
    var result = await axiosRequest(query, variables)
    if (result == {}) return {}
    const isFollowed = result.followStatus.isFollowed
    const isFollowing = result.followStatus.isFollowing
    if (isFollowed == true && isFollowing==true){
        return true
      }
      return false
}

export function isValid(address){
    let result = web3.utils.isAddress(address)
    return result
}