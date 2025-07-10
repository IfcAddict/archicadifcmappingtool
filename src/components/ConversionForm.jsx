import React, { useState, useMemo } from 'react';
import { ChevronsRight } from 'lucide-react';

const ConversionForm = ({ onConvert, files, onSchemaChange }) => {
    const [schema, setSchema] = useState('IFC4');
    const containsCsv = useMemo(() => files.some(file => file.name.endsWith('.csv')), [files]);
    
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">2. Convertir</h2>
            <div className="bg-gray-50 p-6 rounded-lg h-48 flex flex-col justify-center items-center">
                {containsCsv && (
                    <div className="w-full mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Esquema de Salida para XML:</label>
                        <select 
                            value={schema} 
                            onChange={(e) => {
                                setSchema(e.target.value);
                                onSchemaChange(e.target.value);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="IFC4">IFC4</option>
                            <option value="IFC2x3">IFC2x3</option>
                        </select>
                    </div>
                )}
                <button
                    onClick={() => onConvert(schema)}
                    disabled={files.length === 0}
                    className="w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <ChevronsRight className="mr-2 h-5 w-5" />
                    Convertir {files.length > 0 ? `${files.length} Archivo(s)` : ''}
                </button>
            </div>
        </div>
    );
};

export default ConversionForm;
