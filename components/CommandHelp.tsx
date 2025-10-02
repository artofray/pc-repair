import React, { useState } from 'react';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

export const CommandHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 bg-slate-900/50 rounded-lg border border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
        aria-expanded={isOpen}
        aria-controls="command-help-content"
      >
        <div className="flex items-center">
          <HelpCircleIcon className="w-5 h-5 mr-3 text-cyan-400" />
          <span className="font-semibold text-slate-200">How to Run Commands</span>
        </div>
        <ChevronRightIcon
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>
      {isOpen && (
        <div id="command-help-content" className="px-4 pb-4 border-t border-slate-700">
          <ol className="list-decimal list-inside space-y-3 mt-4 text-slate-300">
            <li>
              <strong>Open the Start Menu:</strong> Click the Windows icon in the bottom-left corner.
            </li>
            <li>
              <strong>Search for Terminal:</strong> Type <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">Terminal</code>, <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">cmd</code>, or <code className="bg-slate-700 text-cyan-300 px-1 py-0.5 rounded">PowerShell</code> into the search bar. We recommend using 'Terminal'.
            </li>
            <li>
              <strong>Run as Administrator:</strong> Right-click on the app icon (e.g., "Terminal") and select "Run as administrator". This is crucial for many system commands to work correctly.
            </li>
            <li>
              <strong>Paste and Run Command:</strong> Copy the command from a repair step, paste it into the terminal window (usually by right-clicking), and then press the <strong>Enter</strong> key to execute it.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default CommandHelp;
