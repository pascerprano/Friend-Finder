import React from 'react'
import Button from '../Button'
import img from './profile3.jpeg'

function FriendRecomendation(props){
    function handleClick(event){
        event.target.innerHTML = "Friend request sent"
        event.target.disabled = true
        props.method(event.target.name)
    }
    function displayButton(){
        if(props.status === "waiting"){
            return <button name={props.id} className="friends-button" disabled>Friend request sent</button>
        }
        else{
            return <button name={props.id} onClick={handleClick} className="friends-button">Add friend</button>
        }
    }
    return(
        <div className="people-you-may-know-friends-div">
            <img className="friend-profile-image" src={props.img} alt="propfile of friend"/>
            <div>
                <p className="friend-name">{props.name}</p>
                <p className="mutual-friends"><span>{props.mutual}</span> mutual friends</p>
                {displayButton()}<Button class="friends-button-2" name="Remove"/>
            </div>
        </div>
    )
}

export default FriendRecomendation