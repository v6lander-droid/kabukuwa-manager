import React, { useState, useEffect } from 'react';
import { Bug, GitBranch, Table, Plus, Zap, Settings, Download, Upload } from 'lucide-react';

const generateCreatures = () => [
  { id: '1', name: '個体 1号', stage: '幼虫', generation: 'F5' },
  { id: '2', name: '個体 2号', stage: '蛹', generation: 'F5' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [creatures, setCreatures] = useState(() => {
    const saved = localStorage.getItem('beetle_data');
    return saved ? JSON.parse(saved) : generateCreatures();
  });

  useEffect(() => {
    localStorage.setItem('beetle_data', JSON.stringify(creatures));
  }, [creatures]);

  return (
    <div className="h-screen bg-emerald-50 text-emerald-950 flex flex-col">
      <header className="bg-emerald-900 text-amber-400 p-4 font-bold flex items-center shadow-md">
        <Bug className="mr-2" /> Beetle Base
      </header>
      <main className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4">飼育個体一覧</h2>
        {creatures.map(c => (
          <div key={c.id} className="bg-white p-4 mb-2 rounded-xl shadow">{c.name} - {c.stage}</div>
        ))}
      </main>
      <nav className="bottom-0 w-full bg-white border-t p-3 flex justify-around">
        <button onClick={() => setActiveTab('list')} className="text-emerald-700">一覧</button>
        <button onClick={() => setActiveTab('settings')} className="text-emerald-400">設定</button>
      </nav>
    </div>
  );
}
