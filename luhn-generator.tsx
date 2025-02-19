import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Save, RefreshCw, Download, ArrowLeft } from 'lucide-react';

const LuhnGenerator = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [batchSize, setBatchSize] = useState(1);
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const luhnCheck = (number) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const generateValidNumber = (pattern) => {
    const placeholderRegex = /[x?]/gi;
    
    if (!pattern.match(placeholderRegex) && !pattern.match(/^\d+$/)) {
      throw new Error('Input must contain only digits and placeholders (x or ?)');
    }

    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      let candidate = pattern.replace(placeholderRegex, () => 
        Math.floor(Math.random() * 10).toString()
      );

      if (luhnCheck(candidate)) {
        return candidate;
      }
      attempts++;
    }

    throw new Error('Could not generate a valid number. Please try again.');
  };

  const handleGenerate = () => {
    try {
      if (!input.trim()) {
        throw new Error('Please enter a card pattern');
      }

      const size = Math.min(Math.max(parseInt(batchSize) || 1, 1), 100);
      const results = new Set(); // Use Set to ensure unique numbers

      while (results.size < size) {
        try {
          const result = generateValidNumber(input.trim());
          results.add(result);
        } catch (err) {
          if (results.size === 0) {
            throw err;
          }
          break;
        }
      }

      setOutputs(Array.from(results));
      setError('');
      setIsCopied(false);
    } catch (err) {
      setError(err.message);
      setOutputs([]);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutputs([]);
    setError('');
    setIsCopied(false);
    setBatchSize(1);
  };

  const handleCopy = async () => {
    if (outputs.length > 0) {
      await navigator.clipboard.writeText(outputs.join('\n'));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (outputs.length > 0) {
      const blob = new Blob([outputs.join('\n')], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-numbers.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-8 text-white hover:text-gray-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Number Generator
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Generate valid numbers using the Luhn algorithm
        </p>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Enter pattern (use x or ? for placeholders):
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 4532xxxx????8745"
                  className="font-mono bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Number of cards to generate (1-100):
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleGenerate} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <Button 
                onClick={handleClear} 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Clear
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800">
                <AlertDescription className="text-white">{error}</AlertDescription>
              </Alert>
            )}

            {outputs.length > 0 && (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto p-4 bg-gray-900 rounded-md border border-gray-700">
                  {outputs.map((output, index) => (
                    <p key={index} className="font-mono text-lg break-all text-white mb-2">
                      {index + 1}. {output}
                    </p>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleCopy} 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {isCopied ? (
                      <>
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LuhnGenerator;
