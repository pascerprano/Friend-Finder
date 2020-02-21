import { combineReducers } from "redux"

function setName(state = [], action){
  switch(action.type){
    case "ADD_NAME":
      return[{
        name:action.name
      }]
    default:
      return state
  }
}

function loginApp(state = [], action) {
  switch (action.type) {
    case "LOGIN_AUTH":
      return [
        ...state,
        {
          email: action.loginDetails.email,
          password: action.loginDetails.password
        }
      ]
      case "SIGNUP_AUTH":
      return [
        { 
          name: action.signUpDetails.name,
          userName: action.signUpDetails.userName,
          email: action.signUpDetails.email,
          password: action.signUpDetails.password,
          birthday: action.signUpDetails.birthday,
          gender: action.signUpDetails.gender
        }
      ]
    default:
      return state
  }
}

function setFriends(state = [], action){
  switch(action.type){
    case "ADD_ALL_USER":
        return [
          { details:action.userDetails }
        ]
    default:
      return state
  }
}

function setFriendsRequsts(state = [], action){
  switch(action.type){
    case "ADD_FRIEND_REQUESTS":
        return [
          { details:action.friendRequests }
        ]
    default:
      return state
  }
}

function setFriendsForUser(state = [], action){
  switch(action.type){
    case "ADD_FRIENDS":
        return [
          { details:action.friends }
        ]
    default:
      return state
  }
}

function setThread(state = [], action){
  switch(action.type){
    case "ADD_THREAD":
        return [
          { thread: action.details }
        ]
    default:
      return state
  }
}

const reducer = combineReducers({
  loginApp,
  setName,
  setFriends,
  setFriendsRequsts,
  setFriendsForUser,
  setThread
})

export default reducer