import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import { NotificationContextProvider } from './components/NotificationContext.jsx';
import { UserContextProvider } from './components/UserContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <Router>
    <NotificationContextProvider>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  </Router>,
);
