import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import ConversionForm from './components/ConversionForm';
import PreviewTabs from './components/PreviewTabs';
import { 
    parseIFCMappingXml, 
    convertToCsv, 
    parseCsv, 
    createIFCMappingXml 
} from './converters.js';

const App = () => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [schemaVersion, setSchemaVersion] = useState('IFC4');

    const handleFilesLoad = async (loadedFiles) => {
        const validFiles = Array.from(loadedFiles).filter(file => 
            file.name.endsWith('.xml') || file.name.endsWith('.csv')
        );
        setFiles(validFiles);
        setActiveTab(0);

        const newPreviews = await Promise.all(validFiles.map(async (file) => {
            const text = await file.text();
            const extension = file.name.split('.').pop().toLowerCase();
            try {
                if (extension === 'csv') {
                    const parsedCsv = parseCsv(text);
                    const xml = createIFCMappingXml(parsedCsv, schemaVersion);
                    return { name: file.name, preview: xml };
                } else if (extension === 'xml') {
                    const parsedXml = parseIFCMappingXml(text);
                    const csv = convertToCsv(parsedXml);
                    return { name: file.name, preview: csv };
                } else {
                    return { name: file.name, preview: 'Tipo de archivo no soportado.' };
                }
            } catch (e) {
                return { name: file.name, preview: `⚠️ Error: ${e.message}` };
            }
        }));
        setPreviews(newPreviews);
    };

    const handleConvert = async (schema) => {
        if (files.length === 0) return;

        for (const file of files) {
            try {
                const extension = file.name.split('.').pop().toLowerCase();
                const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
                const textContent = await file.text();
                
                if (extension === 'xml') {
                    const parsedData = parseIFCMappingXml(textContent);
                    const csvContent = convertToCsv(parsedData);
                    downloadFile(`${baseName}.csv`, csvContent, 'text/csv');
                } else if (extension === 'csv') {
                    const parsedData = parseCsv(textContent);
                    const xmlContent = createIFCMappingXml(parsedData, schema);
                    downloadFile(`${baseName}.xml`, xmlContent, 'application/xml');
                }
            } catch (error) {
                console.error(`Error convirtiendo ${file.name}:`, error);
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    };

    const downloadFile = (filename, content, mimeType) => {
        const element = document.createElement('a');
        element.setAttribute('href', `data:${mimeType};charset=utf-8,` + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">Archicad IfcMappingTool</h1>
                    <p className="text-lg text-gray-600 mt-2">Conversor de Mapeo de Tipos IFC para Archicad</p>
                </header>
                <main className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <FileUploader onFilesLoaded={handleFilesLoad} />
                        <ConversionForm 
                            onConvert={handleConvert} 
                            files={files} 
                            onSchemaChange={setSchemaVersion}
                        />
                    </div>
                    <PreviewTabs 
                        files={previews} 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                    />
                </main>
            </div>
        </div>
    );
};

export default App;
