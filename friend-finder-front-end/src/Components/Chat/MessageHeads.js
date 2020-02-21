import React from 'react'
import openSocket from 'socket.io-client';
import store from '../../Controllers/Store/store'
import * as actions from '../../Controllers/Actions/Actions'
import Chat from './Chat';

function MessageHead(props) {
    function setName(){
        props.onclick()
        props.setname(props.name,props.id)
        props.callToChat(sessionStorage.getItem('key'),props.id,"",false)
    }
    
    return (
        <div className="message-head" onClick={setName}>
            <img className="message-head-image" src={props.img} alt="chat profile"/>
            <div>
                <p className="message-head-name">{props.name}</p>
            </div>
        </div>
    )
}

export default MessageHead