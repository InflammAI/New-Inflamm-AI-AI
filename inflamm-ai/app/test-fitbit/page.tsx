'use client';

import React, { useState } from 'react';

export default function TestFitbitPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFitbitConnection = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/wearable/connect/fitbit');
      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Success! Authorization URL: ${data.url}\nState: ${data.state}`);
        
        // Test redirect to Fitbit
        window.location.href = data.url;
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fitbit Integration Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test OAuth Connection</h2>
          
          <button
            onClick={testFitbitConnection}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Fitbit Connection'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Environment Variables:</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>Client ID:</strong> 23TVT6 ✓</p>
            <p><strong>Client Secret:</strong> 65be3e30e3b339fd393d81a834af5096 ✓</p>
            <p><strong>Redirect URI:</strong> http://localhost:3000/api/auth/fitbit/callback</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Expected Flow:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
            <li>Click "Test Fitbit Connection"</li>
            <li>Redirect to Fitbit OAuth page</li>
            <li>Grant permissions</li>
            <li>Redirect back to callback URL</li>
            <li>Exchange code for tokens</li>
            <li>Store tokens securely</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
