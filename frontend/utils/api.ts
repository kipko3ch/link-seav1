import type { CreateLinkData, UpdateLinkData } from '@/types/link';
import type { CreateThemeData, UpdateThemeData } from '@/types/theme';
import type { LinkStats } from '@/types/analytics';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://link-sea.onrender.com/api';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const createLink = async (linkData: CreateLinkData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(linkData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create link');
    }

    return response.json();
  } catch (error) {
    console.error('Create link error:', error);
    throw error;
  }
};

export const getUserLinks = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/links`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch links');
  }

  return response.json();
};

export const updateLink = async (id: number, linkData: UpdateLinkData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(linkData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update link');
    }

    return response.json();
  } catch (error) {
    console.error('Update link error:', error);
    throw error;
  }
};

export const deleteLink = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/links/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Delete response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete link');
    }

    return {
      success: true,
      message: 'Link deleted successfully',
      linkId: id
    };
  } catch (error) {
    console.error('Delete link error:', error);
    throw error;
  }
};

export const getThemes = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/themes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch themes');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch themes error:', error);
    throw error;
  }
};

export const getActiveTheme = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/themes/active`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch active theme');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch active theme error:', error);
    throw error;
  }
};

export const createTheme = async (themeData: CreateThemeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create theme');
    }

    return response.json();
  } catch (error) {
    console.error('Create theme error:', error);
    throw error;
  }
};

export const updateTheme = async (id: number, themeData: UpdateThemeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/themes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(themeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update theme');
    }

    return response.json();
  } catch (error) {
    console.error('Update theme error:', error);
    throw error;
  }
};

export const deleteTheme = async (id: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/themes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete theme');
    }

    return response.json();
  } catch (error) {
    console.error('Delete theme error:', error);
    throw error;
  }
};

export const getPublicPage = async (username: string) => {
  try {
    const response = await fetch(`${API_URL}/public/${username}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch public page');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch public page error:', error);
    throw error;
  }
};

export const trackClick = async (linkId: number) => {
  try {
    const referrer = document.referrer;
    const response = await fetch(`${API_URL}/clicks/${linkId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referrer }),
    });

    if (!response.ok) {
      console.error('Failed to track click');
    }
  } catch (error) {
    console.error('Track click error:', error);
    throw error;
  }
};

export const getLinkStats = async (linkId: number): Promise<{ stats: LinkStats }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/clicks/${linkId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch link statistics');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch link statistics error:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset email');
    }

    return response.json();
  } catch (error) {
    console.error('Request password reset error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }

    return response.json();
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const updateProfile = async (data: { username?: string; bio?: string }) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Updating profile with:', data); // Debug log

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update password');
    }

    return response.json();
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch profile error:', error);
    throw error;
  }
};

export const cleanupOrphanedLinks = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/links/cleanup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cleanup links');
    }

    return response.json();
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
};