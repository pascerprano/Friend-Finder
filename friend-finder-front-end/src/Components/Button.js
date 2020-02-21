import React from 'react'

function Button(props){
    return(
        <button className={props.class} onClick={props.method}>{props.name}</button>
    )
}

export default Button