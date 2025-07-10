import React from 'react';
import FileContent from './FileContent';

const PreviewTabs = ({ files, activeTab, setActiveTab }) => {
    if (files.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="font-semibold mb-2 text-lg text-gray-800">Previsualización de Archivos Convertidos</h3>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {files.map((file, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === index 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {file.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-4 bg-white p-4 rounded-lg shadow-inner h-64 overflow-auto">
                <FileContent content={files[activeTab]?.preview} />
            </div>
        </div>
    );
};

export default PreviewTabs;
