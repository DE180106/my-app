import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App;
