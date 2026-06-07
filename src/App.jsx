import { useState } from 'react';
import HomePage from './HomePage';
import FormPage from './FormPage';
import ResultsPage from './ResultsPage';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [formData, setFormData] = useState(null);

  const navigateToForm = () => setCurrentView('form');
  const navigateToHome = () => setCurrentView('home');
  
  const handleFormSubmit = (data) => {
    setFormData(data);
    setCurrentView('results');
  };

  return (
    <div className="app-container">
      {currentView === 'home' && <HomePage onStartForm={navigateToForm} />}
      {currentView === 'form' && <FormPage onSubmit={handleFormSubmit} onBack={navigateToHome} />}
      {currentView === 'results' && <ResultsPage formData={formData} onBack={navigateToForm} />}
    </div>
  );
}

export default App;
