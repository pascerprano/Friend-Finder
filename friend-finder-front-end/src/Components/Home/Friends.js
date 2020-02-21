import React from 'react'
import Button from '../Button'
import img from './profile3.jpeg'

function Friends(props){
    return(
        <div className="friends">
            <img className="friends-image" src={props.img} alt={props.img}/>
            <div className="friends-inside">
                <div>
                    <p className="friends-bold-name">{props.name}</p>
                    <div style={{display:"flex"}}>
                        <p className="friends-list-small"><span>{props.mutual}</span> {props.mutual>1?"mutual friends":"mutual friend"}</p>
                        <p style={{marginLeft:"10px"}} className="friends-list-small"><span>{props.friends}</span>{props.friends>1?" friends":" friend"}</p>
                    </div>
                </div>
                <Button class="friends-btn" name="Friends"/> 
            </div>
        </div> 
    )
}

export default Friends