import React from 'react';
import { type SessionMessage, type UserFeedback } from '../types';
import { WarningIcon } from './icons/WarningIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CommandHelp } from './CommandHelp';
import UserFeedbackControls from './UserFeedbackControls';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface InteractiveDisplayProps {
  messages: SessionMessage[];
  isLoading: boolean;
  onFeedback: (feedback: UserFeedback) => void;
}

const CommandBlock: React.FC<{ command: string }> = ({ command }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-3 bg-slate-900/70 p-3 rounded-md border border-slate-700 font-mono text-sm">
            <div className="flex justify-between items-center">
                <span className="text-cyan-300 break-words pr-2">{command}</span>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    aria-label="Copy command"
                >
                    <ClipboardIcon className="w-4 h-4" />
                </button>
            </div>
            {copied && <span className="text-xs text-green-400 block text-right pt-1">Copied!</span>}
        </div>
    );
};

const AIStepView: React.FC<{ message: SessionMessage & { type: 'ai_step' | 'ai_summary' } }> = ({ message }) => {
    const { step, summary } = message;
    return (
        <div className="flex items-start gap-4">
            <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
                <BotIcon className="w-6 h-6 text-cyan-400"/>
            </div>
            <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-cyan-400 mb-1">{step.title}</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{step.details}</p>
                {step.command && <CommandBlock command={step.command} />}
                {step.warning && (
                    <div className="mt-3 bg-amber-900/30 border border-amber-700/50 text-amber-300 px-3 py-2 rounded-md text-sm flex items-start">
                        <WarningIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{step.warning}</span>
                    </div>
                )}
                 {summary && (
                    <div className="mt-4 bg-green-900/30 border-t-2 border-green-700/50 p-3 rounded-b-md text-sm text-green-300 flex items-center">
                       <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                       <strong>Session Complete:</strong> <span className='ml-2'>{summary}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const UserFeedbackView: React.FC<{ message: SessionMessage & { type: 'user_feedback' } }> = ({ message }) => {
    const { feedback } = message;
    const statusClass = feedback.type === 'success' ? 'text-green-400' : 'text-red-400';
    const statusText = feedback.type === 'success' ? 'Step Succeeded' : 'Reported an Error';
    
    return (
         <div className="flex items-start gap-4 justify-end">
             <div className="flex-1 max-w-2xl bg-slate-900 p-4 rounded-lg border border-slate-700">
                <p className={`font-semibold mb-2 ${statusClass}`}>{statusText}</p>
                {feedback.message ? (
                    <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm bg-black/20 p-2 rounded-md">{feedback.message}</p>
                ) : (
                     <p className="text-slate-400 italic">No message provided.</p>
                )}
            </div>
            <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
                <UserIcon className="w-6 h-6 text-slate-400"/>
            </div>
        </div>
    )
}

const InteractiveDisplay: React.FC<InteractiveDisplayProps> = ({ messages, isLoading, onFeedback }) => {
  if (!messages.length && !isLoading) {
     return (
         <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-500">Awaiting Diagnostics</h2>
            <p className="text-slate-400 mt-2">Your interactive repair session will appear here.</p>
        </div>
    );
  }

  const lastMessage = messages[messages.length - 1];
  const isSessionActive = lastMessage?.type === 'ai_step';
  const hasCommands = messages.some(msg => msg.type === 'ai_step' && !!msg.step.command);

  return (
    <div className="mt-8">
        <div className="space-y-6">
            {messages.map((message) => {
                switch(message.type) {
                    case 'ai_step':
                    case 'ai_summary':
                        return <AIStepView key={message.id} message={message} />;
                    case 'user_feedback':
                        return <UserFeedbackView key={message.id} message={message} />;
                    default:
                        return null;
                }
            })}
        </div>
        
        {isLoading && (
             <div className="flex items-start gap-4 mt-6">
                <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
                    <BotIcon className="w-6 h-6 text-cyan-400 animate-pulse"/>
                </div>
                <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                   <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-700 rounded"></div>
                          <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                     <p className='text-sm text-slate-400 mt-2'>AI is thinking...</p>
                </div>
            </div>
        )}

        {isSessionActive && !isLoading && (
            <div className="mt-6">
                {hasCommands && <CommandHelp />}
                <UserFeedbackControls onSubmit={onFeedback} />
            </div>
        )}
    </div>
  );
};

export default InteractiveDisplay;
