import React from 'react';
import UserItem from './UserItem';
import './componentsStyle/UserList.css';
import { useState, useEffect } from 'react';

function UserList() {

  const [userData, setUserData] = useState([]);

  /**
   * Retrieves user data from a server API.
   * This function sends an asynchronous request to a server endpoint to fetch a list of user data.
   * The fetched user data is then set in the component's state using the setUserData functio
   */
  const getUserData = async () => {
    try {
      const reqData = await fetch('http://localhost:5000/users/getUser');
      const resData = await reqData.json();
      setUserData(resData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className='user-list'>
      {userData.map((user) => {
        return (
          <UserItem
            key={user.user_id}
            user={user}>
          </UserItem>
        )
      })}
    </div>
  )
}

export default UserList;
