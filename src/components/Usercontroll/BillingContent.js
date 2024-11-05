import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Fade,
  CircularProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import API from '../../api/config';
// Import icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { alpha } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Coins } from 'lucide-react';

// Enhanced styled components
const DashboardCard = styled(Box)(({ theme, planId }) => ({
  padding: theme.spacing(4, 3, 3, 3),
  background: '#FFFFFF',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'visible',
  height: '340px',
  width: '100%',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
    '& .hover-button': {
      opacity: 1,
      transform: 'translateX(-50%) translateY(0)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: planId === 'yearly' ? 
      'linear-gradient(180deg, rgba(255, 183, 0, 0.1) 0%, rgba(255, 183, 0, 0) 100%)' :
      planId === 'six_month' ?
      'linear-gradient(180deg, rgba(155, 138, 251, 0.1) 0%, rgba(155, 138, 251, 0) 100%)' :
      planId === 'free' ?
      'linear-gradient(180deg, rgba(253, 162, 155, 0.1) 0%, rgba(253, 162, 155, 0) 100%)' :
      'linear-gradient(180deg, rgba(244, 243, 255, 0.1) 0%, rgba(244, 243, 255, 0) 100%)',
    borderRadius: '16px 16px 0 0',
    opacity: 0.5
  },
  '& .corner-shape': {
    position: 'absolute',
    width: '60px',
    height: '60px',
    transition: 'transform 0.3s ease',
    opacity: 0.1,
    zIndex: 0
  },
  '& .corner-shape-top': {
    top: 0,
    right: 0,
    borderTop: planId === 'yearly' ? '60px solid #FFB700' :
              planId === 'six_month' ? '60px solid #9B8AFB' :
              planId === 'free' ? '60px solid #FDA29B' :
              '60px solid #444CE7',
    borderLeft: '60px solid transparent',
    borderRadius: '0 16px 0 0'
  },
  '& .corner-shape-bottom': {
    bottom: 0,
    left: 0,
    borderBottom: planId === 'yearly' ? '60px solid #FFB700' :
                 planId === 'six_month' ? '60px solid #9B8AFB' :
                 planId === 'free' ? '60px solid #FDA29B' :
                 '60px solid #444CE7',
    borderRight: '60px solid transparent',
    borderRadius: '0 0 0 16px'
  }
}));

const IconWrapper = styled(Box)(({ color = '#1976D2' }) => ({
  width: 40,
  height: 40,
  borderRadius: '12px',
  background: alpha(color, 0.1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  '& svg': {
    color: color,
    fontSize: 20
  }
}));

const StatsCard = styled(Box)(({ theme }) => ({
  padding: '16px',
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid rgba(231, 235, 255, 0.12)',
  height: '160px',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.06)',
    '&::after': {
      opacity: 1
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '16px',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none'
  }
}));

const IconBox = styled(Box)(({ bgColor = '#F4F3FF' }) => ({
  width: 36,
  height: 36,
  borderRadius: '10px',
  background: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  '& svg': {
    fontSize: 20
  }
}));

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: 'rgba(101, 98, 255, 0.12)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
    backgroundColor: '#6562FF'
  }
}));

// Update getUpgradeRecommendation to not include savings message
const getUpgradeRecommendation = (currentPlan, planName) => {
  if (!currentPlan) return null;

  const planTypes = {
    'Monthly Plan': 1,
    'Three Months Plan': 2,
    'Six Months Plan': 3,
    'Yearly Plan': 4
  };

  const currentPlanName = currentPlan === 'monthly' ? 'Monthly Plan' : currentPlan;
  const currentTier = planTypes[currentPlanName];
  const planTier = planTypes[planName];

  if (planTier === currentTier + 1) {
    return {
      recommended: true,
      highlight: true
    };
  }
  return null;
};

// Update the HoverButton component with better styling
const HoverButton = styled(Button)(({ theme, planId, isCurrentPlan }) => ({
  position: 'absolute',
  left: '50%',
  bottom: -20,
  transform: 'translateX(-50%) translateY(10px)',
  opacity: 0,
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '8px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,

  // Conditional styling based on plan and current status
  ...(isCurrentPlan ? {
    backgroundColor: '#FEF3F2',
    color: '#B42318',
    border: '1px solid #FDA29B',
    '&:hover': {
      backgroundColor: '#FEE4E2',
      border: '1px solid #FDA29B',
    }
  } : {
    backgroundColor: getPlanButtonColor(planId).bg,
    color: getPlanButtonColor(planId).text,
    border: `1px solid ${getPlanButtonColor(planId).border}`,
    '&:hover': {
      backgroundColor: getPlanButtonColor(planId).hover,
      border: `1px solid ${getPlanButtonColor(planId).border}`,
    }
  }),

  '&:hover': {
    transform: 'translateX(-50%) translateY(5px)',
  }
}));

// Add this helper function for button colors
const getPlanButtonColor = (planId) => {
  switch (planId) {
    case 'yearly':
      return {
        bg: '#FFFAEB',
        text: '#B54708',
        border: '#FFB700',
        hover: '#FEF0C7'
      };
    case 'six_month':
      return {
        bg: '#F4F3FF',
        text: '#5925DC',
        border: '#9B8AFB',
        hover: '#EBE9FE'
      };
    case 'three_month':
      return {
        bg: '#ECFDF3',
        text: '#027A48',
        border: '#12B76A',
        hover: '#D1FADF'
      };
    case 'monthly':
      return {
        bg: '#F4F3FF',
        text: '#444CE7',
        border: '#444CE7',
        hover: '#EBE9FE'
      };
    default:
      return {
        bg: '#F9FAFB',
        text: '#344054',
        border: '#D0D5DD',
        hover: '#F2F4F7'
      };
  }
};

// Add missing components/functions
const PlansGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  width: '100%'
}));

// Add a function to determine card border color and style
const getCardBorderStyle = (plan, isCurrentPlan, recommendation) => {
  if (isCurrentPlan) {
    return '2px solid #444CE7';
  }
  if (recommendation?.highlight) {
    return '2px solid #12B76A';
  }
  switch (plan.id) {
    case 'free':
      return '2px solid #FDA29B';
    case 'six_month':
      return '2px solid #9B8AFB';
    case 'yearly':
      return '2px solid #FFB700';
    default:
      return '1px solid rgba(231, 235, 255, 0.7)';
  }
};

// Add this constant at the top of your component
const MONTHLY_PRICE = 499; // Base monthly price in rupees

// Update the calculateSavings function to return rounded numbers
const calculateSavings = (plan) => {
  let monthlyEquivalent;
  let savings = 0;

  switch (plan.id) {
    case 'three_month':
      monthlyEquivalent = Math.round((plan.priceInPaisa / 100) / 3);
      savings = Math.round(((MONTHLY_PRICE - monthlyEquivalent) / MONTHLY_PRICE) * 100);
      return { percent: savings, monthly: monthlyEquivalent };
    case 'six_month':
      monthlyEquivalent = Math.round((plan.priceInPaisa / 100) / 6);
      savings = Math.round(((MONTHLY_PRICE - monthlyEquivalent) / MONTHLY_PRICE) * 100);
      return { percent: savings, monthly: monthlyEquivalent };
    case 'yearly':
      monthlyEquivalent = Math.round((plan.priceInPaisa / 100) / 12);
      savings = Math.round(((MONTHLY_PRICE - monthlyEquivalent) / MONTHLY_PRICE) * 100);
      return { percent: savings, monthly: monthlyEquivalent };
    default:
      return null;
  }
};

const getStatusColor = (type) => {
  const colors = {
    deposit: { bg: '#ECFDF3', color: '#12B76A' },
    withdrawal: { bg: '#FEF3F2', color: '#F04438' },
    subscription_payment: { bg: '#F9F5FF', color: '#7F56D9' },
    subscription_cancellation: { bg: '#FFF6ED', color: '#F79009' },
    credit_purchase: { bg: '#EEF4FF', color: '#444CE7' }
  };
  return colors[type] || { bg: '#F2F4F7', color: '#344054' };
};

const getStatusBgColor = (status) => {
  const colors = {
    completed: '#ECFDF3',
    pending: '#FFF6ED',
    failed: '#FEF3F2'
  };
  return colors[status] || '#F2F4F7';
};

const getStatusTextColor = (status) => {
  const colors = {
    completed: '#12B76A',
    pending: '#F79009',
    failed: '#F04438'
  };
  return colors[status] || '#344054';
};

const calculateDaysRemaining = (endDate) => {
  if (!endDate) return 0;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Simplified styled components for plans
const PlanRow = styled(Box)(({ theme, isCurrentPlan }) => ({
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
  border: `1px solid ${isCurrentPlan ? '#E0E7FF' : '#F2F4F7'}`,
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#FAFBFF',
    borderColor: '#D1D5DB',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  '&::before': isCurrentPlan ? {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: '#6366F1',
    borderRadius: '4px 0 0 4px'
  } : {}
}));

const PlanInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
});

const PlanDetails = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '32px'
});

// Update the PlanFeature styled component with new colors
const PlanFeature = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 12px',
  borderRadius: '20px',
  backgroundColor: '#F0F9FF',  // Lighter blue background
  '& svg': {
    fontSize: '16px',
    color: '#0EA5E9'  // Bright blue for icon
  }
});

const PlanContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  borderRadius: '16px',
  backgroundColor: '#FAFAFA',
  marginTop: '24px'
}));

const BillingContent = ({ onTabChange }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    subscription: true,
    plans: true,
    transactions: true
  });
  const [generalError, setGeneralError] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [buttonLoading, setButtonLoading] = useState({
    upgrade: false,
    cancel: false
  });

  const handleCloseSnackbar = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
      fetchAvailablePlans();
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    if (generalError) {
      const timer = setTimeout(() => {
        setGeneralError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, generalError]);

  useEffect(() => {
    console.log('Current Plan:', subscriptionStatus?.plan);
    console.log('Available Plans:', availablePlans);
  }, [subscriptionStatus, availablePlans]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await API.get('/subscription/status');
      console.log('Subscription status response:', response.data);
      setSubscriptionStatus(response.data);
      setCurrentPlan(response.data.plan);
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setErrors(prev => ({ ...prev, subscription: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, subscription: false }));
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const response = await API.get('/subscription/plans');
      setAvailablePlans(response.data);
    } catch (err) {
      console.error('Error fetching available plans:', err);
      setErrors(prev => ({ ...prev, plans: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const response = await API.get('/subscription/history');
      
      if (response.data) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setErrors(prev => ({ ...prev, transactions: error.message }));
      showNotification('Failed to load transaction history', 'error');
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setButtonLoading(prev => ({ ...prev, upgrade: true }));
      console.log('Attempting to upgrade to plan:', planId);

      // Get current subscription status
      const statusResponse = await API.get('/subscription/status');
      const currentPlan = statusResponse.data.plan;

      if (currentPlan === planId) {
        showNotification('You are already subscribed to this plan', 'warning');
        return;
      }

      // Proceed with upgrade without confirmation dialog
      const response = await API.post(`/subscription/plans/${planId}/upgrade`);
      console.log('Upgrade response:', response.data);

      if (response.data.success) {
        showNotification(`Successfully upgraded to ${planId} plan!`, 'success');
        await Promise.all([
          fetchSubscriptionStatus(),
          fetchTransactions()
        ]);
      } else {
        throw new Error(response.data.message || 'Failed to upgrade subscription');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      showNotification(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to upgrade subscription', 
        'error'
      );
    } finally {
      setButtonLoading(prev => ({ ...prev, upgrade: false }));
    }
  };

  const handleCancel = async () => {
    try {
      setButtonLoading(prev => ({ ...prev, cancel: true }));
      
      // Proceed with cancellation without confirmation dialog
      const response = await API.post('/subscription/cancel');
      console.log('Cancel response:', response.data);

      if (response.data.success) {
        showNotification('Successfully cancelled subscription', 'success');
        await Promise.all([
          fetchSubscriptionStatus(),
          fetchTransactions()
        ]);
      } else {
        throw new Error(response.data.message || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('Cancel error:', err);
      showNotification(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to cancel subscription', 
        'error'
      );
    } finally {
      setButtonLoading(prev => ({ ...prev, cancel: false }));
    }
  };

  const renderActionButton = (plan, isCurrentPlan) => {
    const isLoading = buttonLoading[isCurrentPlan ? 'cancel' : 'upgrade'];

    return (
      <HoverButton
        className="hover-button"
        planId={plan.id}
        isCurrentPlan={isCurrentPlan}
        onClick={() => isCurrentPlan ? handleCancel() : handleUpgrade(plan.id)}
        disabled={isLoading || (plan.id === 'free' && !isCurrentPlan)}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          isCurrentPlan ? 'Cancel Plan' : 'Upgrade Plan'
        )}
      </HoverButton>
    );
  };

  // Add this section where your current plans grid is
  const renderAvailablePlans = () => (
    <PlanContainer>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          color: '#111827',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <BoltIcon sx={{ color: '#0EA5E9' }} />
        Available Plans
      </Typography>

      {availablePlans.map((plan) => {
        const isCurrentPlan = plan.id === currentPlan;
        
        return (
          <PlanRow key={plan.id} isCurrentPlan={isCurrentPlan}>
            <PlanInfo>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#111827'
                  }}
                >
                  {plan.name}
                </Typography>
                {isCurrentPlan && (
                  <Chip
                    size="small"
                    label="Current"
                    sx={{
                      bgcolor: '#F0F9FF',
                      color: '#0EA5E9',
                      fontSize: '12px',
                      height: '24px',
                      fontWeight: 500
                    }}
                  />
                )}
              </Box>
            </PlanInfo>

            <PlanDetails>
              <PlanFeature>
                <BoltIcon />
                <Typography sx={{ 
                  color: '#0369A1', // Darker blue for text
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {plan.creditsPerDay} credits/day
                </Typography>
              </PlanFeature>

              <Typography sx={{ 
                fontWeight: 600,
                color: '#111827',
                fontSize: '16px',
                minWidth: '100px'
              }}>
                {plan.id === 'free' ? (
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    bgcolor: '#ECFDF5',
                    color: '#059669',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    Free Plan
                  </Box>
                ) : (
                  <>
                    ₹{((plan.priceInPaisa || 0) / 100).toFixed(2)}
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontSize: '12px',
                        color: '#6B7280',
                        ml: 0.5
                      }}
                    >
                      /month
                    </Typography>
                  </>
                )}
              </Typography>

              {(!isCurrentPlan && plan.id !== 'free') && (
                <Button
                  variant="outlined"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={buttonLoading.upgrade || plan.id === currentPlan}
                  sx={{
                    minWidth: '120px',
                    height: '36px',
                    textTransform: 'none',
                    borderColor: '#E0E7FF',
                    color: '#4F46E5',
                    backgroundColor: '#F5F8FF',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#EEF2FF',
                      borderColor: '#C7D2FE'
                    },
                    '&:disabled': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#E0E0E0',
                      color: '#9E9E9E'
                    }
                  }}
                >
                  {buttonLoading.upgrade ? (
                    <CircularProgress size={20} sx={{ color: '#4F46E5' }} />
                  ) : (
                    'Upgrade Plan'
                  )}
                </Button>
              )}

              {isCurrentPlan && plan.id !== 'free' && (
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={buttonLoading.cancel}
                  sx={{
                    minWidth: '120px',
                    height: '36px',
                    textTransform: 'none',
                    borderColor: '#FEE2E2',
                    color: '#DC2626',
                    backgroundColor: '#FEF2F2',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#FEE2E2',
                      borderColor: '#FECACA'
                    },
                    '&:disabled': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#E0E0E0',
                      color: '#9E9E9E'
                    }
                  }}
                >
                  {buttonLoading.cancel ? (
                    <CircularProgress size={20} sx={{ color: '#DC2626' }} />
                  ) : (
                    'Cancel Plan'
                  )}
                </Button>
              )}
            </PlanDetails>
          </PlanRow>
        );
      })}
    </PlanContainer>
  );

  return (
    <Box sx={{ p: 1, maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: '20px',
          fontWeight: 600,
          color: '#101828',
          mb: 0.5
        }}>
          Billing Dashboard
        </Typography>
      </Box>

      {/* Main Stats Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
        gap: 1,
        mb: 1
      }}>
        {/* Account Status */}
        <StatsCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconBox bgColor="#F4F3FF">
              <CreditCardIcon sx={{ color: '#9B8AFB' }} />
            </IconBox>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#475467' }}>
                Account Status
              </Typography>
              <Typography variant="body2" sx={{ color: '#667085' }}>
                {subscriptionStatus?.plan || 'Free Plan'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#101828', mb: 1 }}>
              Active
            </Typography>
            <Typography variant="body2" sx={{ color: '#667085' }}>
              Plan Usage: 65%
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={65} 
              sx={{ 
                height: 6,
                borderRadius: 3,
                bgcolor: '#F4F3FF',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: '#9B8AFB'
                }
              }} 
            />
          </Box>
        </StatsCard>

        {/* Credits Usage */}
        <StatsCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconBox bgColor="#ECFDF3">
              <Coins sx={{ color: '#12B76A' }} />
            </IconBox>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#475467' }}>
                Credits
              </Typography>
              <Typography variant="body2" sx={{ color: '#667085' }}>
                Daily Usage
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#101828', mr: 1 }}>
              {subscriptionStatus?.creditsRemaining || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#667085' }}>
              / {subscriptionStatus?.creditsPerDay || 0}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: '#12B76A'
          }}>
            <TrendingUpIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              {Math.round((subscriptionStatus?.creditsRemaining / subscriptionStatus?.creditsPerDay) * 100)}% left
            </Typography>
          </Box>
        </StatsCard>

        {/* Time Remaining */}
        <StatsCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconBox bgColor="#FFF4ED">
              <AccessTimeIcon sx={{ color: '#F79009' }} />
            </IconBox>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#475467' }}>
                Time Remaining
              </Typography>
              <Typography variant="body2" sx={{ color: '#667085' }}>
                Subscription Period
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#101828', mr: 1 }}>
              {calculateDaysRemaining(subscriptionStatus?.validUntil)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#667085' }}>
              days
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: '#F79009'
          }}>
            <UpdateIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">
              Valid Until: {subscriptionStatus?.validUntil ? new Date(subscriptionStatus.validUntil).toLocaleDateString() : 'Unlimited'}
            </Typography>
          </Box>
        </StatsCard>

        {/* Quick Actions */}
        <StatsCard>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconBox bgColor="#EEF4FF">
              <BoltIcon sx={{ color: '#444CE7' }} />
            </IconBox>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#475467' }}>
                Quick Actions
              </Typography>
              <Typography variant="body2" sx={{ color: '#667085' }}>
                Manage Account
              </Typography>
            </Box>
          </Box>
          
          {/* Updated Button with correct navigation */}
          <Button
            variant="outlined"
            fullWidth
            sx={{
              bgcolor: '#F4F3FF',
              color: '#444CE7',
              borderColor: '#E4E3FF',
              '&:hover': {
                bgcolor: '#EBE9FE',
                borderColor: '#E4E3FF'
              },
              textTransform: 'none',
              borderRadius: '8px',
              height: '36px',
              fontWeight: 500
            }}
            onClick={() => {
              // Update the parent component's activeTab state
              if (onTabChange) {
                onTabChange('integrations');
              }
            }}
          >
            Manage API Keys
          </Button>
        </StatsCard>
      </Box>

      {/* Replace the old plans grid with the new simplified version */}
      {renderAvailablePlans()}

      {/* Transaction History */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Transaction History
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E5E7EB' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading.transactions ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No transaction history available
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.formattedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type.replace('_', ' ')}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(transaction.type).bg,
                          color: getStatusColor(transaction.type).color,
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        color: transaction.type === 'deposit' ? '#12B76A' : '#F04438',
                        fontWeight: 500
                      }}>
                        {transaction.formattedAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusBgColor(transaction.status),
                          color: getStatusTextColor(transaction.status),
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          marginTop: '20px',
          marginRight: '20px'
        }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillingContent;