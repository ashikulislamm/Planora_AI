/**
 * Extract the first balanced JSON object or array from a string.
 * Handles surrounding conversational text, quotes, and escaped characters.
 * 
 * @param {string} str - The text containing JSON
 * @returns {string|null} The isolated JSON string, or null if no braces/brackets found
 */
const extractBalancedJson = (str) => {
  const firstBrace = str.indexOf('{');
  const firstBracket = str.indexOf('[');
  
  let startIdx = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }
  
  if (startIdx === -1) return null;
  
  let braceCount = 0;
  let inString = false;
  let escape = false;
  
  for (let i = startIdx; i < str.length; i++) {
    const char = str[i];
    
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{' || char === '[') {
        braceCount++;
      } else if (char === '}' || char === ']') {
        braceCount--;
        if (braceCount === 0) {
          return str.substring(startIdx, i + 1);
        }
      }
    }
  }
  
  // If braces are unbalanced, return string from startIdx to end of string to attempt repairs
  return str.substring(startIdx);
};

/**
 * Repairs common JSON formatting flaws (trailing commas, comments, double commas,
 * invisible Unicode characters, and missing closing brackets due to truncation).
 * 
 * @param {string} jsonStr - The malformed JSON string
 * @returns {string} The repaired JSON string
 */
const repairJsonString = (jsonStr) => {
  let repaired = jsonStr.trim();
  
  // 1. Remove JavaScript-style block and inline comments
  repaired = repaired.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
  
  // 2. Remove trailing commas before closing braces/brackets
  repaired = repaired.replace(/,(\s*[\]}])/g, '$1');
  
  // 3. Fix double commas
  repaired = repaired.replace(/,,\s*/g, ',');
  
  // 4. Remove invisible Unicode formatting characters / zero-width spaces
  repaired = repaired.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // 5. Autocomplete missing closing braces if truncated
  const openBraces = (repaired.match(/\{/g) || []).length;
  const closeBraces = (repaired.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    repaired += '}'.repeat(openBraces - closeBraces);
  }
  
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;
  if (openBrackets > closeBrackets) {
    repaired += ']'.repeat(openBrackets - closeBrackets);
  }
  
  return repaired;
};

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
      parsed: null,
      isJson: false,
    };
  }

  // Clean raw whitespace
  const cleaned = rawResponse.trim();

  // Try extracting and repairing JSON
  try {
    // Look for markdown JSON blocks first: ```json ... ```
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const jsonMatch = cleaned.match(jsonBlockRegex);
    
    let targetString = cleaned;
    if (jsonMatch) {
      targetString = jsonMatch[1].trim();
    }

    // Extract the balanced JSON container
    const extracted = extractBalancedJson(targetString);
    if (extracted) {
      const repaired = repairJsonString(extracted);
      const parsed = JSON.parse(repaired);
      return {
        raw: rawResponse,
        parsed,
        isJson: true,
      };
    }
  } catch (error) {
    // Parsing / repairing failed: fall back to treating it as regular text
  }

  // Fallback to text output
  const cleanText = cleaned.replace(/```/g, '').trim();

  return {
    raw: rawResponse,
    parsed: cleanText,
    isJson: false,
  };
};
