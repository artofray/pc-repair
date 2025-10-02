import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { HardDriveIcon } from './icons/HardDriveIcon';
import { ChipIcon } from './icons/ChipIcon';
import { SlidersIcon } from './icons/SlidersIcon';

interface QuickAction {
  label: string;
  prompt: string;
  icon: React.ElementType;
}

const actions: QuickAction[] = [
  {
    label: 'Repair System Files',
    prompt: 'My computer is behaving strangely, and I suspect system files might be corrupted. Please provide steps to scan and repair them.',
    icon: HardDriveIcon,
  },
  {
    label: 'Scan for Viruses',
    prompt: 'I think my PC might have a virus. Can you give me a guide on how to perform a deep scan and remove any threats?',
    icon: ShieldCheckIcon,
  },
  {
    label: 'Update Drivers',
    prompt: 'Some of my hardware (like graphics card or Wi-Fi) is not working correctly. I need instructions on how to check for and install driver updates.',
    icon: ChipIcon,
  },
  {
    label: 'Advanced Issues',
    prompt: 'I am an advanced user and I\'m facing a complex issue that might require boot repair, registry editing, or even an OS reinstall. Please guide me through advanced troubleshooting steps.',
    icon: SlidersIcon,
  },
];

interface QuickActionsProps {
  onAction: (prompt: string) => void;
  isLoading: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, isLoading }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-slate-300 mb-3 text-center">Quick Diagnostics</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action.prompt)}
            disabled={isLoading}
            className="group flex flex-col items-center justify-center text-center p-4 bg-slate-800/60 border border-slate-700 rounded-lg hover:bg-slate-700/80 hover:border-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/60 disabled:hover:border-slate-700"
          >
            <action.icon className="w-8 h-8 mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="font-medium text-slate-200 text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;