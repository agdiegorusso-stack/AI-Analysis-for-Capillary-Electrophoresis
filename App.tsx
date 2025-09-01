
import React, { useState, useCallback } from 'react';
import type { AnalysisResult, GroundingSource } from './types';
import { runAnalysis } from './services/aiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(URL.createObjectURL(file));
  };
  
  const clearAnalysisState = () => {
    setAnalysisResult(null);
    setSources([]);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) {
      setError("Please upload an image file to analyze.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setSources([]);
    setError(null);

    try {
      const { analysis, sources } = await runAnalysis(uploadedFile);
      setAnalysisResult(analysis);
      setSources(sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <section id="file-upload-section" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-1">1. Upload Electropherogram</h2>
            <FileUpload onFileSelect={handleFileSelect} clearAnalysis={clearAnalysisState} />
          </section>

          <section id="analysis-control" className="mb-8 text-center">
            <button
              onClick={handleAnalyze}
              disabled={!uploadedFile || isLoading}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Analyzing...' : '2. Run AI Analysis'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </section>

          <section id="results">
             <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">3. AI Analysis Results</h2>
            {isLoading && <Loader />}
            {!isLoading && analysisResult && imagePreview && (
              <AnalysisDisplay result={analysisResult} sampleImage={imagePreview} sources={sources} />
            )}
            {!isLoading && !analysisResult && (
              <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Analysis results will be displayed here once an image is uploaded and analyzed.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;