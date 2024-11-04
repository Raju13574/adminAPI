import React, { useState, useEffect } from 'react';
import API from '../../api/config';
import { ClipboardIcon, CheckIcon } from 'lucide-react';

function Integrations({ user }) {
  const [credentials, setCredentials] = useState({ 
    clientId: '', 
    clientSecret: '' 
  });
  const [copiedField, setCopiedField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await API.getClientCredentials();
        console.log('API response:', response);
        if (response.data && response.data.clientId && response.data.clientSecret) {
          setCredentials({
            clientId: response.data.clientId,
            clientSecret: response.data.clientSecret
          });
        } else {
          console.error('Unexpected API response structure:', response);
          setError('Failed to fetch credentials. Unexpected response structure.');
        }
      } catch (err) {
        console.error('Error fetching credentials:', err);
        setError('Failed to fetch credentials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  if (isLoading) {
    return <div>Loading credentials...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your API Credentials</h2>
      <div className="space-y-3">
        {['clientId', 'clientSecret'].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {field === 'clientId' ? 'Client ID' : 'Client Secret'}
            </label>
            <div className="flex items-center">
              <span className="bg-gray-100 p-2 rounded-l border border-gray-300 inline-block w-auto">
                {credentials[field] || 'Not available'}
              </span>
              <button
                onClick={() => copyToClipboard(credentials[field], field)}
                className="p-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 transition duration-150"
              >
                {copiedField === field ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">How to use</h3>
        <p className="mb-2">
          Use these credentials to authenticate your API requests. Include them in the header of your API calls as follows:
        </p>
        <div className="flex items-center bg-gray-200 p-3 rounded">
          <code className="flex-grow overflow-x-auto">
            X-API-Key: {credentials.clientId}:{credentials.clientSecret}
          </code>
          <button
            onClick={() => copyToClipboard(`${credentials.clientId}:${credentials.clientSecret}`, 'fullApiKey')}
            className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-150 ml-2"
          >
            {copiedField === 'fullApiKey' ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <ClipboardIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-4 font-semibold">
          Keep your Client Secret secure and do not share it publicly.
        </p>
      </div>
    </div>
  );
}

export default Integrations;
