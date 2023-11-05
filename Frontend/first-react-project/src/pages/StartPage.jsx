import React from 'react';
import { useNavigate } from 'react-router-dom';
import './pagesStyle/StartPage.css';

function StartPage() {
  const navigate = useNavigate(); 

  const handleUserListClick = () => {
    // Navigate to the Users List Page
    navigate('/UsersListPage');
  };

  const handleUserFormClick = () => {
    // Navigate to the User Form Page
    navigate('/UserFormPage');
  };

  return (
    <div className="user-direction">
      <button type="button" onClick={handleUserListClick} className='link-user-list'>
        Users List
      </button>
      <button type="button" onClick={handleUserFormClick} className='link-user-form'>
        Add User
      </button>
    </div>
  );
}

export default StartPage;