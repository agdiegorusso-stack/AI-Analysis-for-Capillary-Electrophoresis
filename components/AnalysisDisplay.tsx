
import React from 'react';
import type { AnalysisResult, GroundingSource } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  sampleImage: string;
  sources: GroundingSource[];
}

const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
  const color = value > 95 ? 'bg-green-500' : value > 80 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, sampleImage, sources }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <h3 className="font-bold text-xl text-blue-800">{result.summary}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
            <h4 className="font-bold text-lg mb-2 text-gray-700">Analyzed Sample</h4>
            <img src={sampleImage} alt="Analyzed electropherogram" className="rounded-lg shadow-md w-full" />
        </div>
        
        <div className="md:col-span-3">
          <h4 className="font-bold text-lg mb-2 text-gray-700">Identified Peaks</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">Fraction</th>
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">Value (%)</th>
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-600">Normal Range</th>
                </tr>
              </thead>
              <tbody>
                {result.peaks.map((peak) => (
                  <tr key={peak.name} className="border-t">
                    <td className="py-2 px-3 font-medium">{peak.name}</td>
                    <td className={`py-2 px-3 font-mono ${peak.isAbnormal ? 'text-red-600 font-bold' : 'text-green-700'}`}>
                      {peak.value.toFixed(1)}
                    </td>
                    <td className="py-2 px-3 text-gray-500 font-mono">{peak.normalRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-lg mb-2 text-gray-700">AI Interpretation</h4>
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-gray-700 whitespace-pre-wrap">{result.interpretation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-lg mb-2 text-gray-700">AI Confidence Score</h4>
             <div className="flex items-center space-x-3">
                <div className="flex-grow">
                    <ConfidenceMeter value={result.confidence} />
                </div>
                <span className="font-bold text-blue-600 text-lg">{result.confidence.toFixed(1)}%</span>
             </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-2 text-gray-700">Recommendations</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-md">{result.recommendations}</p>
          </div>
      </div>

      {sources && sources.length > 0 && (
        <div>
          <h4 className="font-bold text-lg mb-2 text-gray-700">Sources</h4>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <ul className="list-disc list-inside space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisDisplay;