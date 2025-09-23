import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Header from './components/Header/Header';
import MainMenu from './components/MainMenu/MainMenu';
import SideMenu from './components/SideMenu/SideMenu';
import RegisterStudentsUI from './components/RegisterUI/RegisterStudentsUI'


function App() {
  const [count, setCount] = useState(0)

  const [SideMenuOpen, setSideMenuOpen] = useState(false);
    //SideMenuOpenっていうStateをfalseからスタート。setSideMenuOpenはセッター。
  const toggleSideMenu = () => {
    setSideMenuOpen(prev => !prev);
      //prev=前の状態。falseならtrueへ
  };

  return (
    <Router>
      <div className="header">
        <Header 
          title="生徒情報管理" 
          onMenuClick = {toggleSideMenu}
        />
      </div>
      <div className='main'>
        <div className='inner'>
          <div className='mainContainer'>
            <SideMenu titles={{
              mainmenu: "メインメニュー",
              registerStudent: "生徒登録",
              viewStudents: "生徒一覧確認"
            }}
              isOpen = {SideMenuOpen}/>
            <Routes>
              <Route path="/" element={<Navigate to="/mainmenu" />} />
              <Route 
                path="/mainmenu"
                element={
                  <MainMenu 
                    titles={{
                      registerStudents: "生徒登録",
                      viewStudents: "生徒一覧確認",
                    }}
                  />
                }
              />
              <Route path="/RegisterStudentsUI" element={<RegisterStudentsUI />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
