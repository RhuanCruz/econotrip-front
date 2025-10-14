/**
 * Voice Command Parser - Utilities for parsing voice commands efficiently
 */

export interface ParsedFlightCommand {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta?: string;
  passageiros?: number;
  classe?: 'economica' | 'executiva' | 'primeira';
  confidence: number; // 0-100% confidence in parsing
  errors: string[];
}

export interface ParsedRadarCommand {
  origem: string;
  destino: string;
  inicio?: string;
  fim?: string;
  valor?: number;
  tipo?: 'MONEY' | 'AIRMILES';
  confidence: number; // 0-100% confidence in parsing
  errors: string[];
}

// City mappings with aliases for better matching
export const CITY_MAPPINGS: { [key: string]: { code: string; aliases: string[] } } = {
  'GRU': { code: 'GRU', aliases: ['são paulo', 'sao paulo', 'sp', 'sampa', 'guarulhos'] },
  'GIG': { code: 'GIG', aliases: ['rio de janeiro', 'rio', 'rj', 'galeão', 'galeao'] },
  'BSB': { code: 'BSB', aliases: ['brasília', 'brasilia', 'bsb', 'df'] },
  'SSA': { code: 'SSA', aliases: ['salvador', 'ssa', 'bahia'] },
  'FOR': { code: 'FOR', aliases: ['fortaleza', 'for', 'ceará', 'ceara'] },
  'CNF': { code: 'CNF', aliases: ['belo horizonte', 'bh', 'confins', 'minas'] },
  'REC': { code: 'REC', aliases: ['recife', 'rec', 'pernambuco'] },
  'CWB': { code: 'CWB', aliases: ['curitiba', 'cwb', 'paraná', 'parana'] },
  'POA': { code: 'POA', aliases: ['porto alegre', 'poa', 'rs', 'salgado filho'] },
  'MAO': { code: 'MAO', aliases: ['manaus', 'mao', 'amazonas'] },
  'BEL': { code: 'BEL', aliases: ['belém', 'belem', 'bel', 'pará', 'para'] },
  'GYN': { code: 'GYN', aliases: ['goiânia', 'goiania', 'gyn', 'goiás', 'goias'] },
  'VIX': { code: 'VIX', aliases: ['vitória', 'vitoria', 'vix', 'espírito santo'] },
  'FLN': { code: 'FLN', aliases: ['florianópolis', 'florianopolis', 'floripa', 'fln', 'sc'] },
  'NAT': { code: 'NAT', aliases: ['natal', 'nat', 'rio grande do norte', 'rn'] },
  'MCZ': { code: 'MCZ', aliases: ['maceió', 'maceio', 'mcz', 'alagoas'] },
  'JPA': { code: 'JPA', aliases: ['joão pessoa', 'joao pessoa', 'jpa', 'paraíba', 'paraiba'] },
  'AJU': { code: 'AJU', aliases: ['aracaju', 'aju', 'sergipe'] },
  'CGR': { code: 'CGR', aliases: ['campo grande', 'cgr', 'mato grosso do sul'] },
  'CGB': { code: 'CGB', aliases: ['cuiabá', 'cuiaba', 'cgb', 'mato grosso'] },
  'THE': { code: 'THE', aliases: ['teresina', 'the', 'piauí', 'piaui'] },
  'SLZ': { code: 'SLZ', aliases: ['são luís', 'sao luis', 'slz', 'maranhão', 'maranhao'] },
  'PMW': { code: 'PMW', aliases: ['palmas', 'pmw', 'tocantins'] },
  'PVH': { code: 'PVH', aliases: ['porto velho', 'pvh', 'rondônia', 'rondonia'] },
  'RBR': { code: 'RBR', aliases: ['rio branco', 'rbr', 'acre'] },
  'BVB': { code: 'BVB', aliases: ['boa vista', 'bvb', 'roraima'] },
  'MCP': { code: 'MCP', aliases: ['macapá', 'macapa', 'mcp', 'amapá', 'amapa'] },
  'JFK': { code: 'JFK', aliases: ['nova york', 'new york', 'ny', 'nova iorque', 'manhattan'] },
  'MIA': { code: 'MIA', aliases: ['miami', 'mia', 'flórida', 'florida'] },
  'CDG': { code: 'CDG', aliases: ['paris', 'cdg', 'frança', 'franca'] },
  'LHR': { code: 'LHR', aliases: ['londres', 'lhr', 'london', 'inglaterra'] },
  'LIS': { code: 'LIS', aliases: ['lisboa', 'lis', 'portugal'] },
  'MAD': { code: 'MAD', aliases: ['madrid', 'mad', 'espanha'] },
  'FCO': { code: 'FCO', aliases: ['roma', 'fco', 'itália', 'italia'] },
  'BCN': { code: 'BCN', aliases: ['barcelona', 'bcn', 'catalunha'] },
  'AMS': { code: 'AMS', aliases: ['amsterdã', 'amsterdam', 'ams', 'holanda'] },
  'NRT': { code: 'NRT', aliases: ['tóquio', 'tokyo', 'nrt', 'japão', 'japao'] },
  'DXB': { code: 'DXB', aliases: ['dubai', 'dxb', 'emirados'] },
  'EZE': { code: 'EZE', aliases: ['buenos aires', 'eze', 'argentina'] },
  'SCL': { code: 'SCL', aliases: ['santiago', 'scl', 'chile'] },
  'LIM': { code: 'LIM', aliases: ['lima', 'lim', 'peru'] },
  'BOG': { code: 'BOG', aliases: ['bogotá', 'bogota', 'bog', 'colômbia', 'colombia'] },
  'MEX': { code: 'MEX', aliases: ['cidade do méxico', 'mexico', 'mex', 'méxico'] },
  'CUN': { code: 'CUN', aliases: ['cancún', 'cancun', 'cun', 'caribe'] },
};

// Month names in Portuguese
const MONTHS: { [key: string]: number } = {
  'janeiro': 0, 'fevereiro': 1, 'março': 2, 'marco': 2, 'abril': 3,
  'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
  'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
};

/**
 * Find city code with fuzzy matching
 */
export function findCityCode(text: string): string | null {
  const normalizedText = text.toLowerCase().trim();

  // Exact match first
  for (const [code, { aliases }] of Object.entries(CITY_MAPPINGS)) {
    for (const alias of aliases) {
      if (normalizedText === alias) {
        return code;
      }
    }
  }

  // Partial match
  for (const [code, { aliases }] of Object.entries(CITY_MAPPINGS)) {
    for (const alias of aliases) {
      if (normalizedText.includes(alias) || alias.includes(normalizedText)) {
        return code;
      }
    }
  }

  return null;
}

/**
 * Parse origin and destination from text
 */
export function parseOriginAndDestination(text: string): { origem: string | null; destino: string | null } {
  const normalizedText = text.toLowerCase();

  // Multiple regex patterns for flexibility
  const patterns = [
    // "de X para Y [date/other]"
    /(?:de|saindo de|partindo de)\s+(.+?)\s+(?:para|até|com destino a|indo para)\s+(.+?)(?:\s+(?:no dia|dia|em|amanhã|amanha|hoje|próxima|proxima|volta|\d|passageiro|adulto|criança|classe))/i,
    // "de X para Y" (end of string)
    /(?:de|saindo de|partindo de)\s+(.+?)\s+(?:para|até|com destino a|indo para)\s+(.+?)$/i,
    // "X para Y"
    /(.+?)\s+(?:para|até)\s+(.+?)(?:\s+(?:no dia|dia|em|amanhã|amanha|hoje|próxima|proxima|volta|\d|passageiro|adulto|criança|classe))/i,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      const origemText = match[1].trim();
      const destinoText = match[2].trim();

      const origem = findCityCode(origemText);
      const destino = findCityCode(destinoText);

      if (origem && destino) {
        console.log('🔍 Found route:', { origemText, origem, destinoText, destino });
        return { origem, destino };
      }
    }
  }

  return { origem: null, destino: null };
}

/**
 * Parse date from text
 */
export function parseDate(text: string): string | null {
  const today = new Date();
  const normalizedText = text.toLowerCase();

  // Relative dates
  if (normalizedText.includes('hoje')) {
    return today.toISOString().split('T')[0];
  }

  if (normalizedText.includes('amanhã') || normalizedText.includes('amanha')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  if (normalizedText.includes('próxima semana') || normalizedText.includes('proxima semana')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }

  if (normalizedText.includes('depois de amanhã') || normalizedText.includes('depois de amanha')) {
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split('T')[0];
  }

  // Specific dates
  const datePatterns = [
    { pattern: /(?:no dia|dia)\s+(\d{1,2})\s+de\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i, type: 'month' as const },
    { pattern: /(\d{1,2})\s+de\s+(janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i, type: 'month' as const },
    { pattern: /(?:no dia|dia)\s+(\d{1,2})\/(\d{1,2})/i, type: 'numeric' as const },
    { pattern: /(\d{1,2})\/(\d{1,2})/i, type: 'numeric' as const },
    { pattern: /(\d{1,2})-(\d{1,2})-(\d{4})/i, type: 'full' as const },
  ];

  for (const { pattern, type } of datePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      let date: Date;

      if (type === 'month') {
        const day = parseInt(match[1]);
        const month = MONTHS[match[2].toLowerCase()];
        date = new Date(today.getFullYear(), month, day);

        // If date is in the past, assume next year
        if (date < today) {
          date.setFullYear(date.getFullYear() + 1);
        }
      } else if (type === 'numeric') {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        date = new Date(today.getFullYear(), month, day);

        if (date < today) {
          date.setFullYear(date.getFullYear() + 1);
        }
      } else {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = parseInt(match[3]);
        date = new Date(year, month, day);
      }

      return date.toISOString().split('T')[0];
    }
  }

  return null;
}

/**
 * Parse number of passengers
 */
export function parsePassengers(text: string): number {
  const normalizedText = text.toLowerCase();

  // Look for explicit numbers
  const patterns = [
    /(\d+)\s+(?:passageiros?|pessoas?|adultos?)/i,
    /(?:para|com)\s+(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      const num = parseInt(match[1]);
      if (num > 0 && num <= 9) {
        return num;
      }
    }
  }

  // Text numbers
  const textNumbers: { [key: string]: number } = {
    'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 'tres': 3,
    'quatro': 4, 'cinco': 5, 'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9
  };

  for (const [word, num] of Object.entries(textNumbers)) {
    if (normalizedText.includes(`${word} passageiro`) || normalizedText.includes(`${word} pessoa`)) {
      return num;
    }
  }

  return 1; // Default
}

/**
 * Parse flight class
 */
export function parseClass(text: string): 'economica' | 'executiva' | 'primeira' {
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes('executiva') || normalizedText.includes('business')) {
    return 'executiva';
  }

  if (normalizedText.includes('primeira') || normalizedText.includes('first class')) {
    return 'primeira';
  }

  return 'economica';
}

/**
 * Convert text numbers to numeric values
 */
function textToNumber(text: string): number | null {
  const numberWords: { [key: string]: number } = {
    'zero': 0, 'um': 1, 'uma': 1, 'dois': 2, 'duas': 2, 'três': 3, 'tres': 3,
    'quatro': 4, 'cinco': 5, 'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10,
    'cem': 100, 'cento': 100, 'duzentos': 200, 'trezentos': 300, 'quatrocentos': 400,
    'quinhentos': 500, 'seiscentos': 600, 'setecentos': 700, 'oitocentos': 800, 'novecentos': 900,
    'mil': 1000, 'dois mil': 2000, 'três mil': 3000, 'tres mil': 3000,
    'quatro mil': 4000, 'cinco mil': 5000, 'dez mil': 10000
  };

  const normalized = text.toLowerCase().trim();

  // Check exact match first
  if (numberWords[normalized] !== undefined) {
    return numberWords[normalized];
  }

  // Try to match "X mil" pattern
  const milMatch = normalized.match(/(\d+)\s*mil/);
  if (milMatch) {
    return parseInt(milMatch[1]) * 1000;
  }

  return null;
}

/**
 * Parse price value from text
 */
export function parsePrice(text: string): number | null {
  const normalizedText = text.toLowerCase();
  console.log('💰 Parsing price from:', normalizedText);

  // Patterns for prices - now includes word numbers
  const patterns = [
    // "até X mil reais" or "até X mil"
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+(\d+)\s*mil\s*(?:reais?|r\$)?/i,
    // "até [number word] reais" (e.g., "até mil reais", "até dois mil reais")
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+((?:dois|três|tres|quatro|cinco|seis|sete|oito|nove|dez)?\s*mil)\s*(?:reais?|r\$)?/i,
    // "até [number word] reais" (e.g., "até cem reais")
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+(cem|cento|duzentos|trezentos|quatrocentos|quinhentos|seiscentos|setecentos|oitocentos|novecentos)\s*(?:reais?|r\$)?/i,
    // Regular number patterns
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+(\d+(?:[.,]\d+)?)\s*(?:reais?|r\$)?/i,
    /(\d+(?:[.,]\d+)?)\s*(?:reais?|r\$)/i,
    /r\$\s*(\d+(?:[.,]\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      console.log('💰 Price match found:', match[0], '→ value:', match[1]);

      let price: number;

      // Check if it's a text number
      const textNum = textToNumber(match[1]);
      if (textNum !== null) {
        price = textNum;
        console.log('💰 Converted text to number:', match[1], '→', price);
      } else {
        // Regular numeric parsing
        const priceStr = match[1].replace(',', '.');
        price = parseFloat(priceStr);
      }

      if (!isNaN(price) && price > 0) {
        console.log('💰 Parsed price:', price);
        return price;
      }
    }
  }

  console.log('💰 No price found');
  return null;
}

/**
 * Parse miles value from text
 */
export function parseMiles(text: string): number | null {
  const normalizedText = text.toLowerCase();
  console.log('✈️ Parsing miles from:', normalizedText);

  // Patterns for miles - now includes word numbers
  const patterns = [
    // "até X mil milhas" (número + mil)
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+(\d+)\s*mil\s*milhas?/i,
    // "até [number word] mil milhas" (e.g., "cinquenta mil milhas")
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+((?:dois|três|tres|quatro|cinco|seis|sete|oito|nove|dez|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem)?\s*mil)\s*milhas?/i,
    // Regular patterns
    /(?:até|abaixo de|menor que|menos de|no máximo|no maximo)\s+(\d+(?:[.,]\d+)?)\s*(?:mil|k)?\s*milhas?/i,
    /(\d+(?:[.,]\d+)?)\s*(?:mil|k)?\s*milhas?/i,
  ];

  for (const pattern of patterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      console.log('✈️ Miles match found:', match[0], '→ value:', match[1]);

      let miles: number;

      // Check if it's a text number first
      const textNum = textToNumber(match[1]);
      if (textNum !== null) {
        miles = textNum;
        console.log('✈️ Converted text to number:', match[1], '→', miles);
      } else {
        let milesStr = match[1].replace(',', '.');
        miles = parseFloat(milesStr);

        // Check if it's in thousands (e.g., "50 mil milhas")
        if (normalizedText.includes('mil milhas') || normalizedText.includes('k milhas')) {
          miles *= 1000;
          console.log('✈️ Multiplied by 1000 for "mil milhas":', miles);
        }
      }

      if (!isNaN(miles) && miles > 0) {
        console.log('✈️ Parsed miles:', miles);
        return miles;
      }
    }
  }

  console.log('✈️ No miles found');
  return null;
}

/**
 * Main parser function for flight commands
 */
export function parseFlightCommand(text: string): ParsedFlightCommand {
  const errors: string[] = [];
  let confidence = 100;

  // Parse all components
  const { origem, destino } = parseOriginAndDestination(text);
  const dataIda = parseDate(text);
  const passageiros = parsePassengers(text);
  const classe = parseClass(text);

  // Check for return flight
  let dataVolta: string | undefined;
  if (text.toLowerCase().includes('ida e volta') || text.toLowerCase().includes('volta')) {
    // Try to find return date after "volta"
    const voltaIndex = text.toLowerCase().indexOf('volta');
    if (voltaIndex !== -1) {
      const afterVolta = text.substring(voltaIndex);
      dataVolta = parseDate(afterVolta) || undefined;
    }
  }

  // Validate and calculate confidence
  if (!origem) {
    errors.push('Origem não identificada');
    confidence -= 40;
  }

  if (!destino) {
    errors.push('Destino não identificado');
    confidence -= 40;
  }

  if (!dataIda) {
    errors.push('Data de ida não identificada');
    confidence -= 20;
  }

  // Check if origin and destination are the same
  if (origem && destino && origem === destino) {
    errors.push('Origem e destino são iguais');
    confidence -= 50;
  }

  return {
    origem: origem || '',
    destino: destino || '',
    dataIda: dataIda || '',
    dataVolta,
    passageiros,
    classe,
    confidence: Math.max(0, confidence),
    errors,
  };
}

/**
 * Main parser function for radar commands
 */
export function parseRadarCommand(text: string): ParsedRadarCommand {
  console.log('🔍 parseRadarCommand called with:', text);
  const errors: string[] = [];
  let confidence = 100;

  // Parse origin and destination
  const { origem, destino } = parseOriginAndDestination(text);
  console.log('🔍 Origin/Destination parsed:', { origem, destino });

  // Determine if monitoring is for money or miles
  let tipo: 'MONEY' | 'AIRMILES' = 'MONEY';
  let valor: number | undefined;

  if (text.toLowerCase().includes('milha')) {
    console.log('🔍 Detected miles type');
    tipo = 'AIRMILES';
    valor = parseMiles(text) || undefined;
  } else {
    console.log('🔍 Detected money type');
    valor = parsePrice(text) || undefined;
  }
  console.log('🔍 Value parsed:', valor, 'Type:', tipo);

  // Parse period dates if specified
  let inicio: string | undefined;
  let fim: string | undefined;

  // Look for "a partir de" or "desde" for start date
  const inicioPatterns = [
    /(?:a partir de|desde|começando em|comecando em)\s+(.+?)(?:\s+(?:até|ate|e|com|por)|\s*$)/i,
  ];

  for (const pattern of inicioPatterns) {
    const match = text.match(pattern);
    if (match) {
      const dateText = match[1];
      // Only parse if it doesn't contain price indicators
      if (!dateText.match(/\d+\s*(?:reais?|milhas?|r\$)/i)) {
        inicio = parseDate(dateText) || undefined;
        break;
      }
    }
  }

  // Look for "até" for end date - but exclude price mentions
  // Pattern: "até [data]" but NOT "até X reais" or "até X milhas"
  const fimPatterns = [
    /(?:até|ate)\s+(\d{1,2}\s+de\s+\w+)/i,  // "até 20 de dezembro"
    /(?:até|ate)\s+(\d{1,2}\/\d{1,2})/i,    // "até 20/12"
  ];

  for (const pattern of fimPatterns) {
    const match = text.match(pattern);
    if (match) {
      fim = parseDate(match[1]) || undefined;
      if (fim) break;
    }
  }

  // If no specific period, try parsing general dates (but avoid numbers that might be prices)
  if (!inicio && !fim) {
    // Only look for date patterns, not standalone numbers
    const dateOnlyText = text.replace(/\d+\s*(?:reais?|milhas?|r\$)/gi, '');
    const generalDate = parseDate(dateOnlyText);
    if (generalDate) {
      inicio = generalDate;
    }
  }

  // Validate and calculate confidence
  if (!origem) {
    errors.push('Origem não identificada');
    confidence -= 40;
  }

  if (!destino) {
    errors.push('Destino não identificado');
    confidence -= 40;
  }

  // Period and price are optional for radar, so don't penalize heavily
  if (!inicio && !fim && !valor) {
    confidence -= 10; // Minor penalty for missing all optional fields
  }

  // Check if origin and destination are the same
  if (origem && destino && origem === destino) {
    errors.push('Origem e destino são iguais');
    confidence -= 50;
  }

  return {
    origem: origem || '',
    destino: destino || '',
    inicio,
    fim,
    valor,
    tipo,
    confidence: Math.max(0, confidence),
    errors,
  };
}
