import React, { useEffect, useState } from 'react';
import { parseCsv } from '../converters';

const FileContent = ({ content }) => {
    const [parsed, setParsed] = useState(null);

    useEffect(() => {
        if (!content) return setParsed(null);

        // Intenta parsear como CSV si parece CSV
        if (typeof content === 'string' && content.includes(',') && !content.startsWith('<?xml')) {
            try {
                const result = parseCsv(content);
                if (result.headers.length > 0 && result.data.length > 0) {
                    setParsed({ type: 'table', ...result });
                    return;
                }
            } catch (e) {
                // Fallback a texto plano
            }
        }

        // Si no es CSV, lo tratamos como texto plano (ej: XML)
        setParsed({ type: 'text', text: content });
    }, [content]);

    if (!parsed) return <p className="text-gray-500">Cargando previsualización...</p>;

    if (parsed.type === 'table') {
        return (
            <div className="overflow-auto h-full">
                <table className="min-w-full text-sm text-left border border-collapse">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            {parsed.headers.map((header) => (
                                <th key={header} className="px-2 py-1 border font-semibold text-gray-700">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {parsed.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {parsed.headers.map((header) => (
                                    <td key={header} className="px-2 py-1 border text-gray-800 align-top">
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <pre className="text-xs whitespace-pre-wrap text-gray-700">
            {parsed.text}
        </pre>
    );
};

export default FileContent;
