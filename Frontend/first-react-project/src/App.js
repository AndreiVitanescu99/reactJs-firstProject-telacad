import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserFormPage from './pages/UserFormPage';
import UsersListPage from './pages/UsersListPage';
import StartPage from './pages/StartPage';
import Page404 from "./pages/Page404";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartPage />}></Route>
        <Route path="/UsersListPage" element={<UsersListPage />}></Route>
        <Route path="/UserFormPage" element={<UserFormPage />}></Route>
        <Route path="/UserFormPage" element={<UserFormPage />}></Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
