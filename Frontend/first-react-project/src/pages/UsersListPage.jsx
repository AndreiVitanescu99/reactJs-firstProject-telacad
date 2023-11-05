import React from 'react';
import UserList from '../components/UserList';
import './pagesStyle/UserListPage.css'

function UsersListPage() {

    return (
        <div className='container-md userlist-page'>
            <UserList></UserList>
        </div>
    )
}

export default UsersListPage;