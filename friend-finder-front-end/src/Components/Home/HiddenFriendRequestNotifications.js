import React from 'react'
import img from './profile3.jpeg'

function HiddenFriendRequestNotifications(props){
    return (
        <div className="friend-request-notifications">
            <img className="friend-request-img" src={img} alt="profile"/>
            <div className="friend-request-name">
                <p className="friend-request-notifications-p">{props.name}</p>
                <p>- mutual friends</p>
            </div>
            <div className="friend-request-button">
                <button name={props.id} onClick={props.method} className="friend-request-notifications-btn">Confirm</button><button className="friend-request-notifications-btn">Reject</button>
            </div>
        </div>
    )
}

export default HiddenFriendRequestNotifications