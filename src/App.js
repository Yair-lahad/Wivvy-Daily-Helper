import logo from './assets/wivvy-bird-librarian.png';
import CalendarView from './components/CalendarView';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="home-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Wivvy</h1>
        <p>
          Weave your day with clarity
        </p>
        {/* Calendar App */}
        <CalendarView />
      </header>
    </div>
  );
}

export default App;
