import pdfParse from 'pdf-parse';

/**
 * Extract text from a PDF file
 * @param {Buffer} pdfBuffer - PDF file as a buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function parsePDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Extract text from a text file
 * @param {Buffer} textBuffer - Text file as a buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function parseTXT(textBuffer) {
  try {
    return textBuffer.toString('utf-8');
  } catch (error) {
    throw new Error(`Failed to parse text file: ${error.message}`);
  }
}

/**
 * Extract text from a file based on its MIME type
 * @param {Buffer} fileBuffer - File as a buffer
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromFile(fileBuffer, mimeType) {
  if (mimeType === 'application/pdf') {
    return await parsePDF(fileBuffer);
  } else if (mimeType === 'text/plain' || mimeType === 'text/txt') {
    return await parseTXT(fileBuffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}. Please upload PDF or TXT files.`);
  }
}

/**
 * Clean and normalize extracted text
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
export function cleanText(text) {
  // Remove excessive whitespace and normalize line breaks
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

