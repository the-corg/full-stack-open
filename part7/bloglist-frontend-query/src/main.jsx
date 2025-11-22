import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import { NotificationContextProvider } from './components/NotificationContext.jsx';
import { UserContextProvider } from './components/UserContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
        * {
            font-family: Verdana;
        }
`;

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <Router>
    <NotificationContextProvider>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <GlobalStyle />
          <App />
        </QueryClientProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  </Router>,
);
