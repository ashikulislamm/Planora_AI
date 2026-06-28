/**
 * Parses raw AI response into a standardized structure.
 * Clean AI output, extract JSON if present, handle malformed responses.
 * 
 * @param {string} rawResponse - The raw output text from Gemini
 * @returns {object} Standardized parsing result: { raw, parsed, isJson }
 */
export const parseAiResponse = (rawResponse) => {
  if (typeof rawResponse !== 'string') {
    return {
      raw: '',
      parsed: '',
      isJson: false,
    };
  }

  // Clean AI output by trimming whitespace
  const cleaned = rawResponse.trim();

  // Try parsing as JSON
  try {
    // Check if it looks like a JSON markdown block: ```json ... ``` or ``` ... ```
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const jsonMatch = cleaned.match(jsonBlockRegex);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1].trim();
      const parsed = JSON.parse(jsonStr);
      return {
        raw: cleaned,
        parsed,
        isJson: true,
      };
    }

    // Check if the overall output matches a JSON boundary { ... } or [ ... ]
    const boundaryRegex = /^[\s\S]*?(\{[\s\S]*\}|\[[\s\S]*\])[\s\S]*?$/;
    const boundaryMatch = cleaned.match(boundaryRegex);
    if (boundaryMatch) {
      const jsonStr = boundaryMatch[1].trim();
      const parsed = JSON.parse(jsonStr);
      return {
        raw: cleaned,
        parsed,
        isJson: true,
      };
    }

    // Try parsing the direct string if it starts with standard JSON characters
    if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
      const parsed = JSON.parse(cleaned);
      return {
        raw: cleaned,
        parsed,
        isJson: true,
      };
    }
  } catch (error) {
    // Parsing error: fall back to treating it as regular text
  }

  // If not JSON, return clean text response
  const cleanText = cleaned.replace(/```/g, '').trim();

  return {
    raw: cleaned,
    parsed: cleanText,
    isJson: false,
  };
};
