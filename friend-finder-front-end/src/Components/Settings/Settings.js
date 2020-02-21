import React,{useState} from 'react';
import Button from '../Button';
import images from '../../ProfileImagesPath'


function Settings(){
    const [imgUrl,setImgUrl] = useState("");

    function changeProfilePic(event){
        event.persist();
        setImgUrl(prev=>{
            prev = event.target.value.substr(12,);
            return prev
        })
    }
    const image = images.map(({id,src,name,alt})=>{
        if(imgUrl.toString() === name.toString()){
            console.log(name)
            return <img src={src} alt={alt} key={id}/>
        }
    })
    return (
        <div className="settings-menu">
            <div>
                <p style={{color:"#3b5998"}}>Change or Update your details</p>
                <br/><br/>
                <div className="input-wrapper">
                    <p className="settings-p">Name:</p>
                    <input type="text" className="input-wrapper-input"/>
                </div>
                <br/>
                <div className="input-wrapper">
                    <p className="settings-p">Passsword:</p>
                    <input type="text" className="input-wrapper-input"/>
                </div>
                <br/>
                <div className="input-wrapper">
                    <p className="settings-p">User name:</p>
                    <input type="text" className="input-wrapper-input"/>
                </div>
                <br/>
                <div className="input-wrapper">
                    <p className="settings-p">Profile picture:</p>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <i className="fa fa-cloud-upload"></i>Upload file
                    </label>
                    <input id="file-upload" onInput={changeProfilePic} type="file"/>
                </div>
                <br/>
                <Button name="Update changes" class="friends-btn" />
            </div>
            <div className="preview-image">
                {image}
            </div>
        </div>
    )
}

export default Settings