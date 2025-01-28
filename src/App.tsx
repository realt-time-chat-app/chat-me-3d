import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from '@/state/store';
import UserRegistration from "@/components/UserRegistrationComponent";
import Dashboard from "@/components/Dashboard";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-background text-text flex items-center justify-center">
          <Routes>
            <Route path="/" element={<UserRegistration />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
