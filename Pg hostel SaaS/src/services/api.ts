// StayNest Centralized API Client

const BASE_URL = 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('staynest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // 1. Auth
  auth: {
    register: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
      const data = await res.json();
      if (data.token) localStorage.setItem('staynest_token', data.token);
      return data;
    },
    login: async (email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      const data = await res.json();
      if (data.token) localStorage.setItem('staynest_token', data.token);
      return data;
    },
    me: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    logout: async () => {
      localStorage.removeItem('staynest_token');
      try {
        await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: getHeaders() });
      } catch (e) {
        // Ignore logout errors
      }
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to change password');
      return res.json();
    }
  },

  // 2. Dashboard
  dashboard: {
    getSummary: async (propertyId: string = 'all') => {
      const res = await fetch(`${BASE_URL}/owner/dashboard/summary?propertyId=${propertyId}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch summary');
      return res.json();
    },
    getOccupancy: async () => {
      const res = await fetch(`${BASE_URL}/owner/dashboard/occupancy`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch occupancy');
      return res.json();
    },
    getRevenue: async () => {
      const res = await fetch(`${BASE_URL}/owner/dashboard/revenue`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch revenue');
      return res.json();
    },
    getRecentActivity: async () => {
      const res = await fetch(`${BASE_URL}/owner/dashboard/recent-activity`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch activity');
      return res.json();
    }
  },

  // 3. Properties
  properties: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/owner/properties`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/properties`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create property');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/owner/properties/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update property');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/owner/properties/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to deactivate property');
      return res.json();
    }
  },

  // 4. Staff
  staff: {
    getAll: async (role?: string) => {
      const url = role ? `${BASE_URL}/owner/staff?role=${role}` : `${BASE_URL}/owner/staff`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch staff');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/staff`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create staff');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/owner/staff/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update staff');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/owner/staff/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to deactivate staff');
      return res.json();
    }
  },

  // 5. Tenants
  tenants: {
    getAll: async (propertyId?: string, status?: string) => {
      const params = new URLSearchParams();
      if (propertyId && propertyId !== 'all') params.append('propertyId', propertyId);
      if (status && status !== 'all') params.append('status', status);
      const res = await fetch(`${BASE_URL}/owner/tenants?${params.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch tenants');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/tenants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to register tenant');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/owner/tenants/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update tenant');
      return res.json();
    },
    checkOut: async (id: string) => {
      const res = await fetch(`${BASE_URL}/owner/tenants/${id}/check-out`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to check out tenant');
      return res.json();
    }
  },

  // 6. Rooms & Beds
  rooms: {
    getAll: async (propertyId?: string) => {
      const url = propertyId && propertyId !== 'all' 
        ? `${BASE_URL}/owner/rooms?propertyId=${propertyId}` 
        : `${BASE_URL}/owner/rooms`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch rooms');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/rooms`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create room');
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/owner/rooms/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update room');
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/owner/rooms/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete room');
      return res.json();
    }
  },

  beds: {
    allocate: async (bedId: string, tenantId: string, monthlyRent?: number) => {
      const res = await fetch(`${BASE_URL}/owner/beds/${bedId}/allocate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ tenantId, monthlyRent })
      });
      if (!res.ok) throw new Error('Failed to allocate bed');
      return res.json();
    },
    update: async (bedId: string, monthlyRent: number) => {
      const res = await fetch(`${BASE_URL}/owner/beds/${bedId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ monthlyRent })
      });
      if (!res.ok) throw new Error('Failed to update bed rent');
      return res.json();
    },
    deallocate: async (bedId: string) => {
      const res = await fetch(`${BASE_URL}/owner/beds/${bedId}/deallocate`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to deallocate bed');
      return res.json();
    }
  },

  // 7. Finance
  finance: {
    getSummary: async (propertyId?: string) => {
      const url = propertyId && propertyId !== 'all' 
        ? `${BASE_URL}/owner/finance/summary?propertyId=${encodeURIComponent(propertyId)}`
        : `${BASE_URL}/owner/finance/summary`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch finance summary');
      return res.json();
    },
    getCollections: async () => {
      const res = await fetch(`${BASE_URL}/owner/finance/collections`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch collections');
      return res.json();
    },
    createPayment: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/finance/payments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to record payment');
      return res.json();
    }
  },

  // 8. Complaints
  complaints: {
    getAll: async (propertyId?: string, status?: string) => {
      const params = new URLSearchParams();
      if (propertyId && propertyId !== 'all') params.append('propertyId', propertyId);
      if (status && status !== 'all') params.append('status', status);
      const res = await fetch(`${BASE_URL}/owner/complaints?${params.toString()}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch complaints');
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/complaints`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create complaint');
      return res.json();
    },
    update: async (code: string, data: any) => {
      const res = await fetch(`${BASE_URL}/owner/complaints/${code}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update complaint');
      return res.json();
    }
  },

  // 9. Reports & Policies
  reports: {
    getOccupancy: async () => {
      const res = await fetch(`${BASE_URL}/owner/reports/occupancy`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch report');
      return res.json();
    },
    getPolicies: async () => {
      const res = await fetch(`${BASE_URL}/owner/policies`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch policies');
      return res.json();
    },
    updatePolicies: async (data: any) => {
      const res = await fetch(`${BASE_URL}/owner/policies`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update policies');
      return res.json();
    }
  }
};
