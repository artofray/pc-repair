import React, { useState } from 'react';
import { type UserFeedback, type UserFeedbackType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface UserFeedbackControlsProps {
  onSubmit: (feedback: UserFeedback) => void;
}

const UserFeedbackControls: React.FC<UserFeedbackControlsProps> = ({ onSubmit }) => {
  const [errorDescription, setErrorDescription] = useState('');
  const [showErrorInput, setShowErrorInput] = useState(false);

  const handleSuccess = () => {
    onSubmit({ type: 'success' });
    setShowErrorInput(false);
    setErrorDescription('');
  };

  const handleErrorClick = () => {
    if (showErrorInput) {
      // If form is already open, submit it
      onSubmit({ type: 'error', message: errorDescription });
      setShowErrorInput(false);
      setErrorDescription('');
    } else {
      // Otherwise, just show the form
      setShowErrorInput(true);
    }
  };

  return (
    <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
      <h4 className="font-semibold text-center text-slate-300 mb-3">Did the step above work?</h4>
      
      {showErrorInput && (
         <div className="mb-4">
            <label htmlFor="error-description" className="block text-sm font-medium text-slate-400 mb-1">
              Optional: Paste any error messages or describe what happened
            </label>
            <textarea
              id="error-description"
              value={errorDescription}
              onChange={(e) => setErrorDescription(e.target.value)}
              placeholder="e.g., 'Access Denied', 'File not found...'"
              className="w-full h-24 p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 resize-none text-slate-200 placeholder-slate-500"
            />
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={handleSuccess}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-all"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Yes, it worked!
        </button>
        <button
          onClick={handleErrorClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all"
        >
          <XCircleIcon className="w-5 h-5" />
          {showErrorInput ? 'Submit Error Report' : 'No, I got an error'}
        </button>
      </div>
    </div>
  );
};

export default UserFeedbackControls;
