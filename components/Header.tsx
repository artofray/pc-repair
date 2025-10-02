import React from 'react';
import { ToolsIcon } from './icons/ToolsIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center justify-center bg-slate-800 p-4 rounded-full mb-4 border-2 border-slate-700 shadow-lg shadow-cyan-500/10">
        <ToolsIcon className="w-10 h-10 text-cyan-400" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
        PC Repair AI Diagnostics
      </h1>
    </header>
  );
};

export default Header;