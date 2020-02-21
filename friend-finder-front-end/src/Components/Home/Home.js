import React,{useEffect,useCallback,useState} from 'react'
import { connect } from 'react-redux';
import { Route, Switch} from 'react-router-dom'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import store from '../../Controllers/Store/store'
import * as actions from '../../Controllers/Actions/Actions'
import TopNav from './TopNav'
import FriendRecomendation from './FriendRecomendation';
import Friends from './Friends'
import Settings from '../Settings/Settings'
import images from '../../ProfileImagesPath'
import MessageHeadCollection from '../Chat/MessageHeadCollection'
import FriendRecomendationLoader from '../Loaders/FriendRecomendationLoader'
import FriendLoader from '../Loaders/FriendLoader'


function Home(props){
    const history = useHistory()
    const [name,setName] = useState("");
    const [imgUrl,setImgUrl] = useState("");
    const [loading,setLoading] = useState(true)
    const noProfile = '/ProfileImages/user.jpeg';

    useEffect(() => {
        var isLoad = true;
        async function loadData (){
            document.title = "Home | Friend Finder";
            await axios.post('http://localhost:4000/log-in/check-login',[sessionStorage.getItem('key')])
            .then(res => {
                if(res.data.message === "jwt expired"){
                    sessionStorage.clear()
                    history.push('/');
                }
                if(res.data.message === "jwt must be provided") {
                    sessionStorage.clear()
                    history.push('/');
                }
                if(res.data.message === "Cannot read property 'toString' of null"){
                    sessionStorage.clear()
                    history.push('/'); 
                }
                // console.log(res.data)
                store.dispatch(actions.addUserName(res.data.user))
                store.dispatch(actions.addAllRecommendedFriends(res.data.userData))
                store.dispatch(actions.addFriendRequests(res.data.friendRequests))
                store.dispatch(actions.addFriends(res.data.friends))
                try{
                    if (isLoad) {
                        setName(store.getState().setName[0].name.name);
                        setImgUrl(store.getState().setName[0].name.image)
                    }
                }
                catch(err){
                    console.log(err.message);
                }
            })
            .catch( err => {alert(err)}) 
            setTimeout(() => {
                if(isLoad){
                    setLoading(prev=>{
                        prev = false
                        return prev
                    });
                }
            }, 1000);
        }
        loadData()
        return( () => {
            isLoad = false
        })
    }, [history])
    // const unsubcribe = store.subscribe(() => console.log(store.getState()))
    
    const names = useCallback(
        () => { return name },
    [name],)

    const img = useCallback(
        () => { return imgUrl },
    [imgUrl],)

    function sendFriendRequest(id){
        let details = {}
        details = {
            requestFrom:sessionStorage.getItem('key'),
            requestTo:id
        }
        axios.post('http://localhost:4000/send-friend-request',details)
        .then(res=>console.log(res.data))
        .catch(err=>alert(err.message))
    }

    var friendsAvailable = [];
    let srci = "";
    try{ 
        store.getState().setFriends[0].details.map(items=>{
            for(let i in images){
                if(items.profileImageUrl === images[i].name){
                    srci= images[i].src
                }
            }
            friendsAvailable.push(<FriendRecomendation img={srci?src:noProfile} key={items.id} status={items['friendRequests.status']} name={items.userName} mutual="-" method={sendFriendRequest} id={items.id}/>)
            srci=""
        })
    }
    catch(err){
        console.log(err.message)
    }

    let friends = [];
    let src = "";
    try{ 
        store.getState().setFriendsForUser[0].details.map(items=>{
            for(let i in images){
                if(items.profileImageUrl === images[i].name){
                    src= images[i].src
                }
            }
            friends.push(<Friends img={src?src:noProfile} key={items.id} name={items.userName} id={items.id} mutual={items.mutualFriends} friends={items.friends}/>)
            src=""
        })
        if(friends.length<1){
            friends.push(<p className="friends-inside" key="1">No friends yet. Try to connect with other people.</p>)
        }
    }
    catch(err){
        console.log(err.message)
    }

    

    function loadRecomend(){
        if(loading)
            return (
                <>
                    <FriendRecomendationLoader />
                    <FriendRecomendationLoader />
                    <FriendRecomendationLoader />
                    <FriendRecomendationLoader />
                    <FriendRecomendationLoader />
                    <FriendRecomendationLoader />
                </>
            )
        else
            return friendsAvailable
    }

    function loadFriends(){
        if(loading)
            return (
                <>
                    <FriendLoader />
                    <FriendLoader />
                    <FriendLoader />
                    <FriendLoader />
                    <FriendLoader />
                </>
            )
        else
            return friends
    }

    return(
        <div className="home">
            <TopNav name={names()} image={img()}/>  
            <Switch>
                <Route exact path="/home">
                    <div className="home-main-content">
                        <div className="nav">
                            <ul className="nav-list">
                                <li>Home</li>
                                <li>News feed</li>
                                <li>Messenger</li>
                                <li>Watch</li>
                            </ul>
                        </div>
                        <div className="home-friends">
                            <p>Friends</p>
                            {loadFriends()}
                            <div className="friend-requests-footer">
                                <p>see all</p>
                            </div>
                        </div>
                        <div className="home-people-you-may-know">
                            <p>People you may know</p>
                            <div className="people-you-may-know-friends">
                            <div className="loader"></div>
                                {loadRecomend()}                                
                            </div>
                            <div className="friend-requests-footer">
                                <p>see all</p>
                            </div>          
                        </div>
                        <MessageHeadCollection />
                    </div>
                </Route>
                <Route path="/home/settings">
                    <Settings/>
                </Route>
            </Switch>
        </div>
    )
}
function mapstatetoprops(state){
    return {state}
}

export default connect(
    mapstatetoprops,
    { actions }
)(Home);