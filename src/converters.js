// converters.js

// --- LÓGICA DE CONVERSIÓN ---

/**
 * Parsea el contenido de un archivo XML de mapeo de tipos IFC.
 * @param {string} xmlString - El contenido del archivo XML.
 * @returns {{headers: string[], data: object[]}}
 */
export const parseIFCMappingXml = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const rootElement = xmlDoc.querySelector("IFCTypeMappingItemList");
    if (!rootElement) throw new Error("No es un archivo de mapeo de tipos IFC válido.");

    const mappingItems = xmlDoc.querySelectorAll("MappingItem");
    const data = [];
    const allKeys = new Set(['ClassificationId']);

    mappingItems.forEach(item => {
        const classificationItem = item.querySelector("ClassificationItem");
        const ifcTypeItem = item.querySelector("IFCType");
        if (classificationItem && ifcTypeItem) {
            const row = { ClassificationId: classificationItem.getAttribute('Id') || '' };
            for (const attr of ifcTypeItem.attributes) {
                row[attr.name] = attr.value;
                allKeys.add(attr.name);
            }
            data.push(row);
        }
    });
    return { headers: Array.from(allKeys), data };
};

/**
 * Convierte datos parseados a un string en formato CSV.
 * @param {{headers: string[], data: object[]}} parsedData
 * @returns {string}
 */
export const convertToCsv = ({ headers, data }) => {
    const escapeCell = (cell) => {
        const strCell = String(cell == null ? '' : cell);
        if (strCell.includes(',') || strCell.includes('"') || strCell.includes('\n')) {
            return `"${strCell.replace(/"/g, '""')}"`;
        }
        return strCell;
    };
    const headerRow = headers.join(',');
    const dataRows = data.map(row => headers.map(header => escapeCell(row[header])).join(','));
    return [headerRow, ...dataRows].join('\n');
};

/**
 * Parsea un string en formato CSV a un array de objetos.
 * @param {string} csvText
 * @returns {{headers: string[], data: object[]}}
 */
export const parseCsv = (csvText) => {
    const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return { headers: [], data: [] };
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });
        return row;
    });
    return { headers, data };
};

/**
 * Crea un archivo XML de mapeo de tipos IFC a partir de datos CSV.
 * @param {{headers: string[], data: object[]}} csvData
 * @param {string} schema - 'IFC2x3' o 'IFC4'
 * @returns {string}
 */
export const createIFCMappingXml = (csvData, schema) => {
    const doc = document.implementation.createDocument(null, "IFCTypeMappingItemList", null);
    const root = doc.documentElement;
    root.setAttribute("ClassificationSystemName", "Clasificación de Archicad");
    root.setAttribute("ClassificationSystemEditionVersion", "v 2.0");
    root.setAttribute("Direction", "Export");
    root.setAttribute("IfcSchemaFilter", schema);

    const defaultElements = [
        doc.createElement("ClassificationSystemIFCType"),
        doc.createElement("UnClassifiedElementIFCType")
    ];
    defaultElements.forEach(el => {
        el.setAttribute("IFCObject", "IfcBuildingElementProxy");
        el.setAttribute("IFCObjectPredefinedType", "NOTDEFINED");
        el.setAttribute("IFCTypeObject", "IfcBuildingElementProxyType");
        el.setAttribute("IFCTypeObjectPredefinedType", "NOTDEFINED");
        root.appendChild(el);
    });

    csvData.data.forEach(row => {
        const mappingItem = doc.createElement("MappingItem");
        const classificationItem = doc.createElement("ClassificationItem");
        classificationItem.setAttribute("Id", row.ClassificationId || "");
        mappingItem.appendChild(classificationItem);
        const ifcType = doc.createElement("IFCType");
        Object.keys(row).forEach(key => {
            if (key !== 'ClassificationId' && row[key]) {
                ifcType.setAttribute(key, row[key]);
            }
        });
        mappingItem.appendChild(ifcType);
        root.appendChild(mappingItem);
    });

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(doc);
    const formattedXml = xmlString.replace(/></g, '>\n\t<').replace(/><\//g, '>\n</');
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + formattedXml;
};
