import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { theme } from '../utils/theme';
import { FiUser, FiHeart, FiLogOut, FiSettings, FiEdit, FiSave } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getUserProfile, updateUserProfile, updatePassword } from '../services/supabase';

const ProfilePage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  
  // Get the tab from URL query parameter
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') === 'favorites' ? 'favorites' : 'settings';
  });
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        setLoading(true);
        const { profile } = await getUserProfile(user.id);
        if (profile) {
          setProfile(profile);
          setName(profile.full_name || '');
        }
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  // Redirect if user is not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleUpdateName = async () => {
    if (!user?.id) return;
    
    setMessage(null);
    try {
      const { success, error } = await updateUserProfile(user.id, { full_name: name });
      
      if (success) {
        setProfile({ ...profile, full_name: name });
        setIsEditingName(false);
        setMessage({ type: 'success', text: 'Name updated successfully' });
      } else {
        setMessage({ type: 'error', text: error?.message || 'Failed to update name' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };
  
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setMessage(null);
    setIsChangingPassword(true);
    
    try {
      const { success } = await updatePassword(newPassword);
      
      if (success) {
        setNewPassword('');
        setConfirmPassword('');
        setMessage({ type: 'success', text: 'Password updated successfully' });
      } else {
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  if (authLoading || loading) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: theme.colors.neutral[600]
      }}>
        Loading profile...
      </div>
    );
  }
  
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: theme.colors.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <FiUser size={32} />
          </div>
          
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme.colors.neutral[800],
              marginBottom: '4px'
            }}>
              {profile?.full_name || user?.email}
            </h1>
            <p style={{
              color: theme.colors.neutral[600],
              fontSize: '14px'
            }}>
              Member since {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'recently'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'white',
            color: theme.colors.neutral[700],
            border: `1px solid ${theme.colors.neutral[300]}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.neutral[100];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          <FiLogOut /> Sign Out
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${theme.colors.neutral[200]}`,
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setActiveTab('favorites')}
          style={{
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: activeTab === 'favorites' ? theme.colors.primary.main : theme.colors.neutral[600],
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'favorites' ? theme.colors.primary.main : 'transparent'}`,
            fontWeight: activeTab === 'favorites' ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiHeart /> Favorites
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: activeTab === 'settings' ? theme.colors.primary.main : theme.colors.neutral[600],
            border: 'none',
            borderBottom: `2px solid ${activeTab === 'settings' ? theme.colors.primary.main : 'transparent'}`,
            fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiSettings /> Settings
        </button>
      </div>
      
      {activeTab === 'favorites' && (
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.neutral[800],
            marginBottom: '16px'
          }}>
            Your Favorite Coupons
          </h2>
          
          {favoritesLoading ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: theme.colors.neutral[600]
            }}>
              Loading favorites...
            </div>
          ) : favorites.length === 0 ? (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              backgroundColor: theme.colors.neutral[50],
              borderRadius: theme.borderRadius.lg,
              color: theme.colors.neutral[600]
            }}>
              <p style={{ marginBottom: '16px' }}>You haven't saved any coupons yet.</p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  backgroundColor: theme.colors.primary.main,
                  color: 'white',
                  borderRadius: theme.borderRadius.md,
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Browse Coupons
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {favorites.map(coupon => (
                <Link
                  key={coupon.id}
                  to={`/coupon/${coupon.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div
                    style={{
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      borderRadius: theme.borderRadius.xl,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = theme.shadows.lg;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ 
                      padding: '12px',
                      borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: theme.colors.neutral[50],
                      position: 'relative'
                    }}>
                      <img
                        src={coupon.brand_logo || `https://via.placeholder.com/40?text=${coupon.brand}`}
                        alt={`${coupon.brand} logo`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: theme.borderRadius.md,
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontWeight: 'bold', color: theme.colors.neutral[800] }}>{coupon.brand}</h3>
                          {new Date() > new Date(coupon.expiration_date) && (
                            <div style={{
                              background: theme.colors.error.main,
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: theme.borderRadius.sm,
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              EXPIRED
                            </div>
                          )}
                        </div>
                        <p style={{ 
                          fontSize: '12px', 
                          color: theme.colors.neutral[500]
                        }}>
                          Expires: {format(new Date(coupon.expiration_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ padding: '16px' }}>
                      <p style={{ 
                        fontWeight: 'bold', 
                        color: theme.colors.accent.main,
                        fontSize: '18px',
                        marginBottom: '8px'
                      }}>
                        {coupon.savings}
                      </p>
                      <p style={{ 
                        marginBottom: '12px',
                        color: theme.colors.neutral[700]
                      }}>
                        {coupon.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: theme.colors.neutral[800],
            marginBottom: '16px'
          }}>
            Account Settings
          </h2>
          
          {message && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: theme.borderRadius.md,
              backgroundColor: message.type === 'success' ? 'rgba(240, 255, 244, 0.9)' : 'rgba(254, 242, 242, 0.9)',
              color: message.type === 'success' ? theme.colors.success.dark : theme.colors.error.dark,
              border: `1px solid ${message.type === 'success' ? theme.colors.success.main : theme.colors.error.main}`,
              fontWeight: '500'
            }}>
              {message.text}
            </div>
          )}
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.lg,
            padding: '24px',
            boxShadow: theme.shadows.sm,
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: theme.colors.neutral[800],
              marginBottom: '16px'
            }}>
              Profile Information
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.neutral[700]
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  backgroundColor: theme.colors.neutral[100],
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <label 
                  htmlFor="name"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.colors.neutral[700]
                  }}
                >
                  Full Name
                </label>
                {!isEditingName ? (
                  <button
                    onClick={() => setIsEditingName(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: 'transparent',
                      color: theme.colors.primary.main,
                      border: 'none',
                      borderRadius: theme.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FiEdit size={14} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleUpdateName}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: theme.colors.primary.main,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.borderRadius.sm,
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FiSave size={14} /> Save
                  </button>
                )}
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditingName}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  backgroundColor: isEditingName ? 'white' : theme.colors.neutral[100],
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius.lg,
            padding: '24px',
            boxShadow: theme.shadows.sm
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: theme.colors.neutral[800],
              marginBottom: '16px'
            }}>
              Change Password
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="newPassword"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.neutral[700]
                }}
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="confirmPassword"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme.colors.neutral[700]
                }}
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  fontSize: '16px'
                }}
              />
            </div>
            
            <button
              onClick={handleUpdatePassword}
              disabled={isChangingPassword}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: theme.colors.primary.main,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                opacity: isChangingPassword ? 0.7 : 1
              }}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;