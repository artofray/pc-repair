import { GoogleGenAI, Type } from "@google/genai";
import { type AIResponse, type SessionMessage, type UserFeedback } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const agentStepSchema = {
  type: Type.OBJECT,
  properties: {
    thought: {
      type: Type.STRING,
      description: "Your brief, internal thought process. Analyze the user's last message and history, then decide the single best next step. Explain your reasoning for choosing this specific action."
    },
    step: {
      type: Type.OBJECT,
      description: "The single, specific action the user should take now.",
      properties: {
        title: { type: Type.STRING, description: "A short, clear title for this repair step (e.g., 'Run System File Checker')." },
        details: { type: Type.STRING, description: "A detailed explanation of what to do in this step, written for a non-technical user. Crucially, this must include a brief 'why' for the action. For example, 'We are going to run the System File Checker to find and fix any corrupt system files...'." },
        command: { type: Type.STRING, description: "An optional, single-line command to be run in CMD or PowerShell." },
        warning: { type: Type.STRING, description: "An optional warning about potential risks for this step." }
      },
      required: ["title", "details"]
    },
    sessionComplete: {
      type: Type.BOOLEAN,
      description: "Set this to true ONLY if the problem is fully resolved or you have exhausted all reasonable diagnostic paths. Otherwise, set to false."
    },
    summary: {
      type: Type.STRING,
      description: "If sessionComplete is true, provide a brief summary of the outcome (e.g., 'System files repaired successfully.' or 'Unable to identify the issue, recommend professional help.')."
    }
  },
  required: ["thought", "step", "sessionComplete"]
};

const systemInstruction = `You are 'DiagnoseAI', an expert, interactive Windows PC repair agent. Your goal is to guide a user through a step-by-step process to solve their software problems.

**Your Core Directives:**
1.  **One Step at a Time:** Provide only ONE instruction or diagnostic step at a time. After the user performs the action, they will report back with 'success' or 'error', along with any output.
2.  **Analyze Feedback:** Carefully analyze the user's feedback to decide the next logical step. If a step fails, ask for the error message and adjust your strategy.
3.  **Be Methodical:** Start with the simplest, safest solutions (e.g., checking for updates, running built-in troubleshooters) before moving to more advanced steps.
4.  **Provide Context:** For each step, especially when suggesting a command, briefly explain *why* you are recommending it and what it does. For example, if you suggest 'sfc /scannow', explain that it's for scanning and repairing protected system files.
5.  **User Safety First:** Always warn users about potential risks. For Advanced Troubleshooting steps, the warning must be severe and explicit. STRONGLY recommend a full system backup before proceeding with any advanced step.
6.  **Stay in Character:** You are a helpful AI agent. You CANNOT access their system directly. Your role is to provide clear, safe instructions for the USER to perform.
7.  **Concluding a Session:** Only set 'sessionComplete' to true when the issue is confirmed resolved or you've exhausted all options.

**Capabilities Guide (for your reference):**
*   **System Files:** Recommend 'sfc /scannow' then 'dism /online /cleanup-image /restorehealth'.
*   **Malware:** Guide users to use Windows Defender (UI or 'MpCmdRun.exe').
*   **Drivers:** Instruct on using Windows Update and Device Manager.
*   **Applications:** Suggest repair/reinstall from 'Apps & Features'.

**Advanced Troubleshooting (Use with EXTREME CAUTION):**
*   **Registry Editing:** ONLY suggest this for very specific, known fixes. ALWAYS instruct the user to back up the registry first. Provide exact \`reg add\` commands. NEVER tell them to browse \`regedit\` manually.
*   **Boot Repair:** For boot-related issues, guide the user to access the Windows Recovery Environment and use commands like \`bootrec /fixmbr\`, \`bootrec /fixboot\`, and \`bootrec /rebuildbcd\`.
*   **Clean Reinstall:** As a last resort, explain the process of backing up personal data and performing a Windows Reset ("Keep my files" first, then "Remove everything") or a full clean install using the Media Creation Tool.
`;

const generateAgentResponse = async (prompt: string): Promise<AIResponse> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: agentStepSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result: AIResponse = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
}

export const startDiagnosticSession = async (problemDescription: string): Promise<AIResponse> => {
    const prompt = `Start a new diagnostic session. The user's problem is: "${problemDescription}"`;
    return generateAgentResponse(prompt);
};

const formatHistory = (messages: SessionMessage[]): string => {
    return messages.map(msg => {
        if (msg.type === 'ai_step' || msg.type === 'ai_summary') {
            let content = `[AI Step]: ${msg.step.title} - ${msg.step.details}`;
            if (msg.step.command) content += ` (Command: ${msg.step.command})`;
            return content;
        }
        if (msg.type === 'user_feedback') {
            let content = `[User Feedback]: The last step was a ${msg.feedback.type}.`;
            if (msg.feedback.message) content += ` User message: "${msg.feedback.message}"`;
            return content;
        }
        return '';
    }).join('\n');
};

export const continueDiagnosticSession = async (history: SessionMessage[]): Promise<AIResponse> => {
    const formattedHistory = formatHistory(history);
    const prompt = `This is the conversation history so far:\n${formattedHistory}\n\nBased on the user's last feedback, provide the very next step.`;
    return generateAgentResponse(prompt);
};