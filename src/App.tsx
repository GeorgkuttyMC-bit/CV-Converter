import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, Loader2, Sparkles, LayoutPanelLeft, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { parseCVFile } from './lib/gemini';
import { CVData, ThemeConfig } from './types';
import { ThemeSelector } from './components/ThemeSelector';
import { CVPreview } from './components/CVPreview';

const DEFAULT_THEME: ThemeConfig = {
  id: 'minimalist',
  name: 'Minimalist',
  font: '"Inter", sans-serif',
  primaryColor: '#0f172a',
  backgroundColor: '#ffffff',
  textColor: '#1e293b'
};

export default function App() {
  const [data, setData] = useState<CVData | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("File too large. Max 5MB.");
      
      const parsedData = await parseCVFile(file);
      setData(parsedData);
    } catch (err) {
      console.error(err);
      let errorMessage = 'Unknown error occurred parsing CV.';
      if (err instanceof Error) {
        if (err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('high demand')) {
          errorMessage = 'The AI model is currently experiencing high demand. This is usually temporary. Please try again in a few moments.';
        } else {
          try {
            const parsedError = JSON.parse(err.message.replace(/^.*?{/, '{'));
            if (parsedError?.error?.message) {
              errorMessage = parsedError.error.message;
            } else {
              errorMessage = err.message;
            }
          } catch {
            errorMessage = err.message;
          }
        }
      }
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      setIsProcessing(true);
      // Brief pause to ensure all fonts/UI render properly
      await new Promise((resolve) => setTimeout(resolve, 100));

      const originalScrollY = window.scrollY;
      window.scrollTo(0, 0);

      const canvas = await html2canvas(previewRef.current, {
        scale: 3, // 3x for ultra-sharp text and images
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
        onclone: (doc) => {
          const el = doc.getElementById('cv-preview-content');
          if (el) {
            el.style.transform = 'none';
            el.style.boxShadow = 'none';
          }
        }
      });

      window.scrollTo(0, originalScrollY);

      // Switch to PNG to avoid JPEG compression artifacts on text
      const imgData = canvas.toDataURL('image/png');
      
      // A4 size in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Compress the final PDF to keep file size reasonable
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image as PNG
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // If content exceeds 1 page, add new page
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
         // Advanced multi-page logic could go here, but scaling to 1 page or clipping usually works best for CVs 
         // without manual content splitting.
      }

      pdf.save(`${data?.personal?.name?.replace(/\s+/g, '_') || 'creative'}_CV.pdf`);
    } catch (err) {
      console.error('PDF Generation failed', err);
      alert('Failed to generate PDF. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 w-full shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-none">CV Transformer</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">AI-POWERED RESUME BUILDER</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Header buttons removed in favor of the bottom export panel */}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left Sidebar - Controls */}
        <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto no-scrollbar shadow-sm z-10">
          <div className="p-6 space-y-8">
            
            {/* Upload Section */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Your Content
              </h2>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative
                  ${isProcessing ? 'border-indigo-200 bg-indigo-50 block' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50 cursor-pointer'}
                `}
                onClick={() => !isProcessing && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.txt,.md,.doc,.docx" 
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
                
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-900">AI is extracting your resume...</p>
                    <p className="text-xs text-gray-500 mt-1">This might take 10-20 seconds.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Upload your CV</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-[200px] leading-relaxed">PDF, TXT, or MD. We'll extract and rewrite to maximize impact.</p>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
            </section>

            {/* Customization Section (Only active if data is loaded) */}
            <section className={!data ? 'opacity-40 pointer-events-none' : ''}>
              <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <LayoutPanelLeft className="w-4 h-4 text-indigo-600" />
                Customize Layout
              </h2>
              
              <ThemeSelector theme={theme} onChange={setTheme} />
            </section>
            
          </div>
        </aside>

        {/* Right Content - Live Preview */}
        <main className="flex-1 overflow-auto bg-gray-100/50 p-8 pt-8 pb-32 flex justify-center custom-scrollbar relative flex-col items-center">
          <div className="absolute inset-0 pattern-dots opactiy-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative transform-origin-top transition-transform duration-300 ease-out z-10 w-full max-w-[800px] flex justify-center">
            <CVPreview data={data} theme={theme} previewRef={previewRef} />
          </div>

          {/* Export Panel at Bottom */}
          {data && (
            <div className="fixed bottom-8 left-[380px] right-0 flex justify-center z-20 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md shadow-2xl border border-gray-200/60 rounded-2xl p-5 flex items-center gap-6 pointer-events-auto transform transition-all duration-500 translate-y-0 opacity-100">
                <div>
                  <h3 className="text-gray-900 font-bold text-lg leading-tight">Ready to Export?</h3>
                  <p className="text-gray-500 text-sm">Download your tailored resume.</p>
                </div>
                
                <div className="w-[1px] h-10 bg-gray-200"></div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePrint()}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-700 text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 focus:outline-none transition-all shadow-sm disabled:opacity-50"
                  >
                    <Printer className="w-5 h-5" />
                    High Quality PDF (Print)
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    Standard Output
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

