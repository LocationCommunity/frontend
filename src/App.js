

import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import Footer from './Layout/Footer';
import Home from './Home/Home';
import Map from './Place/Map';
import Boards from './Boards/Boards'
import BoardWrite from './Boards/BoardWrite'
import BoardsList from './Boards/BoardsLists';
import Weather from './Weather/Weather';
import LoginPage from './Members/LoginPage';
import MyInfo from './Members/MyInfo';
import MyChatRoomList from './Chat/MyChatRoomList';
import ChatRoomDetail from './Chat/ChatRoomDetail';
import Matching from './Matching/Matching';
import { AuthProvider } from './Context/AuthContext';
import Nav from './Layout/Nav';
import PlaceList from './Place/PlaceList';
import PlaceInfo from './Place/PlaceInfo';
import MyInfoUpdate from './Members/MyInfoUpdate';
import BoardsUpdate from './Boards/BoardsUpdate';



const App = () => {
  return (
    <AuthProvider>
        <header><Nav/></header>
      <div className="App">
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map/>} />
          <Route path="/weather/data" element={<Weather />} />
          <Route path="/boards/lists" element={<BoardsList />} />
          <Route path="/boards" element={<BoardWrite />} />
          <Route path="/boards/:boardId" element={<Boards />} /> Route 안에서는 element prop을 사용합니다.
          <Route path="/members/login" element={<LoginPage/>} />
          <Route path="/members/my-info" element={<MyInfo/>} />
          <Route path="/chat/room/list" element={<MyChatRoomList/>} />
          <Route path="/chat/room/:roomId" element={<ChatRoomDetail/>} /> state 로 roomid 값 받아옴.
          <Route path="/matching" element={<Matching/>} />
          <Route path="/place/list" element={<PlaceList />} />
          <Route path="/place/info/:placeId" element={<PlaceInfo/>} />
          <Route path="/members/my-info/update" element={<MyInfoUpdate />} />
          <Route path="/boards/:boardId" element={<BoardsUpdate />} />
          
          
        </Routes>
         <Footer />
      </div>
      </AuthProvider>
    
  );
};

export default App;