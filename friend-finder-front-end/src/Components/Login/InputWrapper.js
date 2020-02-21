import React from 'react'

function InputWrapper(props){
    return(
        <div className={props.classTotal}>
            <p>{props.text}</p>
            <input ref={props.inputRef} type={props.type} className={props.class} onInput={e=>{props.method(e.target.value)}}/>
        </div>
    );
}

export default InputWrapper