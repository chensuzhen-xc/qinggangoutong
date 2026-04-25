'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, RefreshCw, History, Trash2, User, Shirt, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

// --- Types ---
type TryOnStatus = 'idle' | 'uploading' | 'generating' | 'success' | 'error';
type ClothingType = 'top' | 'bottom' | 'dress';
type InputMode = 'upload' | 'url';

// --- Components ---
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white",
    outline: "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

const UploadZone = ({ onFileSelect, label, icon: Icon }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          onFileSelect(e.dataTransfer.files[0]);
        }
      }}
      className={`
        border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px]
        ${dragOver ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
      `}
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Click to browse or drag and drop</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
      />
    </div>
  );
};

// --- Alert Component ---
const Alert = ({ message, type = 'error' }: { message: string; type?: 'error' | 'warning' | 'info' }) => {
  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200'
  };
  
  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${colors[type]}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default function VirtualTryOnPage() {
  // --- State ---
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [personImageUrl, setPersonImageUrl] = useState<string>('');
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);
  const [clothingImageUrl, setClothingImageUrl] = useState<string>('');
  const [clothingType, setClothingType] = useState<ClothingType>('top');
  const [status, setStatus] = useState<TryOnStatus>('idle');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; result: string; timestamp: number }>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('url'); // Default to URL for API compatibility

  // --- Debug logging ---
  const debugLog = (...args: any[]) => {
    console.log('[VirtualTryOn]', ...args);
  };

  // --- Handlers ---
  const handlePersonSelect = (file: File) => {
    setPersonImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPersonPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleClothingSelect = (file: File) => {
    setClothingImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setClothingPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    debugLog('Starting generate...');
    setErrorMessage('');
    
    // Get images based on input mode
    let personImg = inputMode === 'url' ? personImageUrl : personPreview;
    let clothingImg = inputMode === 'url' ? clothingImageUrl : clothingPreview;

    if (!personImg || !clothingImg) {
      setErrorMessage('Please provide both person and clothing images');
      debugLog('Error: Missing images');
      return;
    }

    setStatus('generating');
    
    try {
      debugLog('Calling API...');
      
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personImage: personImg,
          clothingImage: clothingImg
        })
      });

      debugLog('API response status:', response.status);
      
      const data = await response.json();
      debugLog('API response data:', data);

      if (data.success && data.resultUrl) {
        setResultImage(data.resultUrl);
        
        const newEntry = {
          id: Math.random().toString(36).substr(2, 9),
          result: data.resultUrl,
          timestamp: Date.now(),
        };
        setHistory([newEntry, ...history]);
        setStatus('success');
        debugLog('Success!');
      } else {
        setErrorMessage(data.error || 'Failed to generate preview');
        setStatus('error');
        debugLog('Error:', data.error);
      }
    } catch (error: any) {
      debugLog('Network error:', error);
      setErrorMessage(error.message || 'Network error - please try again');
      setStatus('error');
    }
  };

  const clearPerson = () => {
    setPersonImage(null);
    setPersonPreview(null);
    setPersonImageUrl('');
  };

  const clearClothing = () => {
    setClothingImage(null);
    setClothingPreview(null);
    setClothingImageUrl('');
  };

  const resetAll = () => {
    setPersonImage(null);
    setPersonPreview(null);
    setPersonImageUrl('');
    setClothingImage(null);
    setClothingPreview(null);
    setClothingImageUrl('');
    setResultImage(null);
    setErrorMessage('');
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">FitVision AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" className="hidden sm:flex">
              <History className="w-4 h-4" />
              My History
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {status === 'idle' && !resultImage && (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              See Clothes On You <br className="hidden sm:block" />
              <span className="text-indigo-600">Before You Buy</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Provide image URLs (or upload photos). Our AI will generate a realistic preview.
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6">
            <Alert message={errorMessage} type="error" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            {status === 'idle' || status === 'generating' || status === 'error' ? (
              <>
                {/* Input Mode Toggle */}
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Mode:</span>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                      <button
                        onClick={() => setInputMode('url')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          inputMode === 'url' 
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        Image URL
                      </button>
                      <button
                        onClick={() => setInputMode('upload')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          inputMode === 'upload' 
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Input Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Person Input */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Your Photo
                      </h3>
                      {(personPreview || personImageUrl) && (
                        <Button variant="danger" size="sm" onClick={clearPerson} className="h-8 px-3 text-xs">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    {inputMode === 'url' ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={personImageUrl}
                          onChange={(e) => setPersonImageUrl(e.target.value)}
                          placeholder="https://example.com/person.jpg"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        {personImageUrl && (
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                            <img src={personImageUrl} alt="Person" className="w-full h-full object-cover" onError={() => setPersonImageUrl('')} />
                          </div>
                        )}
                      </div>
                    ) : personPreview ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                        <img src={personPreview} alt="Person" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <UploadZone label="Upload Your Photo" icon={User} onFileSelect={handlePersonSelect} />
                    )}
                  </div>

                  {/* Clothing Input */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Shirt className="w-4 h-4" />
                        Clothing
                      </h3>
                      {(clothingPreview || clothingImageUrl) && (
                        <Button variant="danger" size="sm" onClick={clearClothing} className="h-8 px-3 text-xs">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                    {inputMode === 'url' ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={clothingImageUrl}
                          onChange={(e) => setClothingImageUrl(e.target.value)}
                          placeholder="https://example.com/clothing.jpg"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        {clothingImageUrl && (
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                            <img src={clothingImageUrl} alt="Clothing" className="w-full h-full object-cover" onError={() => setClothingImageUrl('')} />
                          </div>
                        )}
                      </div>
                    ) : clothingPreview ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                        <img src={clothingPreview} alt="Clothing" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <UploadZone label="Upload Clothing" icon={Shirt} onFileSelect={handleClothingSelect} />
                    )}
                  </div>
                </div>

                {/* Example URLS Info */}
                {inputMode === 'url' && (
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      <strong>Example URLs you can use:</strong>
                    </p>
                    <div className="text-xs space-y-1">
                      <p>• Person: https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png</p>
                      <p>• Clothing: https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_2.png</p>
                    </div>
                  </Card>
                )}

                {/* Options */}
                {(inputMode === 'url' ? (personImageUrl && clothingImageUrl) : (personImage && clothingImage)) && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Clothing Type</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[ 
                        { id: 'top', label: 'Top (T-shirt, Blouse)' },
                        { id: 'bottom', label: 'Bottom (Pants, Skirt)' },
                        { id: 'dress', label: 'Dress' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setClothingType(type.id as ClothingType)}
                          className={`
                            p-3 rounded-lg border-2 text-sm font-medium transition-all
                            ${clothingType === type.id 
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'}
                          `}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                      <Button onClick={handleGenerate} className="flex-1 h-12 text-lg" disabled={status === 'generating'}>
                        {status === 'generating' ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Generating... (may take 10-20s)
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate Preview
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              /* Result View */
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    Your Preview is Ready!
                  </h3>
                  <Button variant="secondary" onClick={resetAll}>
                    Try Another
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Before</p>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                       {personPreview && <img src={personPreview} className="w-full h-full object-cover" alt="Original" />}
                       {personImageUrl && !personPreview && <img src={personImageUrl} className="w-full h-full object-cover" alt="Original" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider">After</p>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-indigo-500 shadow-lg shadow-indigo-500/20 relative">
                       {resultImage && <img src={resultImage} className="w-full h-full object-cover" alt="Result" />}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-4">
                  <Button className="flex-1">
                    Download Image
                  </Button>
                  <Button variant="secondary">
                    Share
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-5">
            {/* Pricing CTA */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
              <h3 className="text-xl font-bold mb-2">Try 5 for Free</h3>
              <p className="text-indigo-100 mb-6">Upgrade to Pro for unlimited virtual try-ons and faster processing.</p>
              <div className="flex gap-3">
                <Button className="bg-white text-indigo-700 hover:bg-gray-100 flex-1">
                  View Plans
                </Button>
              </div>
            </Card>

            {/* Recent History */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <History className="w-4 h-4" />
                Recent History
              </h3>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.result} className="w-full h-full object-cover" alt="History" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Try-on #{item.id.substr(0, 4)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No history yet</p>
                  <p className="text-xs">Your try-ons will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
