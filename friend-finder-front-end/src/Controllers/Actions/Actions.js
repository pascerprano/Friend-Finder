export function addLoginDetails(email,password){
    return {type:"LOGIN_AUTH" , loginDetails:{email,password}}
}

export function addSignUpDetails(name,userName,email,password,birthday,gender){
    return {type:"SIGNUP_AUTH", signUpDetails:{name,userName,email,password,birthday,gender}}
}

export function addUserName(name){
    return {type:"ADD_NAME", name:name}
}

export function addAllRecommendedFriends(details){
    return {type:"ADD_ALL_USER", userDetails: details}
}

export function addFriendRequests(details){
    return {type:"ADD_FRIEND_REQUESTS", friendRequests: details}
}

export function addFriends(details){
    return {type:"ADD_FRIENDS", friends: details}
}

export function addThread(details){
    return {type:"ADD_THREAD", details}
}