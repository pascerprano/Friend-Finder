import React,{useState} from 'react'
import InputWrapper from './InputWrapper'
import Button from '../Button'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import store from '../../Controllers/Store/store'
import * as actions from '../../Controllers/Actions/Actions'

function Header(props){
    const history = useHistory()
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')

    const unsubcribe = store.subscribe(() => console.log(store.getState()))
    function saveData(event){
        event.preventDefault();
        store.dispatch(actions.addLoginDetails(email,password))

        axios.post(`http://localhost:4000/log-in`,store.getState().loginApp)
        .then(res=>{
            if(res.data.status === "login sucess"){
                sessionStorage.setItem("key",res.data.token)
                // store.dispatch(actions.addUserName(res.data.name))
                history.push("/home")
            }
            else{
                alert(res.data.status)
            }
        })
        .catch(err=>{
            alert(err)
        })
    }
    unsubcribe()
    return(
        <div className="top-nav">  
            <div className="top-nav-margin"> 
                <div className="top-nav-left">
                    <h1>Friend Finder</h1>
                </div>
                <form className="top-nav-right">
                    <InputWrapper inputRef={props.inputRef} method={setEmail} class="header-input" text="Email or Phone" type="text"/>
                    <InputWrapper method={setPassword} class="header-input" text="Password" type="password"/>
                    <Button method={saveData} class="ff-button" name="Log In"/>
                </form>
            </div>
        </div>      
    );
}

export default connect(
    null,
    { actions }
  )(Header);