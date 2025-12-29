const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

module.exports = async (req, res) => {
  try {
    // Проверка метода запроса
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Получение файла из запроса
    const { file, file_type } = req.body;
    
    if (!file || !file_type) {
      return res.status(400).json({ error: 'File and file_type are required' });
    }

    let text = '';

    // Парсинг в зависимости от типа файла
    if (file_type === 'docx') {
      const buffer = Buffer.from(file, 'base64');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (file_type === 'pdf') {
      const buffer = Buffer.from(file, 'base64');
      const data = await pdfParse(buffer);
      text = data.text;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Возврат распарсенного текста
    return res.status(200).json({ 
      success: true, 
      text: text 
    });

  } catch (error) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ 
      error: 'Failed to parse resume',
      details: error.message 
    });
  }
};
