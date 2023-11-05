import React from 'react';
import './componentsStyle/UserItem.css'

function UserItem(props) {

  const { user } = props;
  const imgBaseUrl = 'http://localhost:5000/dbFiles/profilePictureUser/';


  return (
    <div className='user-item'>
      <img src={imgBaseUrl + user.ImgProfile_user} className='profile-image' alt='profilImg' />
      <div className='user-info'>
        <p><b>First Name:</b> {user.first_name}</p>
        <p><b>Last Name:</b> {user.last_name}</p>
        <p><b>Age:</b> {user.user_age}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Gold Client:</b> {user.user_gold}</p>
      </div>
    </div >
  )
}

export default UserItem;