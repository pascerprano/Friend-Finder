import React,{useEffect,useState,useCallback} from 'react'
import axios from 'axios'
import Chat from '../Chat/Chat'
import setImages from '../../ProfileImagesPath'
import Loader from '../Loaders/ChatLoader'
import MessageHeads from "./MessageHeads";
import openSocket from 'socket.io-client';
import { connect } from 'react-redux';
import * as actions from '../../Controllers/Actions/Actions'

function MessageHeadCollection(props){
    const socket = openSocket('http://localhost:5000');
    const [chatHead,setChatHead] = useState([])
    const [loading,setLoading] = useState(true)

    const [toggle,setToggle] = useState(false)
    const [showChat,setshowChat] = useState(false)
    const [chatDetails,setChatDetails] = useState({
        name:"",
        id:""
    })

    function callToChat(key,id,message,isChat){
        if(isChat){
            socket.emit('join_to_chat', {key,id,message,isChat})  
            socket.on("new_msg", function(data) {
                // console.log(data);
                let renderNow;
                setChatHead(prev=>{
                    prev.map(items=>{
                        for(let i in data){
                            if(items.id === data[i].id){
                                items.messages = data[i].messages
                            }
                        }
                    })
                    renderNow = prev
                    prev = ""
                    return prev
                })
                setChatHead(prev=>{
                    prev = renderNow
                    return prev
                })
                console.log(chatHead)
            })
        }
        else{
            socket.emit('join_to_chat', {key,id,isChat})
        }
    }
    useEffect(() => {
        var isLoad = true
        async function getData() {
            
            await axios.post('http://localhost:4000/send-friend-request/chat-heads',[sessionStorage.getItem('key')])
            .then(res=>{
                console.log(res.data)
                if(isLoad){
                    setChatHead(prev=>{
                        prev=res.data
                        return prev
                    })
                }
            })
            setTimeout(() => {
                if(isLoad){
                    setLoading(prev=>{
                        prev = false
                        return prev
                    });
                }
            }, 1000);
        }
        getData()
        return () => {
            isLoad = false
        };
    }, [])

    let messageHeads;
    try{
        messageHeads = chatHead.map(items=>{
            let imge;
            for(let i in setImages){
                if(setImages[i].name === items.threadDetails['profileImageUrl'])
                    imge = setImages[i].src
            }
            return <MessageHeads key={items.threadDetails.id} id={items.threadDetails.id} callToChat={callToChat} onclick={openChat} setname={setName} name={items.threadDetails['userName']} img={imge}/>
        })
    }
    catch(err){
        console.log(err.message)
    }

    

    function loadContent(){
        if(loading)
            return (
                <>
                <Loader />
                <Loader />
                </>
            )
        else
            return messageHeads
    }

    function handleToggle(){
        setToggle(prev=>prev=!prev)
    }

    function handleChat(){
        setshowChat(prevChat=>prevChat=false)
    }

    function openChat(){
        setToggle(prev=>prev=true)
        setshowChat(prevChat=>prevChat=true)
    }
    function setName(name,id){
        setChatDetails(prev=>{
            prev.name=""
            prev.id=""
            prev.name=name
            prev.id=id
            return prev
        })
    }
    return (
        <div className="messages">
            <div className="message-chat-heads">
                <p className="message-chat-heads-p">contacts</p>
                {loadContent()}
            </div>
            <Chat showchat={showChat} toggle={toggle} setToggle={handleToggle} setchat={handleChat} name={chatDetails.name} messages={chatHead} chat={callToChat} details={chatDetails}/>
        </div>
        
    )
}
function mapstatetoprops(state){
    return {state}
}
export default connect(
    mapstatetoprops,
    { actions }
)(MessageHeadCollection);