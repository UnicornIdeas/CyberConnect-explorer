 
 import { BASIC_INFO, IDENTITY_QUERY } from './graphql/queries.js'
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

async function basicInfo(address){
    const query = BASIC_INFO
    const variables ={
        address: address
    }
    let result = await axiosRequest(query, variables)
    return result
}

export function isValid(address){
    let result = web3.utils.isAddress(address)
    return result
}

export async function getBalance(address){
    let params = {
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest',
        apiKey: 'A1CIYWKZKTD4NTNH2MPRHE7Q9HNEYSKSP8'
    }
    const res = await axios.get("https://api.etherscan.io/api", {params: params})
    console.log("resss: ", res)
    
}


export async function getETHTransactions(address){
    let params = {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        apiKey: 'A1CIYWKZKTD4NTNH2MPRHE7Q9HNEYSKSP8'
    }
    const res = await axios.get("https://api.etherscan.io/api", {params: params})
    console.log("resss: ", res)
    return res.data.result
}

export async function getERC20Tokens(address){
    let params = {
        module: 'account',
        action: 'tokentx',
        address: address,
        apiKey: 'A1CIYWKZKTD4NTNH2MPRHE7Q9HNEYSKSP8'
    }
    const res = await axios.get("https://api.etherscan.io/api", {params: params})
    console.log("resss: ", res)
    return res.data.result
}

export async function getNFTTokens(address){
    let params = {
        module: 'account',
        action: 'tokennfttx',
        address: address,
        apiKey: 'A1CIYWKZKTD4NTNH2MPRHE7Q9HNEYSKSP8'
    }
    const res = await axios.get("https://api.etherscan.io/api", {params: params})
    console.log("resss: ", res)
    return res.data.result
}

function runTask(spec){
    return identityQuery(spec.address, spec.itemsPerPage, spec.page)
}

function createElement(address, field, element=null){
    let newElem = {}
   
    switch(field){
        case 'isFollowing': 
        if (element != null){
            newElem = {
                address: address,
                alias: element.alias,
                avatar: element.avatar,
                domain: element.domain,
                namespace: element.namespace,
                lastModifiedTime: element.lastModifiedTime
                }
            }
            newElem.isFollowing = true
            newElem.isFollower = false
            newElem.hasERC20Token = false
            newElem.hasETHTransaction = false
            newElem.hasNFTTransaction = false
            break;
        case 'hasETHTransaction':
            newElem.address = address
            newElem.isFollowing = false
            newElem.isFollower = false
            newElem.hasERC20Token = false
            newElem.hasETHTransaction = true
            newElem.hasNFTTransaction = false
            break;
        case 'hasERC20Token':
            newElem.address = address
            newElem.isFollowing = false
            newElem.isFollower = false
            newElem.hasERC20Token = true
            newElem.hasETHTransaction = false
            newElem.hasNFTTransaction = false
            newElem.Token = element
            break;
        case 'hasNFTTransaction':
            newElem.address = address
            newElem.isFollowing = false
            newElem.isFollower = false
            newElem.hasERC20Token = false
            newElem.hasETHTransaction = false
            newElem.hasNFTTransaction = true
            newElem.Token = element
            break;
            
        
    }
   return newElem
}


export async function createUniqueList(address){
    let result = await basicInfo(address)
    let followerCount = result.identity.followerCount
    console.log(followerCount)
    let followingsCount = result.identity.followingCount
    console.log(followingsCount)

    let followersList = []
    let followingsList = []
    let totalPages = 0
    let parseFollowers = false
    /*
    let totalPagesFollowers = Math.round(followerCount/50)
    let totalPagesFollowings = Math.round(followingsCount/50)

    if (totalPagesFollowers > totalPagesFollowings){
        totalPages = totalPagesFollowers
        parseFollowers = true
    } else {
        totalPages = totalPagesFollowings
    }
    */
    totalPages = Math.round(followerCount/50)
    let currentPage = 1
    let step =0
    console.log("total pages: ", totalPages)
    while (currentPage < totalPages ){
        if (totalPages - currentPage >= 20){
            step = 20
        }
        else {
            step = totalPages - currentPage + 1
        }
        
        let asyncThingsTodo =[]
        for (let i=currentPage; i< currentPage + step; i++){
            asyncThingsTodo.push({address: address, itemsPerPage: 50, page:i})
        }
        console.log(asyncThingsTodo)
        let tasks = asyncThingsTodo.map(runTask)
        let res = await Promise.all(tasks )
        res.forEach(x => {
            console.log(x)
            if (parseFollowers){
                let newList = x.identity.followers.list.map(obj => ({...obj, isFollower: true, isFollowing: false, hasETHTransaction: false, hasNFTTransaction: false, hasERC20Token: false}))
                followersList = followersList.concat(newList)
                followingsList = followingsList.concat(x.identity.followings.list)
            }
            else {
                let newList = x.identity.followings.list.map(obj => ({...obj, isFollowing: true}))
                followingsList = followingsList.concat(newList)
                followersList = followersList.concat(x.identity.followers.list)
            
            }
            
            
            console.log("followerslength: ",followersList.length)
            console.log("followingsLength: ", followingsList.length)
            
        })
        currentPage = currentPage + step
    }
    //console.log("acilea: ",followersList)
    followersList = await compare(followersList, followingsList,address, true, "cyberconnect")
    console.log("fisrt: ",followersList)
    
    let ethList = await getETHTransactions(address)
    //console.log(" eth transactions",ethList.length)
    followersList = await compare(followersList, ethList, address, false, "eth" )
    //console.log("agaian: ", followersList)
    
    let erc20tokenList = await getERC20Tokens(address)
    followersList = await compare(followersList, erc20tokenList, address, false, "erc20token" )
    //console.log("agaiangfyusfgyus: ", followersList)
    
    let nftTokens = await getNFTTokens(address)
    followersList = await compare(followersList, nftTokens, address, false, "nft")
    
    console.log("FINAL: ", followersList)
    console.log("follower count", followerCount)
    console.log("eth list: ", ethList.length)
    console.log("erc20list: ", erc20tokenList.length)
    console.log("nft tokens: ", nftTokens.length)


    //return followersList
    
}

function searchAddress(spec){
    let platform = spec.action
    let array = spec.array
    if (platform == "cyberconnect"){
        let address = spec.address
        let elem = spec.followingElem
        let found = array.find(element => element.address === address)
        //console.log("search: ",address, found, array[0].address)
        if (found){
            
            let foundElement = (element) => element.address == address
            let indexElement = array.findIndex(foundElement)
            console.log("search: ",address, found, array[indexElement].address, indexElement)
            return [indexElement, address, null]
        }
        else 
            return [-1, address, elem]
    } else if (platform=="eth" || platform=="nft"){
        let from_address = spec.from
        let to_address = spec.to
        let original = spec.address
        let address = ''
        if (from_address==original){
            address = to_address
        }else {
            address = from_address
        }

        let found = array.find(element => element.address === address)
        
        let indexElement = -1 
        if (found){
            let foundElement = (element) => element.address == address
            indexElement = array.findIndex(foundElement)
            return [indexElement, address]
        } 
        return [-1, address]
    } else if (platform=="erc20token"){
        let address = spec.address
        let token = spec.token
        let found = array.find(element => element.address === address)
      
        if (found){
            let foundElement = (element) => element.address == address
            let indexElement = array.findIndex(foundElement)
            return [indexElement, address, token]
        }
        else 
            return [-1, address, token]
    }
}

async function compare(followersArray, followingsArray, searchedAddress, followers, action){
  
    let processed = 0
    let step =0
    while (processed < followingsArray.length){
        {
            if (followingsArray.length - processed >= 20)
                step = 20
            else
                step = followingsArray.length - processed
        }
        let asyncThingsTodo = []
        for (let i=processed; i<processed + step;i++){
            if (action == 'cyberconnect'){
                console.log(i, followingsArray[i].address)
                asyncThingsTodo.push({address: followingsArray[i].address, followingElem: followingsArray[i], array: followersArray, action: action})
            } else if (action == "eth" || action == "nft")  {
                asyncThingsTodo.push({from: followingsArray[i].from, to: followingsArray[i].to, original: searchedAddress, array: followersArray, action: action})
            } else if (action=="erc20token"){
                asyncThingsTodo.push({address: followingsArray[i].to, token: followingsArray[i].tokenName, array:followersArray, action:action})
            }
        }
        let tasks = asyncThingsTodo.map(searchAddress)
        let res = await Promise.all(tasks )
        res.forEach(x => {
            console.log("x: ", x)
           
                switch(action){
                    case "cyberconnect":
                        // 0- index 1-adresa 2-elementul din followings
                        if (x[0] != -1){
                            var updatedElem = followersArray[x[0]]
                            if (followers){
                                updatedElem.isFollowing = true
                            } else {
                                updatedElem.isFollower = true
                            }
                            followersArray[x[0]]= updatedElem
                            break;
                        } else {
                            let element = createElement(x[1], 'isFollowing', x[2])
                            followersArray.push(element)
                            break;
                        }

                    case "eth":
                        if (x[0] != -1){
                            console.log (x, " ETH ")
                            updatedElem = followersArray[x[0]]
                            updatedElem.hasETHTransaction = true
                            followersArray[x[0]]= updatedElem
                            break;
                        } else {
                            let element = createElement(x[1], 'hasETHTransaction')
                            followersArray.push(element)
                            break;
                        }
                    case "nft":
                        if (x[0] != -1){
                            console.log (x, " update NFT ")
                            updatedElem = followersArray[x[0]]
                            updatedElem.hasNFTTransaction = true
                            followersArray[x[0]]= updatedElem
                            break;
                        } else {
                            console.log("create nft obj")
                            let element = createElement(x[1], 'hasNFTTransaction')
                            followersArray.push(element)
                            break;
                        }
                        
              
                    case "erc20token":
                        
                        if (x[0] != -1){
                            console.log(x[0], "update erc20 ", x[1])
                            updatedElem = followersArray[x[0]]
                            updatedElem.hasERC20Token = true
                            updatedElem.token = x[2]
                            followersArray[x[0]]= updatedElem
                            break;
                        } else {
                            console.log("create erc20 obj")
                            let element = createElement(x[1], 'hasERC20Token', x[2])
                            followersArray.push(element)
                            break;
                        }
                        
                }
            
        })
        processed = processed + step
    } 
    
    return followersArray
}