import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

const FileUploader = ({ onFilesLoaded }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e, enter) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(enter);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesLoaded(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, [onFilesLoaded]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesLoaded(e.target.files);
        }
    };
    
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">1. Cargar Archivos</h2>
            <label 
                htmlFor="file-input"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">Archivos XML o CSV</p>
                </div>
                <input id="file-input" type="file" className="hidden" multiple onChange={handleChange} />
            </label>
        </div>
    );
};

export default FileUploader;
