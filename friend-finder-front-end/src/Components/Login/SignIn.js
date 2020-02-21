import React,{useState,useEffect,useCallback,useRef} from 'react'
import Header from './Header'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import FriendImg from '../Assets/Images/Connect_with_friends.png'
import Input from '../Input'
import Button from '../Button'
import {connect} from 'react-redux'
import store from '../../Controllers/Store/store'
import * as actions from '../../Controllers/Actions/Actions'

function SignIn(){
    const history = useHistory();
    const inputRef = useRef();
    useEffect(() => {
        document.title = "Friend Finder | Log in or Sign up."
        inputRef.current.focus();
        if(sessionStorage.getItem('key')){
            history.push("/home")
        }
    }, [history])
    const [error,setError] = useState('')
    const renderError = useCallback(
        () => {
            return(
                <p className={error===''?"":"alert"}>{error}</p>
            )
        },
        [error],
    )
    const [userDetails , setUserDetails] = useState({
        name:"",
        userName:"",
        email:"",
        password:"",
        re_enter_password:"",
        birthday:"",
        gender:""
    })
    const unsubcribe = store.subscribe(() => console.log(store.getState()))
    unsubcribe()
    function callError(){
        //catch the password not match error
        if(userDetails.password !== userDetails.re_enter_password)
            setError("Passwords do not match")
        else
            sendData()
    }
    function sendData(){
        store.dispatch(actions.addSignUpDetails(userDetails.name,userDetails.userName,userDetails.email,userDetails.password,userDetails.birthday,userDetails.gender))

        axios.post(`http://localhost:4000/sign-up`,store.getState())
        .then(res=>{
            alert(res.data)
        })
        .catch(err=>{
            alert(err)
        })
    }
    function handleChange(event){
        setUserDetails(
            prev=>{
                prev[event.target.name] = event.target.value
                return prev
            }
        )
    }
    return(
        <div>
            <Header inputRef={inputRef}/>  
            <div className="main-content">
                <div className="main-content-left">
                    <h3>Friend Finder helps you connect and share with the people in your life.</h3>
                    <img src={FriendImg} alt="connect with friends."/>
                </div>
                <div className="main-content-right">
                    <h1>Create an account</h1>
                    <p>It's quick and easy.</p>
                    {renderError()}
                    <div className="main-content-form">
                        <div className="flex-wrap">
                            <Input method={handleChange} name="name" class="input-form" text="Full Name" type="text"/>
                            <Input method={handleChange} name="userName" class="input-form width" text="User name" type="text" />
                        </div>
                        <Input method={handleChange} name="email" class="input-form" text="Email address" type="text"/>
                        <Input method={handleChange} name="password" class="input-form" text="New Password" type="password" />
                        <Input method={handleChange} name="re_enter_password" method2={callError} class="input-form" text="Re enter new Password" type="password"/>
                        <div className="form-option-list">
                            <p>Birthday</p>
                            <input className="ff-date" name="birthday" type="date" onChange={handleChange}/>
                        </div>
                        <div className="form-option-list">
                            <p>Gender</p>
                            <input type="radio" name="gender" value="Male" onChange={handleChange}/><span>Male</span>
                            <input type="radio" name="gender" value="Female" onChange={handleChange}/><span>Female</span>
                            <input type="radio"  name="gender"value="Other" onChange={handleChange}/><span>Other</span>
                        </div>
                        <Button method={callError} class="ff-sign-up-button" name="Sign Up"/>
                    </div>
                </div>
            </div>     
        </div>
    );
}

export default connect(
    null,
    { actions }
  )(SignIn);