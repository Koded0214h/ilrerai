import { useState } from 'react';
import { Phone, Hash, ArrowRight } from 'lucide-react';

export default function USSDSimulator() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ussdCode, setUssdCode] = useState('*347*22#');
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'system', text: string}>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startUSSD = async () => {
    if (!phoneNumber) return;
    
    setLoading(true);
    setSessionActive(true);
    setConversation([{type: 'user', text: `Dialing ${ussdCode}...`}]);
    
    try {
      const response = await fetch('/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          serviceCode: ussdCode,
          phoneNumber,
          text: ''
        })
      });
      
      const result = await response.text();
      const message = result.replace('CON ', '').replace('END ', '');
      
      setConversation(prev => [...prev, {type: 'system', text: message}]);
      
      if (result.startsWith('END')) {
        setSessionActive(false);
      }
    } catch (error) {
      setConversation(prev => [...prev, {type: 'system', text: 'Service unavailable'}]);
      setSessionActive(false);
    } finally {
      setLoading(false);
    }
  };

  const sendInput = async () => {
    if (!currentInput || !sessionActive) return;
    
    setLoading(true);
    const userText = conversation.length > 1 ? 
      conversation.filter(c => c.type === 'user' && c.text !== `Dialing ${ussdCode}...`)
        .map(c => c.text).join('*') + '*' + currentInput :
      currentInput;
    
    setConversation(prev => [...prev, {type: 'user', text: currentInput}]);
    
    try {
      const response = await fetch('/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          serviceCode: ussdCode,
          phoneNumber,
          text: userText
        })
      });
      
      const result = await response.text();
      const message = result.replace('CON ', '').replace('END ', '');
      
      setConversation(prev => [...prev, {type: 'system', text: message}]);
      
      if (result.startsWith('END')) {
        setSessionActive(false);
      }
    } catch (error) {
      setConversation(prev => [...prev, {type: 'system', text: 'Service unavailable'}]);
      setSessionActive(false);
    } finally {
      setLoading(false);
      setCurrentInput('');
    }
  };

  const resetSession = () => {
    setConversation([]);
    setSessionActive(false);
    setCurrentInput('');
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">USSD Simulator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Phone Setup */}
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Phone Setup
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="08012345678"
                disabled={sessionActive}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">USSD Code</label>
              <div className="flex items-center">
                <Hash className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={ussdCode}
                  onChange={(e) => setUssdCode(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={sessionActive}
                />
              </div>
            </div>
            
            <button
              onClick={sessionActive ? resetSession : startUSSD}
              disabled={!phoneNumber || loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base touch-manipulation min-h-[44px]"
            >
              {sessionActive ? 'End Session' : 'Dial USSD Code'}
            </button>
          </div>
        </div>

        {/* USSD Screen */}
        <div className="bg-gray-900 text-green-400 p-4 sm:p-6 rounded-lg font-mono text-sm">
          <div className="bg-gray-800 p-3 rounded mb-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {conversation.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Enter phone number and dial USSD code to start
              </div>
            ) : (
              <div className="space-y-2">
                {conversation.map((msg, index) => (
                  <div key={index} className={`${msg.type === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                    <span className="text-gray-500">{msg.type === 'user' ? '> ' : '< '}</span>
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div className="text-yellow-400">
                    <span className="text-gray-500">&lt; </span>
                    Processing...
                  </div>
                )}
              </div>
            )}
          </div>
          
          {sessionActive && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Input:</span>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendInput()}
                className="flex-1 bg-gray-800 text-green-400 p-2 rounded border border-gray-600 focus:border-green-400 outline-none"
                placeholder="Enter option..."
                disabled={loading}
              />
              <button
                onClick={sendInput}
                disabled={!currentInput || loading}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 touch-manipulation"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How to Use USSD Service:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Dial <strong>*347*22#</strong> from any mobile phone</p>
          <p>• Follow menu options to navigate</p>
          <p>• Press 0 to go back to previous menu</p>
          <p>• Service works on all networks without internet</p>
        </div>
      </div>
    </div>
  );
}