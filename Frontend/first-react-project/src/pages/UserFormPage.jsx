import React from 'react';
import "./pagesStyle/UserFormPage.css";
import UserAddForm from '../components/UserAddForm'

function UserFormPage() {

  return (
    <div className='user-form'>
      <UserAddForm></UserAddForm>
    </div>
  )
}

export default UserFormPage;