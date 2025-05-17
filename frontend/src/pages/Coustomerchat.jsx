import React from 'react';
import NavBar from '../components/NavBar';
import ChatBox from '../components/ChatBox';
import Footer from '../components/Footer';

function Customerservices() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <ChatBox />
      </div>
      <Footer />
    </div>
  );
}

export default Customerservices;
