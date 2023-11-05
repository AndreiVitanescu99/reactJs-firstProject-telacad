import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "./componentsStyle/UserAddForm.css";

const StyledForm = styled.form`
   width: 34vw;
   max-width: 600px;
   height: 74vh;
   border: 0.2px outset rgba(255, 255, 255, 0.599);
    outline: 0;
    border-radius: 16px;
    background-color: #EBECF0;
    box-shadow: -5px -5px 20px #FFF, 5px 5px 20px #BABECC;
    transition: all 0.2s ease-in-out;
   display: flex;
   justify-content: center;
   align-items: center;
   font-family: "Times New Roman", Times, serif;

   &:hover {
        box-shadow: -2px -2px 5px #FFF, 2px 2px 5px #BABECC;
    }

   &.form-with-errors {
     min-height: calc(82vh + 20px * var(--error-count, 0));
   }
   
   @media screen and (max-width: 1040px) {
     width: 90%;
     max-width: none;
     height: 90%;
   }
`;

function UserAddForm() {

  const [user, setUser] = useState(
    {
      firstName_user: '',
      lastName_user: '',
      email_user: '',
      age_user: '',
      gold_user: false,
      profilPicture_user: ''
    });
  const [userProfile, setUserProfile] = useState('');
  const [errors, setErrors] = useState({});
  const [usersEmails, setUsersEmails] = useState({});
  const [formHasErrors, setFormHasErrors] = useState(false);

  const imgProfile = document.querySelector("#user-image-profile");

  /**
   * Clears the user data, error messages, and existing user email addresses in the component's state.
   */
  const clearStates = () => {
    setUser({
      firstName_user: '',
      lastName_user: '',
      email_user: '',
      age_user: '',
      gold_user: false,
      profilPicture_user: '',
    });
    setErrors({});
    setUsersEmails({});
    setUserProfile('')
  };

  const navigate = useNavigate();
  const handleUserFormClick = () => {
    navigate('/UsersListPage');
  };

  /**
   * Fetches a list of existing user emails from the server, form the table 'users'.
   */
  const getUsersEmails = async () => {
    try {
      const reqData = await fetch('http://localhost:5000/users/getUsersEmails');
      const resData = await reqData.json();
      setUsersEmails(resData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsersEmails();
  }, []);

  /**
   * Validates the user input form.
   * @returns {Boolean} - `true` if the form is valid, `false` otherwise.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!/^[a-zA-Z-]+$/.test(user.firstName_user)) {
      newErrors.firstName_user = 'Only letters and a "-" if you need!';
    }

    if (!/^[a-zA-Z-]+$/.test(user.lastName_user)) {
      newErrors.lastName_user = 'Only letters and a "-" if you need!';
    }

    for (let index = 0; index < usersEmails.length; index++) {
      if (user.email_user === usersEmails[index].email)
        newErrors.email_user = 'This email already exists!';
    }

    // Determine if there are any errors in the form.
    const hasErrors = Object.keys(newErrors).length > 0;
    setErrors(newErrors);
    setFormHasErrors(hasErrors);

    return !hasErrors;
  };

  /**
   * Sends a POST request to add a new user's data to the server.
   */
  const fetchData = async () => {
    try {
      const newData = await fetch('http://localhost:5000/users/postUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...user
        })
      });

      if (newData.ok) {
        const result = await newData.json();
        console.log(result);
      } else {
        console.error('HTTP error:', newData.status, newData.statusText);
        throw new Error('HTTP request failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Sends a POST request to upload a user's profile image to the server.
   * @returns {Object}
   */
  const fetchDataPicture = async (email) => {
    userProfile.set('email_user', email)
    try {
      const response = await fetch('http://localhost:5000/postUserPicture', {
        method: 'POST',
        body: userProfile,
      });

      if (!response.ok) {
        console.log(response);
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error('HTTP request failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Handles input changes and updates the user state.
   * @param {Object} event - The input change event.
   */
  const handleInput = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  /**
   * Handles input[checkBox] changes and updates the user state.
   * @param {Object} event - The input change event.
   */
  const handleCheckBox = (event) => {
    const { name, checked } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  /**
   * Handles input[file] changes and updates the user img Profile.
   * @param {Object} event - The input change event.
   */
  const handleFile = (event) => {
    try {
      const formData = new FormData();
      formData.append('profilPicture', event.target.files[0]);
      setUserProfile(formData);
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  }

  /**
   * Handles the form submission, including form validation and data processing.
   * @param {Object} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior.
    const isFormValid = validateForm();
    if (isFormValid) {
      fetchData();
      await fetchDataPicture(user.email_user);
      clearStates();
      imgProfile.value = '';
    }
  }

  return (
    <div className="centered-container">
      <StyledForm action="" onSubmit={handleSubmit} encType="multipart/form-data" className={formHasErrors ? 'form-with-errors' : ''}>
        <div className="container-fluid container-form-user">
          <div>
            <label htmlFor='firstName_user'>First Name:</label>
            <input onChange={handleInput} type="text" placeholder='Enter your first name!' name='firstName_user' value={user.firstName_user} required />
          </div>
          {errors.firstName_user && <span className='text-msg-wrong'>{errors.firstName_user}</span>}
          <div>
            <label htmlFor='lastName_user'>Last Name:</label>
            <input onChange={handleInput} type="text" placeholder='Enter your last name!' name='lastName_user' value={user.lastName_user} required />
          </div>
          {errors.lastName_user && <span className='text-msg-wrong'>{errors.lastName_user}</span>}
          <div>
            <label htmlFor='age_user'>Age:</label>
            <input onChange={handleInput} type="number" min="16" max="100" placeholder='Enter your age!' name='age_user' value={user.age_user} required />
          </div>
          <div>
            <label htmlFor='email_user'>Email:</label>
            <input onChange={handleInput} type="email" placeholder='Enter your email!' name='email_user' value={user.email_user} required />
          </div>
          {errors.email_user && <span className='text-msg-wrong'>{errors.email_user}</span>}
          <div>
            <label htmlFor='gold_user'>Golden User:</label>
            <input type='checkbox' onChange={handleCheckBox} name='gold_user' value={user.gold_user} />
          </div>
          <div>
            <label htmlFor='profilPicture'>Profil Picture:</label>
            <input id="user-image-profile" type='file' accept="image/*" onChange={(event) => handleFile(event)} name='profilPicture' required />
          </div>
          <div className='container-buttons'>
            <button type='submit'>Sign up</button>
            <button type="button" onClick={handleUserFormClick}>To User Page List</button>
          </div>
        </div>
      </StyledForm>
    </div>
  )
}

export default UserAddForm;