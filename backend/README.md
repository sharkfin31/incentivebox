# IncentiveBox Backend

Backend server for IncentiveBox coupon management app.

## Features

- Inbound email processing for coupon extraction
- AI-powered email parsing using OpenRouter
- Supabase integration for data storage
- RESTful API endpoints

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory:
```
# Supabase configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# API Keys for email parsing
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Server configuration
PORT=3001
```

3. Start the server:
```
npm start
```

For development with auto-reload:
```
npm run dev
```

## API Endpoints

### Inbound Email Processing

```
POST /api/inbound-email
```

Processes incoming emails from Postmark webhook and extracts coupon data.

Example request body:
```json
{
  "From": "sender@example.com",
  "Subject": "Special Offer: 20% off at Nike this weekend!",
  "TextBody": "Dear Customer, \n\nEnjoy 20% off all footwear at Nike stores and online. Use code SHOES20 at checkout. Valid until December 31, 2023. \n\nTerms: Cannot be combined with other offers. Excludes limited editions. \n\nShop now at nike.com/sale \n\nThanks, \nThe Nike Team"
}
```

## Testing

You can test the email parsing API locally using curl:

```bash
curl -X POST http://localhost:3001/api/inbound-email \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Special Offer: 20% off at Nike this weekend!",
    "content": "Dear Customer, \n\nEnjoy 20% off all footwear at Nike stores and online. Use code SHOES20 at checkout. Valid until December 31, 2023. \n\nTerms: Cannot be combined with other offers. Excludes limited editions. \n\nShop now at nike.com/sale \n\nThanks, \nThe Nike Team"
  }'
```