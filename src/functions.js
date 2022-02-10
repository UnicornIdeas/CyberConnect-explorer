import { BASIC_INFO, IDENTITY_QUERY, POAP_RECCOMENDATIONS } from './graphql/queries.js'
 import {  MUTUAL_FOLLOW_QUERY, RECOMMENDATION_QUERY } from './graphql/queries.js'

 import axios from 'axios'
//import { values } from 'core-js/core/array';
 //const web3 = require('web3')

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

/*
export function isValid(address){
    let result = web3.utils.isAddress(address)
    return result
}
*/

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

export async function getPoapTokens(address){
    let api = "http://api.poap.xyz/actions/scan/" + address
    const res = await axios.get(api)
    console.log(res)
    res.data.forEach(element => getPoapRecommendation(element.event.id))
    //getPoapRecommendation("21917")
}

async function getPoapRecommendation(eventID){
    //var recList = []
    const query = POAP_RECCOMENDATIONS
    const variables ={
        id: eventID
    }
    try{
        var result = await axios({
            method: "POST",
            url:  "https://api.thegraph.com/subgraphs/name/poap-xyz/poap",
            data: {
                query: query,
                variables: variables
            },
        });
        console.log("resultt: ", result.data.data.event)
        /*
        if (result.data.data.event != null){
            recList = recList.append(result.data.data.event.tokens)
        }
        */
    } catch(error){
        console.log(error)
        return {}
    }
}

function createElement(address, field, element=null){
    let newElem = {}
    newElem.isFollowing = false
    newElem.isFollower = false
    newElem.isRecommended = false
    newElem.hasERC20Token = false
    newElem.hasETHTransaction = false
    newElem.hasNFTTransaction = false
    switch(field){
        
        case 'isFollowing': 
        if (element != null){
            newElem.address = element.address
            newElem.alias = element.alias
            newElem.avatar = element.avatar
            newElem.domain = element.domain
            newElem.namespace = element.namespace
            newElem.lastModifiedTime = element.lastModifiedTime
        }
            newElem.isFollowing = true
            break;
        case 'isRecommended':
            newElem.address = element.address
            newElem.avatar = element.avatar
            newElem.domain = element.domain
            newElem.isRecommended = true
            newElem.followerCount = element.followerCount
            newElem.recommendationReason = element.recommendationReason
            newElem.recommendationFilter = element.recommendationFilter
            break;
        case 'hasETHTransaction':
            newElem.address = address
            newElem.hasETHTransaction = true
            break;
        case 'hasERC20Token':
            newElem.address = address
            newElem.hasERC20Token = true
            newElem.Token = element
            break;
        case 'hasNFTTransaction':
            newElem.address = address
            newElem.hasNFTTransaction = true
            break;
            
        
    }
   return newElem
}


export async function getRecommendationList(address, filter){
    let itemsPerPage = 50
    let after = 1
    //let data = ""
    let reccList = []
    let results = await recommendationQuery(address, filter, itemsPerPage, after)
    console.log("results: ",results)
    let hasNext = true

    while (hasNext){
        let results = await recommendationQuery(address, filter, itemsPerPage, after)
        let data = results.recommendations.data
        if (data != null){
            reccList = reccList.concat(data.list)
            hasNext = data.pageInfo.hasNextPage
            after = after + 1
        }
        else hasNext = false
    }
    console.log("reccomendations list: ", filter, "  ", reccList)
    return reccList

}


export async function getAllRecommendations(address){
    let final_list = []
    let social = await getRecommendationList(address, "SOCIAL")
    social = social.map(obj => ({ ...obj, recommendationFilter: "SOCIAL"}))
    let game = await getRecommendationList(address, "GAME")
    game = game.map(obj => ({ ...obj, recommendationFilter: "GAME"}))
    let defi = await getRecommendationList(address, "DEFI")
    defi = defi.map(obj => ({ ...obj, recommendationFilter: "DEFI"}))
    let nft = await getRecommendationList(address, "NFT")
    nft = nft.map(obj => ({ ...obj, recommendationFilter: "NFT"}))
    final_list = final_list.concat(social)
    console.log("after social: ", final_list)
    final_list = final_list.concat(game)
    console.log("after game: ", final_list)
    final_list = final_list.concat(defi)
    final_list = final_list.concat(nft)

    return final_list
}

export async function createUniqueList(address){
    let result = await basicInfo(address)
    let followerCount = result.identity.followerCount
    console.log(result.identity.domain)
    console.log("followers: ",followerCount)
    let followingsCount = result.identity.followingCount
    console.log("followings: ",followingsCount)

    let followersList = []
    let followingsList = []
    let totalPages = 0
    let parseFollowers = true
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
    totalPages = Math.ceil(followerCount/50)
    let currentPage = 1
    let step =0
    console.log("total pages: ", totalPages)
    if (totalPages == 1)
        currentPage = 0
    while (currentPage < totalPages ){
        if (totalPages - currentPage >= 20){
            step = 20
        }
        else {
            step = totalPages - currentPage + 1
        }
        
        let asyncThingsTodo =[]
        console.log("from page: ", currentPage, " to: ", currentPage+step)
        for (let i=currentPage; i< currentPage + step; i++){
            asyncThingsTodo.push({address: address, itemsPerPage: 50, page:i})
        }
        console.log(asyncThingsTodo)
        let tasks = asyncThingsTodo.map(runTask)
        let res = await Promise.all(tasks )
        res.forEach(x => {
            //console.log("x: ",x)
            if (parseFollowers){
                let newList = x.identity.followers.list.map(obj => ({...obj, isFollower: true, isFollowing: false, hasETHTransaction: false, hasNFTTransaction: false, hasERC20Token: false, isRecommended: false}))
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
        console.log("Am ramas la: ", currentPage)
    }
    
    console.log("before comparations : ",followersList.length)
    followersList = await compare(followersList, followingsList,address, true, "cyberconnect")
    console.log("added followings: ",followersList)
    
    
    let recommendationsList = await getAllRecommendations(address)
    console.log("recommendation list length: ", recommendationsList.length)
    followersList = await compare(followersList, recommendationsList, address, false, "recommendations")
    console.log("after recommendations: ", followersList)
    
    followersList = followersList.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.address === value.address
        ))
    )
    console.log("remove dup: ", followersList)

    let ethList = await getETHTransactions(address)
    //console.log(" eth transactions",ethList.length)
    followersList = await compare(followersList, ethList, address, false, "eth" )
    console.log("after eth: ", followersList)

    followersList = removeDuplicates(followersList)
    console.log("remove dup after eth: ", followersList)

    
    let erc20tokenList = await getERC20Tokens(address)
    followersList = await compare(followersList, erc20tokenList, address, false, "erc20token" )
    console.log("afterERC20: ", followersList)

    followersList = removeDuplicates(followersList)
    console.log("remove dup after erc20: ", followersList)
    
    let nftTokens = await getNFTTokens(address)
    followersList = await compare(followersList, nftTokens, address, false, "nft")
    console.log("after nft: ", followersList)
    
    followersList = removeDuplicates(followersList)
    console.log("remove dup after nft: ", followersList)

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
    if (platform == "cyberconnect" || platform == "recommendations"){
        let address = spec.address
        let elem = spec.followingElem
        let found = array.find(element => element.address === address)
        //console.log("search: ",address, found, array[0].address)
        if (found){
            
            let foundElement = (element) => element.address == address
            let indexElement = array.findIndex(foundElement)
            console.log("found: ",address, found, array[indexElement].address, indexElement)
            return [indexElement, address, elem]
        }
        else 
            return [-1, address, elem]
    } else if (platform=="eth" || platform=="nft"){
        let from_address = spec.from
        let to_address = spec.to
        let original = spec.original
        console.log("f: ", from_address, "t: ", to_address, "original: ", original)
        //let address = ''
        let for_address = ''
        if (from_address==original){
            //let address = to_address
            for_address = to_address
        }else {
            //let address = from_address
            for_address = from_address
        }
        //console.log("original ", original, address)
        let found = array.find(element => element.address === for_address)
        
        let indexElement = -1 
        if (found){
            let foundElement = (element) => element.address == for_address
            indexElement = array.findIndex(foundElement)
            console.log("found: ", found, "indexElement: ", indexElement, "to update: ", for_address)
            return [indexElement, for_address]
        } 
        console.log("create eth for: ", for_address)
        return [-1, for_address]
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

function removeDuplicates(arrayList){
    arrayList = arrayList.filter((value, index, self) =>
    index === self.findIndex((t) => (
        t.address === value.address
        ))
    )
    return arrayList
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
            if (action == 'cyberconnect' || action=="recommendations"){
                console.log(i, followingsArray[i].address)
                asyncThingsTodo.push({address: followingsArray[i].address, followingElem: followingsArray[i], array: followersArray, action: action})
            } else if (action == "eth" || action == "nft")  {
                console.log("from: ",followingsArray[i].from, " to: ",followingsArray[i].to, "original: ", searchedAddress)
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
                                console.log("update following: ", x[0])
                                updatedElem.isFollower = true
                            }
                            followersArray[x[0]]= updatedElem
                            break;
                        } else {
                            console.log("create following")
                            let element = createElement(x[1], 'isFollowing', x[2])
                            followersArray.push(element)
                            console.log("after push", followersArray.length)
                            break;
                        }
                    case "recommendations":
                        if (x[0] != -1){
                            console.log("update for recommendation: ", x[0], "from: ", x[2])
                            let updatedElem = followersArray[x[0]]
                            updatedElem.isRecommended = true
                            updatedElem.recommendationReason = x[2].recommendationReason
                            updatedElem.followerCount = x[2].followerCount
                            updatedElem.recommendationFilter = x[2].recommendationFilter
                            followersArray[x[0]] = updatedElem
                            break
                        } else {
                            console.log("create new recommendation")
                            let element = createElement(x[1], 'isRecommended', x[2])
                            followersArray.push(element)
                            break
                        }

                    case "eth":
                        if (x[0] != -1){
                            //console.log ("update ETH: ",x[0], " ETH address: ", x[1])
                            updatedElem = followersArray[x[0]]
                            updatedElem.hasETHTransaction = true
                            followersArray[x[0]]= updatedElem
                            break;
                        } else {
                            //console.log("create ETH for address: ", x[1])
                            let element = createElement(x[1], 'hasETHTransaction')
                            followersArray.push(element)
                            break;
                        }
                    case "nft":
                        if (x[0] != -1){
                            console.log (x, " update NFT ", x[0])
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
