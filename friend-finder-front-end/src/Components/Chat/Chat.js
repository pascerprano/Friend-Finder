import React,{useState,useEffect,useRef,useCallback} from 'react'
import { connect } from 'react-redux';
import * as actions from '../../Controllers/Actions/Actions'

function Chat(props){

    let messages =[]
    const messagesEndRef = useRef(null)
    const [inputMessage,setInputMessage] = useState("")

    useEffect(() => {
        messagesEndRef.current.scrollIntoView()
    }, [messages])

    function handleChange(event){
        event.persist()
        setInputMessage(prev=>{
            prev = event.target.value
            return prev
        })
    }

    function sendMessage(event){
        event.preventDefault()
        props.chat(sessionStorage.getItem('key'),props.details.id,inputMessage,true)
        setInputMessage(prev=>{
            prev = ""
            return prev
        })
    }

    try{
        props.messages.map(items=>{
            if(props.name === items.threadDetails['userName']){
                let group="",temp="";
                for(let i in items.messages){
                    var localDate = new Date(items.messages[i].date);
                    if(items.messages[i].date.substr(8,2)+items.messages[i].date.substr(4,4)+items.messages[i].date.substr(0,4) === new Date().getDate()+'-'+(new Date().getMonth()+1<=9?0+(new Date().getMonth()+1).toString():new Date().getMonth()+1)+'-'+new Date().getFullYear()){
                        group = "Today"
                    }   
                    else{
                        group = localDate.toString().substr(0,15)
                    }
                    // console.log(localDate)
                    if(group !== temp){
                        messages.push(
                            <span key={i}>
                                <p className="group-by-time">{group}</p>
                                <div className={parseInt(items.messages[i].send) === parseInt(items.threadDetails.id)?"chat-thread-opposite":"chat-thread-current"}>{items.messages[i].message}<p className={parseInt(items.messages[i].send) === parseInt(items.threadDetails.id)?"chat-date-opposite":"chat-date-current"}>{localDate.toString().substr(15,6)}</p></div>
                            </span>
                        )
                    }
                    else{
                        messages.push(
                            <span key={i}>
                                <div className={parseInt(items.messages[i].send) === parseInt(items.threadDetails.id)?"chat-thread-opposite":"chat-thread-current"}>{items.messages[i].message}<p className={parseInt(items.messages[i].send) === parseInt(items.threadDetails.id)?"chat-date-opposite":"chat-date-current"}>{localDate.toString().substr(15,6)}</p></div>
                            </span>
                        )
                    }
                    temp = group
                    
                }
            }
        })
    }
    catch(err){
        console.log(err.message)
    }
    
    return (
        <div style={{display:props.showchat?"block":"none"}} className={props.toggle?"chat-layout chat-show":"chat-layout-small chat-hide"} >
            <div className="chat-layout-top" onClick={props.setToggle}>
                <p>{props.name}</p><p className="chat-close" onClick={props.setchat}><i className="fa fa-times-thin fa-2x" aria-hidden="true"></i></p>
            </div>
            <div className="chat-layout-content">
                {messages}
                <div ref={messagesEndRef}></div>
            </div>
            <form className="chat-layout-bottom">
                <input value={inputMessage} type="text" className="chat-input" placeholder="Type a message..." onChange={handleChange}/>
                <button className="chat-send-button" onClick={sendMessage}><i className="fa fa-send-o"></i></button>
            </form>
        </div>
    )
}

export default connect(
    null,
    { actions }
)(Chat);