// components/AiAssistant.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://ez-health-server.vercel.app/api/v1/ai/symptom-check',
        { message: input }
      );
      setResponse(res.data.response || res.data.message);
    } catch (err) {
      if (err.response?.status === 429) {
        setResponse(
          "⚠️ You've exceeded your Gemini API quota. Please try again later or upgrade your plan."
        );
      } else {
        setResponse('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setOpen(!open)}
        className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
        🧠 AI Symptom Checker
      </button>
      {open && (
        <div className="w-96 bg-white border shadow-lg p-4 rounded-lg mt-2 space-y-2">
          <textarea
            rows="4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            className="w-full border p-2 rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-3 py-1 rounded">
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
          {response && (
            <div className="bg-gray-100 p-2 rounded text-sm whitespace-pre-line">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
