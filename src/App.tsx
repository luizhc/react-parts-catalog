import './App.css';
import './firebase';

import * as React from 'react';

import PartsList from './components/parts/PartsList';

class App extends React.Component {
  public render(): React.ReactNode {
    return (
      // <NavBar />
      <PartsList/>
    );
  }
}

export default App;
