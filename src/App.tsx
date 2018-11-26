import './App.css';
import './firebase';

import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
