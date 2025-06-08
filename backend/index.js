/**
 * IncentiveBox Backend Server
 */
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { parseEmail } = require('./emailParser');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * Find user ID by email address
 */
async function findUserByEmail(email) {
  if (!email) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    return error ? null : data?.id;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Parse email endpoint
 */
app.post('/api/parse-email', async (req, res) => {
  try {
    const { content, subject } = req.body;
    
    if (!content && !subject) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email content or subject is required' 
      });
    }
    
    const parsedData = await parseEmail(content, subject);
    
    if (!parsedData) {
      return res.status(422).json({ 
        success: false, 
        message: 'Failed to parse email content'
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: parsedData 
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error processing request'
    });
  }
});

/**
 * Inbound email webhook endpoint
 */
app.post('/api/inbound-email', async (req, res) => {
  try {
    const { From, Subject, TextBody, HtmlBody } = req.body;
    
    if (!TextBody && !HtmlBody) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email content is required' 
      });
    }
    
    // Extract email from From field
    const emailMatch = From?.match(/<([^>]+)>/);
    const senderEmail = emailMatch ? emailMatch[1] : From;
    
    // Parse the email content
    const parsedData = await parseEmail(TextBody || HtmlBody, Subject || '');
    
    if (!parsedData) {
      return res.status(422).json({ 
        success: false, 
        message: 'Failed to parse email content' 
      });
    }
    
    // Find the user and save the coupon
    const userId = await findUserByEmail(senderEmail);
    const result = await saveCouponToDatabase(parsedData, userId);
    
    return res.status(200).json({ 
      success: true,
      couponId: result?.id
    });
  } catch (error) {
    console.error('Error processing inbound email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * Save coupon to database
 */
async function saveCouponToDatabase(couponData, userId = null) {
  try {
    // Check for duplicate coupons
    const { data: existingCoupons } = await supabase
      .from('coupons')
      .select('id')
      .eq('brand', couponData.brand)
      .eq('description', couponData.description)
      .eq('savings', couponData.savings)
      .eq('user_id', userId || null);
    
    if (existingCoupons?.length > 0) {
      console.log('Duplicate coupon found, skipping insertion');
      return existingCoupons[0];
    }
    
    // Insert the coupon
    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        brand: couponData.brand,
        description: couponData.description,
        savings: couponData.savings,
        expiration_date: couponData.expiration_date,
        criteria: couponData.criteria,
        category: couponData.category,
        featured: false,
        deal_link: couponData.deal_link || '#',
        brand_logo: couponData.brand_logo,
        user_id: userId,
        promo_code: couponData.promo_code || ''
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error saving coupon to database:', error);
      throw error;
    }
    
    // Handle brand creation or update
    await handleBrand(couponData.brand, couponData.brand_logo);
    
    return data;
  } catch (err) {
    console.error('Exception in saveCouponToDatabase:', err);
    throw err;
  }
}

/**
 * Handle brand creation or update
 */
async function handleBrand(brandName, brandLogo) {
  try {
    // Check if brand exists
    const { data: brand } = await supabase
      .from('brands')
      .select('name')
      .eq('name', brandName)
      .single();
    
    if (!brand) {
      // Create new brand
      await supabase
        .from('brands')
        .insert([{
          name: brandName,
          logo: brandLogo,
          coupons_count: 1
        }]);
    } else {
      // Update coupon count
      const { count } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true })
        .eq('brand', brandName);
      
      await supabase
        .from('brands')
        .update({ coupons_count: count || 0 })
        .eq('name', brandName);
    }
    
    return { success: true };
  } catch (err) {
    console.error('Error handling brand:', err);
    return { success: false };
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────────────┐
                                                   
     IncentiveBox API Server                       
     Running on port: ${PORT}                        
     ${new Date().toLocaleString()}                
                                                   
     Health check: http://localhost:${PORT}/api/health 
                                                   
  └─────────────────────────────────────────────────┘
  `);
});