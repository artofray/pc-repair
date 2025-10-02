import React, { useState } from 'react';
import QuickActions from './QuickActions';

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  isLoading: boolean;
}

const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, isLoading }) => {
  const [problem, setProblem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(problem);
  };

  const handleQuickAction = (prompt: string) => {
    setProblem(prompt);
    onSubmit(prompt);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-2xl shadow-slate-950/50 mb-8">
      <QuickActions onAction={handleQuickAction} isLoading={isLoading} />
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-800/50 px-2 text-sm text-slate-400 backdrop-blur-sm rounded-full">OR</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="problem-description" className="block text-lg font-medium text-slate-300 mb-2">
          Describe a Custom Problem
        </label>
        <textarea
          id="problem-description"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g., 'My computer is running very slow', 'I keep getting a blue screen error', 'Chrome browser keeps crashing'..."
          className="w-full h-32 p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none text-slate-200 placeholder-slate-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !problem.trim()}
          className="mt-4 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Run Diagnostics for Custom Problem'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProblemInput;