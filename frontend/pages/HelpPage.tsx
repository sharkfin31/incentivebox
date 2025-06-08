import { useState } from 'react';
import { theme } from '../utils/theme';
import { FiHelpCircle, FiSend, FiCheckCircle, FiCopy, FiCheck } from 'react-icons/fi';

const HelpPage = () => {
  const couponEmail = 'dfa8e0973698869a00716346ada53a21@inbound.postmarkapp.com';
  const [copied, setCopied] = useState(false);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: theme.colors.neutral[800],
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FiHelpCircle /> Instructions
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.lg,
        padding: '24px',
        marginBottom: '32px',
        boxShadow: theme.shadows.sm
      }}>
        {/* <h2 style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: theme.colors.primary.main,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FiMail /> Adding Coupons via Email
        </h2> */}
        
        <p style={{
          fontSize: '16px',
          color: theme.colors.neutral[700],
          marginBottom: '16px',
          lineHeight: 1.6
        }}>
          You can easily add coupons to your collection by forwarding coupon emails to our system.
        </p>
        
        <div style={{
          backgroundColor: theme.colors.primary.light + '15',
          borderRadius: theme.borderRadius.lg,
          padding: '20px',
          marginBottom: '24px',
          border: `1px solid ${theme.colors.primary.light}30`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <p style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            Forward your coupon emails to:
          </p>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.md,
            padding: '12px 24px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.primary.main,
            border: `2px solid ${theme.colors.primary.main}`,
            marginBottom: '16px'
          }}>
            {couponEmail}
          </div>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(couponEmail);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: copied ? theme.colors.success.main : theme.colors.primary.main,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease'
            }}
          >
            {copied ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy Email Address
              </>
            )}
          </button>
        </div>
        
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: theme.colors.neutral[800],
          marginBottom: '12px'
        }}>
          How It Works
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Receive a coupon email</p>
              <p style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
                When you get a coupon in your inbox that you want to save
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Forward it to our system</p>
              <p style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
                Forward the email to {couponEmail} <FiSend style={{ verticalAlign: 'middle' }} />
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Coupon is automatically added</p>
              <p style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
                Our system processes the email and adds the coupon to your collection <FiCheckCircle style={{ verticalAlign: 'middle', color: theme.colors.success.main }} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;