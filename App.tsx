import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import ProblemInput from './components/ProblemInput';
import InteractiveDisplay from './components/DiagnosticsDisplay';
import { type SessionMessage, type UserFeedback } from './types';
import { startDiagnosticSession, continueDiagnosticSession } from './services/geminiService';

const App: React.FC = () => {
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages]);

  const handleDiagnose = useCallback(async (problem: string) => {
    if (!problem.trim()) {
      setError("Please describe your PC problem before running diagnostics.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSessionMessages([]);

    try {
      const initialResponse = await startDiagnosticSession(problem);
      setSessionMessages([
          {
              id: Date.now().toString(),
              type: 'ai_step',
              ...initialResponse
          }
      ]);
    } catch (err) {
      console.error("Diagnostic error:", err);
      setError("Failed to start diagnostics. The AI may be overloaded or an error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserFeedback = useCallback(async (feedback: UserFeedback) => {
    setIsLoading(true);
    setError(null);

    const updatedMessages: SessionMessage[] = [
        ...sessionMessages,
        {
            id: Date.now().toString() + '-user',
            type: 'user_feedback',
            feedback,
        }
    ];
    setSessionMessages(updatedMessages);

    try {
        const nextStep = await continueDiagnosticSession(updatedMessages);
        setSessionMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: nextStep.sessionComplete ? 'ai_summary' : 'ai_step',
            ...nextStep
        }]);
    } catch (err) {
        console.error("Diagnostic continuation error:", err);
        setError("Failed to get the next step. Please try providing feedback again.");
    } finally {
        setIsLoading(false);
    }
  }, [sessionMessages]);

  return (
    <div className="min-h-screen bg-slate-900/50 text-slate-200 font-sans from-slate-900 via-slate-950 to-black bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <main>
          <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
            Choose a common task, describe your problem, or select 'Advanced Issues' for complex repairs. Our AI will analyze the situation and begin an interactive, step-by-step repair session.
          </p>
          <ProblemInput onSubmit={handleDiagnose} isLoading={isLoading} />
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <InteractiveDisplay 
            messages={sessionMessages} 
            isLoading={isLoading} 
            onFeedback={handleUserFeedback}
          />
        </main>
      </div>
       <footer className="text-center py-4 mt-8">
        <p className="text-xs text-slate-600">
          Disclaimer: This tool provides AI-generated suggestions. Always back up your data before attempting any repairs. Use at your own risk.
        </p>
      </footer>
       <div ref={bottomOfChatRef} />
    </div>
  );
};

export default App;