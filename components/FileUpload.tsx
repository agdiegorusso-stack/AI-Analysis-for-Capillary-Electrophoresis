
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  clearAnalysis: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, clearAnalysis }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      clearAnalysis();
      setFileName(file.name);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onFileSelect(file);
    } else if (file) {
      alert('Please upload a valid image file (PNG or JPEG).');
    }
  }, [onFileSelect, clearAnalysis]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          flex justify-center items-center w-full border-2 border-dashed rounded-lg p-8 
          cursor-pointer transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
        `}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG or JPG</p>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={onInputChange} />
        </div>
      </div>
      {imagePreview && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Selected Image Preview:</h4>
          <div className="p-2 border rounded-lg inline-block bg-white shadow-sm">
            <img src={imagePreview} alt="Preview" className="max-h-40 rounded-md"/>
          </div>
          <p className="text-sm text-gray-500 mt-1">{fileName}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
