import React from 'react'

function Input(props){
    return(
        <input ref={props.inputRef} name={props.name} type={props.type} className={props.class} placeholder={props.text} onChange={props.method} onInput={props.method2}/>
    );
}

export default Input