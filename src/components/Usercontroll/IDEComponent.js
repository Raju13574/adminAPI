import React, { useState, useEffect } from 'react';
import { Play, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../api/config';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css'; // You can choose a different theme

const defaultCodes = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!";
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `print("Hello, World!")`,
  javascript: `console.log("Hello, World!");`
};

// Move LineNumberedEditor outside of IDEComponent
const LineNumberedEditor = ({ value, onValueChange, language }) => {
  const lines = (value || '').split('\n');
  const [cursorLine, setCursorLine] = useState(1);

  const handleCursorChange = (editor) => {
    if (editor && editor.getCursor) {
      const lineNumber = editor.getCursor().line + 1;
      setCursorLine(lineNumber);
    }
  };

  return (
    <div className="relative flex h-full">
      <div className="text-gray-500 text-right pr-3 select-none" style={{ width: '3em' }}>
        {lines.map((_, i) => (
          <div 
            key={i + 1} 
            className={`${cursorLine === i + 1 ? 'bg-gray-700' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <Editor
        value={value || ''}
        onValueChange={onValueChange}
        onCursor={handleCursorChange}
        highlight={code => {
          try {
            return highlight(code || '', languages[language] || languages.javascript)
          } catch (e) {
            console.error('Highlight error:', e);
            return code || '';
          }
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: 'transparent',
          color: '#d4d4d4',
          flex: 1,
          minHeight: '100%',
        }}
        textareaClassName="focus:outline-none bg-transparent w-full h-full resize-none"
        preClassName={`language-${language} ${cursorLine ? 'active-line' : ''}`}
      />
    </div>
  );
};

const IDEComponent = ({ inDashboard = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialLanguage = queryParams.get('language') || 'python';

  const [currentLanguage, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(defaultCodes[initialLanguage]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);  // Changed to null initially
  const [isCodeExecuted, setIsCodeExecuted] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  const supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'c'];

  useEffect(() => {
    setLanguage(initialLanguage);
    setCode(defaultCodes[initialLanguage]);
  }, [initialLanguage]);

  useEffect(() => {
    setCode(defaultCodes[currentLanguage]);
  }, [currentLanguage]);

  useEffect(() => {
    let timer;
    if (isLoading) {
      const startTime = Date.now();
      timer = setInterval(() => {
        setLoadingTime((Date.now() - startTime) / 1000);
      }, 50); // Update more frequently for smoother counter
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const parseErrorMessage = (error) => {
    if (typeof error === 'string') {
      // If it's a string, try to parse it as JSON
      try {
        const parsedError = JSON.parse(error);
        return parsedError.error || error;
      } catch {
        // If parsing fails, return the original string
        return error;
      }
    }
    if (error.response && error.response.data) {
      // If it's an axios error object
      const data = error.response.data;
      if (typeof data === 'string') {
        try {
          const parsedData = JSON.parse(data);
          return parsedData.error || data;
        } catch {
          return data;
        }
      }
      return data.error || 'An unexpected error occurred';
    }
    if (error.message) {
      // If it's a regular Error object
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const handleCompile = async () => {
    setIsLoading(true);
    setError(null);
    setOutput('');
    setExecutionTime(0);  // Start at 0
    setLoadingTime(0);    // Reset loading time
    setIsCodeExecuted(false);
    
    const startTime = Date.now();

    try {
      const response = await API.executeCode(currentLanguage, code, input);
      
      if (response.error) {
        setError(response.error);
        setOutput(`Error: ${response.error}`);
      } else {
        setOutput(response.result || '');
        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000;
        setExecutionTime(parseFloat(totalTime.toFixed(3)));
      }
      setIsCodeExecuted(true);
    } catch (error) {
      const errorMessage = parseErrorMessage(error);
      setError(errorMessage);
      setOutput(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const getOutputText = () => {
    if (!isCodeExecuted) return output;
    if (executionTime === null || isNaN(executionTime)) return output;
    return `${output}\n\n${executionTime.toFixed(3)} seconds`;
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-gray-800">
        {!inDashboard && (
          <button
            onClick={goToDashboard}
            className="text-white p-2 rounded-full transition duration-150 hover:bg-gray-700"
            aria-label="Go to Dashboard"
          >
            <LayoutDashboard size={24} />
          </button>
        )}
        <h2 className="text-2xl font-bold">NeXTerChat Compiler API</h2>
        <div className="flex items-center">
          <select
            value={currentLanguage}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(defaultCodes[e.target.value]);
            }}
            className="bg-gray-700 text-white p-2 rounded mr-4"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={handleCompile}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-150"
            aria-label="Run code"
            disabled={isLoading}
          >
            <Play size={20} />
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow flex overflow-hidden p-2">
        {/* Code Editor */}
        <div className="w-3/5 pr-4 flex flex-col overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Editor</h3>
          <div className="flex-grow overflow-auto bg-gray-800 border border-gray-600 rounded">
            <LineNumberedEditor
              value={code}
              onValueChange={setCode}
              language={currentLanguage}
            />
          </div>
        </div>
        
        {/* Input and Output */}
        <div className="w-2/5 flex flex-col">
          {/* Input */}
          <div className="h-1/2 pb-2">
            <h3 className="text-lg font-semibold mb-2">Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Input (if needed)"
              className="w-full h-[calc(100%-2rem)] bg-gray-800 text-white border border-gray-600 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Output */}
          <div className="h-1/2 pt-2">
            <h3 className="text-lg font-semibold mb-2">Output</h3>
            {isLoading ? (
              <div className="w-full h-[calc(100%-2rem)] bg-gray-800 text-white border border-gray-600 rounded p-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-lg font-semibold">Nexterchat Finalizing your output...</p>
                  <p className="text-sm mt-2">
                    {loadingTime.toFixed(3)}s
                  </p>
                </div>
              </div>
            ) : (
              <textarea
                value={getOutputText()}
                readOnly
                placeholder="Code output will appear here"
                className="w-full h-[calc(100%-2rem)] bg-gray-800 text-white border border-gray-600 rounded p-2 resize-none focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-600 text-white p-2 text-center">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default IDEComponent;
