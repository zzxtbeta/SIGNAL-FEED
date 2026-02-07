import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { LayoutProvider } from './contexts/LayoutContext';
import Layout from './components/Layout';
import SignalFeed from './pages/SignalFeed';
import KnowledgeMap from './pages/KnowledgeMap';
import Candidates from './pages/Candidates';
import MyFocus from './pages/MyFocus';
import MyNotes from './pages/MyNotes';
import Chat from './pages/Chat';

function App() {
  return (
    <AppProvider>
      <LayoutProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/signals" replace />} />
              <Route path="signals" element={<SignalFeed />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="knowledge-map" element={<KnowledgeMap />} />
              <Route path="focus" element={<MyFocus />} />
              <Route path="notes" element={<MyNotes />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LayoutProvider>
    </AppProvider>
  );
}

export default App;
