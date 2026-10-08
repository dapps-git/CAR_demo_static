import { storage } from '../services/storageService';

// Mock API Adapter that delivers instant client-side responses with LocalStorage persistence
const api = {
  get: async (url) => {
    // Artificial small micro-delay to simulate seamless snappy response
    await new Promise((resolve) => setTimeout(resolve, 60));

    if (url === '/auth/me') {
      const user = JSON.parse(localStorage.getItem('car_service_user') || 'null');
      if (!user) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
      return { data: user };
    }

    if (url.startsWith('/customers')) {
      return { data: storage.getCustomers() };
    }

    if (url === '/services/dashboard-stats') {
      return { data: storage.getDashboardStats() };
    }

    if (url.startsWith('/cars/')) {
      const id = url.split('/cars/')[1].split('?')[0];
      const car = storage.getCarById(id);
      if (!car) throw { response: { status: 404, data: { message: 'Car not found' } } };
      return { data: car };
    }

    if (url.startsWith('/cars')) {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const search = params.get('search') || '';
      const status = params.get('status') || 'all';
      return { data: storage.getCars(search, status) };
    }

    if (url.startsWith('/services/')) {
      const id = url.split('/services/')[1].split('?')[0];
      const services = storage.getServices();
      const srv = services.find((s) => s._id === id);
      if (!srv) throw { response: { status: 404, data: { message: 'Service not found' } } };
      return { data: srv };
    }

    if (url.startsWith('/services')) {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const search = params.get('search') || '';
      const status = params.get('status') || 'all';
      const carId = params.get('carId') || null;
      return { data: storage.getServices(search, status, carId) };
    }

    if (url.startsWith('/users')) {
      return { data: storage.getUsers() };
    }

    return { data: {} };
  },

  post: async (url, body) => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (url === '/auth/login') {
      const { email, password } = body;
      if (!email || !password) {
        throw { response: { status: 400, data: { message: 'Email and password required' } } };
      }
      const users = storage.getUsers();
      const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const userData = matched || {
        _id: 'user-demo',
        name: 'Service Manager',
        email: email,
        role: 'Admin',
      };
      return {
        data: {
          ...userData,
          token: 'static_demo_jwt_token_2026',
        },
      };
    }

    if (url === '/customers') {
      const created = storage.createCustomer(body);
      return { data: created, status: 201 };
    }

    if (url === '/cars') {
      const created = storage.createCar(body);
      const populated = storage.getCarById(created._id);
      return { data: populated, status: 201 };
    }

    if (url === '/services') {
      const created = storage.createService(body);
      return { data: created, status: 201 };
    }

    if (url === '/users') {
      const created = storage.createUser(body);
      return { data: created, status: 201 };
    }

    return { data: {} };
  },

  put: async (url, body) => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (url.startsWith('/customers/')) {
      const id = url.split('/customers/')[1];
      const updated = storage.updateCustomer(id, body);
      return { data: updated };
    }

    if (url.startsWith('/cars/')) {
      const id = url.split('/cars/')[1];
      const updated = storage.updateCar(id, body);
      const populated = storage.getCarById(id);
      return { data: populated };
    }

    if (url.startsWith('/services/')) {
      const id = url.split('/services/')[1];
      const updated = storage.updateService(id, body);
      return { data: updated };
    }

    if (url.startsWith('/users/')) {
      const id = url.split('/users/')[1];
      const updated = storage.updateUser(id, body);
      return { data: updated };
    }

    return { data: {} };
  },

  delete: async (url) => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (url.startsWith('/customers/')) {
      const id = url.split('/customers/')[1];
      storage.deleteCustomer(id);
      return { data: { message: 'Deleted' } };
    }

    if (url.startsWith('/cars/')) {
      const id = url.split('/cars/')[1];
      storage.deleteCar(id);
      return { data: { message: 'Deleted' } };
    }

    if (url.startsWith('/services/')) {
      const id = url.split('/services/')[1];
      storage.deleteService(id);
      return { data: { message: 'Deleted' } };
    }

    if (url.startsWith('/users/')) {
      const id = url.split('/users/')[1];
      storage.deleteUser(id);
      return { data: { message: 'Deleted' } };
    }

    return { data: {} };
  },
};

export default api;
