import React,{useState,useCallback,useEffect,useRef} from 'react'
import { connect } from 'react-redux';
import store from '../../Controllers/Store/store'
import * as actions from '../../Controllers/Actions/Actions'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import HiddenFriendRequestNotifications from './HiddenFriendRequestNotifications'
import Input from '../Input'    
import setImages from '../../ProfileImagesPath'


function TopNav(props){
    const history = useHistory();
    const inputRef = useRef(null);
    const noProfile = '/ProfileImages/user.jpeg';

    const [settings,setSetting] = useState(false);
    const [friends,setFriends] = useState(false);
    const [search,setSearch] = useState("");
    const [searchDetails,setSearchDetails] = useState({
        details:""
    });

    function handleToggleSetting(){
        setSetting(prevSettings=>{
            prevSettings = !prevSettings
            return prevSettings
        })
        setFriends(prevFriends=>{
            prevFriends = false
            return prevFriends
        })
    }
    function handleToggleFriendRequest(){
        setFriends(prevFriends=>{
            prevFriends = !prevFriends
            return prevFriends
        })
        setSetting(prevSettings=>{
            prevSettings = false
            return prevSettings
        })
    }
    const custumRendersettings = useCallback(
        () => {
            if(settings)
                return (
                    <div className="hidden-menu settings">
                        <span className="beacon"></span>
                        <div className="hidden-menu-inside">
                            <div className="hidden-menu-inside-p">
                                <p onClick={()=>{setSetting(false);setFriends(false);history.push('/home/settings')}}>Settings</p>
                            </div>
                            <div className="hidden-menu-inside-p">
                                <p onClick={()=>{setSetting(false);setFriends(false);sessionStorage.clear();history.push('/')}}>Log Out</p>
                            </div>
                        </div>
                    </div>
                )
        },
        [settings,history],
    )

    var requests = [];
    try{
        requests = store.getState().setFriendsRequsts[0].details.map(items=>{
                return <HiddenFriendRequestNotifications id={items.id} name={items.name} key={items.id} method={acceptFriendRequest}/>
        })
        if(requests.length < 1){
            requests.push(<p className="friend-request-notifications" key="1">No friend requests</p>)
        }
    }
    catch(err){
        console.log(err.message)
    }

    const custumRenderFriend = useCallback(
        () => {
            if(friends)
                return (
                    <div className="hidden-menu friend-requests">
                        <span className="beacon"></span>
                        <div className="friend-requests-header">Friend Requests</div>
                        <div className="friend-requests-alert">Only accept Friend Requests from people you really know.</div>
                        <div className="hidden-menu-inside-friends">
                            {requests}
                        </div>
                        <div className="friend-requests-footer">
                            <p>see all</p>
                        </div>
                    </div>
                )
        },
        [friends,requests],
    )
    
    function acceptFriendRequest(event){
        let details = {}
        details = {
            id:event.target.name
        }
        axios.post('http://localhost:4000/send-friend-request/accept',details)
        .then(res=>console.log(res.data))
        .catch(err=>alert(err.message))
    }

    let notify;
    try{
        notify = requests[0].props.children === "No friend requests"?"":<span className="alert-friends"></span>;
    }
    catch(err){
        console.log(err.message)
    }

    function handleSearch(event){
        event.persist();
        setSearch(prev=>{
            prev = event.target.value;
            return prev
        })
        // console.log(search)
        if(search.toString().length !== 0)
        sendSearch()    
    }

    async function sendSearch(){
        axios.post('http://localhost:4000/search-friends',[search])
        .then(res=>{
            console.log(res.data);
            setSearchDetails(prevDetails=>{
                prevDetails.details = ""
                prevDetails.details = res.data
                return prevDetails
            })
        })
        .catch(err=>{
            alert(err.message)
        })
    }
    const renderFooter = useCallback(
        () => {
            return search
        },
        [search],
    )
    let renderSearchNames;
    try{
        renderSearchNames = searchDetails.details.map(items=>{
            return <li key={items.id} name={items.id} className="search-friends-hidden-box-li">{items.userName}</li>
        }) 
    }
    catch(err){
        console.log(err.message)
    }
    function renderSearch(){
        if(search.toString().length <=1 && search.toString().length >0){
            return (
                <div className="search-friends-hidden-box">
                    <ul className="search-friends-hidden-box-ul">
                        <li className="search-friends-hidden-box-li">No results</li>
                    </ul>
                </div>
            )
        }
        else if(search.toString().length === 0){
            return("")
        }
        else{
            return (
                <div className="search-friends-hidden-box">
                    <ul className="search-friends-hidden-box-ul">
                        {renderSearchNames}
                        <li className="search-friends-hidden-box-li">see all results for {renderFooter()}</li>
                    </ul>
                </div>
            )
        }
    }
    let imge; 
    try{
        imge = setImages.map(({id,src,name,alt})=>{
            if(props.image.toString() === name.toString()){
                return <img key={id} className="profile-img" src={src} alt="current user profile."/>
            }
        })
    }
    catch(err){
        console.log(err.message)
    }

    useEffect(() => {        
        inputRef.current.focus();
    }, [])
    return(
        <div className="home-top-nav">
            <div className="top-nav-margin"> 
                <h1 onClick={()=>{setSetting(false);setFriends(false);history.push('/home')}}>f</h1>
                <div className="top-nav-search-div">
                    <Input method={handleSearch} name="searchName" inputRef={inputRef} type="text" class="top-nav-search" text="Search"/>
                    {renderSearch()}
                </div>
                <div className="top-nav-right">
                    {imge?imge:<img className="profile-img" src={noProfile} alt="not profile"/>}
                    <p className="profile-name">{props.name}</p>
                    <ul className="home-top-nav-list">
                        <li><i className="fa fa-bell"></i></li>
                        <li onClick={handleToggleFriendRequest}><i className="fa fa-users"></i></li>{notify}
                        <li><i className="fa fa-envelope"></i></li>
                        <li onClick={handleToggleSetting} ><i className="fa fa-caret-down"></i></li>
                    </ul>
                </div>
            </div>
            {custumRendersettings()}
            {custumRenderFriend()}
        </div>
    )
}

export default connect(
    null,
    { actions }
)(TopNav);