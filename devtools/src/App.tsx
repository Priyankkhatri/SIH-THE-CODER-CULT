import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import LLMPlayground from './pages/LLMPlayground';
import LiveMonitor from './pages/LiveMonitor';
import RAGInspector from './pages/RAGInspector';
import VisionDebugger from './pages/VisionDebugger';
import Datasets from './pages/Datasets';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/llm" element={<LLMPlayground />} />
        <Route path="/monitor" element={<LiveMonitor />} />
        <Route path="/rag" element={<RAGInspector />} />
        <Route path="/vision" element={<VisionDebugger />} />
        <Route path="/datasets" element={<Datasets />} />
      </Route>
    </Routes>
  );
}
