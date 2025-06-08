/**
 * Email parser module for extracting coupon data from emails
 */
const axios = require('axios');
require('dotenv').config();

// OpenRouter API endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Get brand logo URL using Clearbit Logo API
 * @param {string} brandName - The brand name
 * @returns {string} - URL to the brand logo
 */
function getBrandLogo(brandName) {
  if (!brandName || brandName === 'Unknown') {
    return 'https://via.placeholder.com/80?text=Brand';
  }
  
  // Clean up the brand name
  const cleanBrandName = brandName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  // Use UI Avatar as a fallback to avoid punycode issues
  if (!cleanBrandName) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&size=80`;
  }
  
  // Use Clearbit Logo API with explicit encoding
  return `https://logo.clearbit.com/${encodeURIComponent(cleanBrandName)}.com`;
}

/**
 * Parse email content to extract coupon data
 * @param {string} emailContent - The email body content
 * @param {string} subject - The email subject
 * @returns {Promise<Object>} - Structured coupon data
 */
async function parseEmail(emailContent, subject) {
  // Handle undefined inputs
  if (!emailContent && !subject) {
    return null;
  }
  
  emailContent = emailContent || '';
  subject = subject || '';
  
  try {
    // Try to use AI parsing
    const aiResult = await parseEmailWithAI(emailContent, subject);
    
    if (aiResult) {
      console.log('Successfully parsed email with AI');
      return aiResult;
    }
  } catch (error) {
    console.error('AI parsing failed, falling back to regex:', error);
  }
  
  // Fall back to regex parsing
  return parseEmailWithRegex(emailContent, subject);
}

/**
 * Parse email content to extract coupon data using AI
 * @param {string} emailContent - The email body content
 * @param {string} subject - The email subject
 * @returns {Promise<Object>} - Structured coupon data
 */
async function parseEmailWithAI(emailContent, subject) {
  if (!OPENROUTER_API_KEY) {
    console.log('OpenRouter API key is not configured, falling back to regex parsing');
    return null;
  }

  try {
    const prompt = `
Extract these fields from the email:
- brand
- savings
- description
- expiration_date (YYYY-MM-DD)
- criteria
- category (Food & Grocery/Clothing/Electronics/Travel/Beauty/Entertainment/Other)
- deal_link
- promo_code

Return ONLY a JSON object.
`;

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are a specialized email parser that extracts structured data from promotional emails.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nEMAIL CONTENT:\nSubject: ${subject}\n\n${emailContent}`
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://incentivebox.app',
          'X-Title': 'IncentiveBox Email Parser'
        }
      }
    );

    // Extract and parse the JSON from the response
    const assistantMessage = response.data.choices[0].message.content;
    const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No JSON found in response');
      return null;
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Add default values for any missing fields
    return {
      brand: parsedData.brand || "",
      savings: parsedData.savings || "",
      description: parsedData.description || "",
      expiration_date: parsedData.expiration_date ? new Date(parsedData.expiration_date) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      criteria: parsedData.criteria || "",
      category: parsedData.category || "Other",
      deal_link: parsedData.deal_link || "#",
      promo_code: parsedData.promo_code || "",
      brand_logo: getBrandLogo(parsedData.brand)
    };
  } catch (error) {
    console.error('Error parsing email with AI:', error);
    return null;
  }
}

/**
 * Parse email content using regex patterns
 * @param {string} emailContent - The email body content
 * @param {string} subject - The email subject
 * @returns {Object} - Structured coupon data
 */
function parseEmailWithRegex(emailContent, subject) {
  // Extract brand from sender or subject
  const brandMatch = emailContent.match(/From: ([^<]+)/) || 
                    subject.match(/From: ([^<]+)/) ||
                    emailContent.match(/\[image: ([^\]]+)\]/) ||
                    subject.match(/([A-Za-z0-9]+):/);
  
  // Extract discount amount
  const savingsMatch = subject.match(/\$(\d+) off/) || 
                      emailContent.match(/\$(\d+) off/) ||
                      subject.match(/(\d+)% off/) ||
                      emailContent.match(/(\d+)% off/);
  
  // Extract promo code
  const promoMatch = emailContent.match(/code\s+\*?([A-Z0-9]+)\*?/i) ||
                    emailContent.match(/promo\s+code\s+\*?([A-Z0-9]+)\*?/i);
  
  // Extract expiration date
  const expirationMatch = emailContent.match(/Expires\s+on\s+([A-Za-z]+\s+\d+,\s+\d{4})/) ||
                         emailContent.match(/Expires\s+([A-Za-z]+\s+\d+)/) ||
                         emailContent.match(/Valid\s+until\s+([A-Za-z]+\s+\d+)/);
  
  // Extract minimum purchase
  const minPurchaseMatch = emailContent.match(/\$(\d+)\s+and\s+over/) ||
                          emailContent.match(/\$(\d+)\+/) ||
                          emailContent.match(/\$(\d+)\s+minimum/) ||
                          emailContent.match(/minimum\s+\$(\d+)/i);
  
  // Extract deal link
  const dealLinkMatch = emailContent.match(/https?:\/\/[^\s<>"]+/);

  // Determine brand
  let brand = 'Unknown';
  if (brandMatch) {
    brand = brandMatch[1].trim();
  } else if (emailContent.includes('Postmates')) {
    brand = 'Postmates';
  } else if (emailContent.includes('Uber')) {
    brand = 'Uber';
  }

  // Determine savings
  const savings = savingsMatch ? `$${savingsMatch[1]} off` : 'Special Offer';
  
  // Determine promo code
  const promoCode = promoMatch ? promoMatch[1] : '';
  
  // Determine expiration date
  let expirationDate = parseDate(expirationMatch?.[1]);
  if (!expirationDate) {
    expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days
  }
  
  // Build criteria string
  let criteria = 'Received via email';
  if (promoCode) {
    criteria = `Use code: ${promoCode}`;
  }
  
  if (minPurchaseMatch) {
    criteria += `. Minimum purchase: $${minPurchaseMatch[1]}`;
  }
  
  // Extract any additional restrictions
  const restrictionsMatch = emailContent.match(/Applies to orders \$\d+ and over[^\.]+/);
  if (restrictionsMatch) {
    criteria += `. ${restrictionsMatch[0]}`;
  }
  
  // Determine description
  let description = `${savings}`;
  if (minPurchaseMatch) {
    description += ` on orders over $${minPurchaseMatch[1]}`;
  }
  description += ` at ${brand}`;
  
  // Determine category based on brand
  let category = 'Other';
  if (brand === 'Postmates' || brand === 'Uber Eats' || brand.includes('Food')) {
    category = 'Food & Grocery';
  }
  
  return {
    brand,
    brand_logo: getBrandLogo(brand),
    description,
    savings,
    expiration_date: expirationDate,
    criteria,
    category,
    deal_link: dealLinkMatch ? dealLinkMatch[0] : '#',
    promo_code: promoCode
  };
}

/**
 * Parse date string to Date object
 */
function parseDate(dateString) {
  if (!dateString) return null;
  
  try {
    // Try standard date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Try to extract date patterns like "Jun 6, 2025"
    const dateMatch = dateString.match(/([A-Za-z]+)\s+(\d+),?\s+(\d{4})/);
    if (dateMatch) {
      const [_, month, day, year] = dateMatch;
      return new Date(`${month} ${day}, ${year}`);
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

module.exports = {
  parseEmail
};