import React, { useState, useEffect } from 'react';
import { Bug, GitBranch, Table, Plus, Zap, Settings, Download, Upload } from 'lucide-react';

// --- データ生成 ---
const generateCreatures = () => {
  const data = [];
  const stages = ['幼虫', '蛹', '成虫'];
  for (let i = 1; i <= 3; i++) {
    data.push({
      id: i.toString(),
      name: `個体 ${i}号`,
      species: 'オオクワガタ',
      origin: '福岡県久留米市',
      gender: i % 2 === 0 ? 'male' : 'female',
      generation: 'F5',
      exchangeHistory: [{ date: '2026-06-02', size: '10g' }],
      stage: stages[i % 3],
      inbreedingRate: 25.0
    });
  }
  return data;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCreatureName, setNewCreatureName] = useState('');
  const [creatures, setCreatures] = useState(() => {
    const saved = localStorage.getItem('beetle_data');
    return saved ? JSON.parse(saved) : generateCreatures();
  });

  useEffect(() => {
    localStorage.setItem('beetle_data', JSON.stringify(creatures));
  }, [creatures]);

  // 新規追加ロジック
  const handleAddCreature = () => {
    if (!newCreatureName) return;
    const newCreature = {
      id: Date.now().toString(),
      name: newCreatureName,
      species: 'オオクワガタ',
      origin: '未設定',
      gender: 'male',
      generation: 'F1',
      exchangeHistory: [],
      stage: '幼虫',
      inbreedingRate: 0
    };
    setCreatures([newCreature, ...creatures]);
    setNewCreatureName('');
    setIsModalOpen(false);
  };

  // データ管理ロジック
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(creatures));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "beetle_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setCreatures(JSON.parse(e.target.result));
        alert("データを復元しました");
      } catch (err) { alert("形式エラー"); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen bg-emerald-50 text-emerald-950 flex flex-col">
      <header className="bg-emerald-900 text-amber-400 p-4 font-bold flex items-center shadow-md">
        <Bug className="mr-2" /> Beetle Base
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">飼育個体一覧</h2>
              <button onClick={() => setIsModalOpen(true)} className="bg-emerald-700 text-white p-2 rounded-full">
                <Plus size={24} />
              </button>
            </div>
            {creatures.map(c => (
              <div key={c.id} className="bg-white p-4 rounded-xl shadow border border-emerald-100">
                <div className="font-bold text-emerald-800">{c.name}</div>
                <div className="text-sm text-emerald-600">ステージ: {c.stage} | 累代: {c.generation}</div>
              </div>
            ))}
          </div>
        )}

        {/* 新規追加モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm space-y-4">
              <h3 className="font-bold text-lg">個体を追加</h3>
              <input 
                type="text" 
                placeholder="個体名 (例: 11号)"
                className="w-full p-3 border rounded-lg"
                value={newCreatureName}
                onChange={(e) => setNewCreatureName(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 p-3 bg-gray-200 rounded-lg">キャンセル</button>
                <button onClick={handleAddCreature} className="flex-1 p-3 bg-emerald-700 text-white rounded-lg">登録</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="font-bold text-lg text-emerald-900">データ管理</h2>
            <button onClick={exportData} className="w-full bg-emerald-700 text-white p-4 rounded-xl flex items-center justify-center gap-2">
              <Download /> データをバックアップ
            </button>
            <label className="w-full bg-amber-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
              <Upload /> データを復元
              <input type="file" onChange={importData} className="hidden" accept=".json" />
            </label>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-emerald-200 flex justify-around p-3 z-50">
        <NavButton active={activeTab === 'list'} onClick={() => setActiveTab('list')} icon={<Table />} label="一覧" />
        <NavButton active={activeTab === 'pedigree'} onClick={() => setActiveTab('pedigree')} icon={<GitBranch />} label="血統" />
        <NavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} icon={<Zap />} label="シミュ" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="設定" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center w-full ${active ? 'text-emerald-700' : 'text-emerald-400'}`}>
      {React.cloneElement(icon, { size: 22 })}
      <span className="text-[10px] mt-1 font-bold">{label}</span>
    </button>
  );
}
