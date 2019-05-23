import React from 'react';
import Main from './components/Main';
import Footer from './components/Footer';
import './index.css';

class App extends React.Component {
    render() {
        return (
            <div className="sticky">
                <Main />
                <Footer />
            </div>
        );
    }
}

export default App;
