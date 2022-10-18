import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import NavBar from "./routes-nav/NavBar";
import Routes from "./routes-nav/Routes";
import jwt from "jsonwebtoken";
import QRBoxerApi from "./api/api";
import useLocalStorage from "./useLocalStorage";
import UserContext from "./UserContext";
import LoadingSpinner from "./common/LoadingSpinner";


function App() {
  const [infoLoaded, setInfoLoaded] = useState(false)
  const [token, setToken] = useLocalStorage("token", "");
  const [currentUser, setCurrentUser] = useState(null);
  let [move, setMove] = useState(null);
  let [box, setBox] = useState(null);
  let [item, setItem] = useState(null);


  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          QRBoxerApi.token = token;
          let currentUser = await QRBoxerApi.getCurrentUser(username);
          setCurrentUser(currentUser);

        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  async function signup(signupData) {
    try {
      let token = await QRBoxerApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await QRBoxerApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  async function createmove(moveData) {
    try {
      move = await QRBoxerApi.createmove(moveData);
      setMove(move);
      return { success: true };
    } catch (errors) {
      console.error("create move failed", errors);
      return { success: false, errors };
    }
  }

  async function createbox(moveData) {
    try {
      box = await QRBoxerApi.createbox(moveData);
      setBox(box);
      return { success: true };
    } catch (errors) {
      console.error("create move failed", errors);
      return { success: false, errors };
    }
  }

  async function removebox(boxData) {
    try {
      box = await QRBoxerApi.removebox(boxData);
      setBox(box);
      return { success: true };
    } catch (errors) {
      console.error("remove box failed", errors);
      return { success: false, errors };
    }
  }

  async function createitem(boxData) {
    try {
      item = await QRBoxerApi.createitem(boxData);
      setItem(item);
      return { success: true };
    } catch (errors) {
      console.error("create item failed", errors);
      return { success: false, errors };
    }
  }

  async function removeitem(itemData) {
    try {
      item = await QRBoxerApi.removeitem(itemData);
      setItem(item);
      return { success: true };
    } catch (errors) {
      console.error("remove item failed", errors);
      return { success: false, errors };
    }
  }

  function logout() {

    console.log("logging out")
    setToken(null);
    setCurrentUser(null);

  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <NavBar logout={logout} />
          <Routes 
          login={login} 
          signup={signup} 
          createmove={createmove} 
          createbox={createbox} 
          createitem={createitem} 
          removebox={removebox} 
          removeitem={removeitem} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
