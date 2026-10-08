import { initialCustomers, initialCars, initialServices, initialUsers } from '../data/mockData';

const CUSTOMERS_KEY = 'autocare_customers';
const CARS_KEY = 'autocare_cars';
const SERVICES_KEY = 'autocare_services';
const USERS_KEY = 'autocare_users';

// Initialize storage if empty
const initStorage = () => {
  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(initialCustomers));
  }
  if (!localStorage.getItem(CARS_KEY)) {
    localStorage.setItem(CARS_KEY, JSON.stringify(initialCars));
  }
  if (!localStorage.getItem(SERVICES_KEY)) {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(initialServices));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
};

initStorage();

export const storage = {
  // Reset to default sample data anytime
  resetData: () => {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(initialCustomers));
    localStorage.setItem(CARS_KEY, JSON.stringify(initialCars));
    localStorage.setItem(SERVICES_KEY, JSON.stringify(initialServices));
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  },

  // 1. CUSTOMERS
  getCustomers: () => {
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    return customers.map((c) => {
      const custCars = cars.filter((car) => car.customerId === c._id);
      return {
        ...c,
        carCount: custCars.length,
        cars: custCars,
      };
    });
  },

  getCustomerById: (id) => {
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    return customers.find((c) => c._id === id);
  },

  createCustomer: (customerData) => {
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const newCustomer = {
      _id: 'cust-' + Date.now(),
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      address: customerData.address?.trim() || '',
      createdAt: new Date().toISOString(),
    };
    customers.unshift(newCustomer);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    return newCustomer;
  },

  updateCustomer: (id, updateData) => {
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const index = customers.findIndex((c) => c._id === id);
    if (index === -1) throw new Error('Customer not found');
    customers[index] = {
      ...customers[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    return customers[index];
  },

  deleteCustomer: (id) => {
    let customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    let cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    let services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');

    const customerCars = cars.filter((c) => c.customerId === id);
    const carIds = customerCars.map((c) => c._id);

    // Cascade delete
    services = services.filter((s) => !carIds.includes(s.carId));
    cars = cars.filter((c) => c.customerId !== id);
    customers = customers.filter((c) => c._id !== id);

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  // 2. CARS
  getCars: (search = '', status = 'all') => {
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');

    let list = cars.map((car) => {
      const customer = customers.find((c) => c._id === car.customerId) || null;
      const carServices = services
        .filter((s) => s.carId === car._id)
        .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

      const activeService = carServices.find((s) =>
        ['Pending', 'In Service'].includes(s.status)
      );

      let currentStatus = 'Ready';
      if (activeService) {
        currentStatus = activeService.status;
      } else if (carServices.length > 0) {
        currentStatus = carServices[0].status;
      }

      return {
        ...car,
        customerId: customer,
        lastService: carServices.length > 0 ? carServices[0].serviceDate : null,
        latestServiceType: carServices.length > 0 ? carServices[0].serviceType : null,
        currentStatus,
        serviceCount: carServices.length,
      };
    });

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter((c) => {
        const regMatch = c.registrationNumber?.toLowerCase().includes(q);
        const nameMatch = c.carName?.toLowerCase().includes(q);
        const modelMatch = c.model?.toLowerCase().includes(q);
        const custMatch = c.customerId?.name?.toLowerCase().includes(q);
        const phoneMatch =
          c.phone?.toLowerCase().includes(q) ||
          c.customerId?.phone?.toLowerCase().includes(q);
        return regMatch || nameMatch || modelMatch || custMatch || phoneMatch;
      });
    }

    if (status && status !== 'all') {
      list = list.filter(
        (c) => c.currentStatus?.toLowerCase() === status.toLowerCase()
      );
    }

    return list;
  },

  getCarById: (id) => {
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');

    const car = cars.find((c) => c._id === id);
    if (!car) return null;

    const customer = customers.find((c) => c._id === car.customerId) || null;
    const carServices = services
      .filter((s) => s.carId === car._id)
      .map((s) => ({
        ...s,
        carId: car,
        customerId: customer,
      }))
      .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

    const activeService = carServices.find((s) =>
      ['Pending', 'In Service'].includes(s.status)
    );

    const currentStatus = activeService
      ? activeService.status
      : carServices.length > 0
      ? carServices[0].status
      : 'Ready';

    return {
      ...car,
      customerId: customer,
      services: carServices,
      currentStatus,
      totalServices: carServices.length,
      totalSpent: carServices.reduce((acc, s) => acc + (s.totalCost || 0), 0),
    };
  },

  createCar: (carData) => {
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');

    let customerId = carData.customerId;

    // Inline customer creation if needed
    if (!customerId && carData.newCustomerName) {
      let existingCust = customers.find(
        (c) => c.phone.trim() === carData.newCustomerPhone.trim()
      );
      if (!existingCust) {
        existingCust = {
          _id: 'cust-' + Date.now(),
          name: carData.newCustomerName.trim(),
          phone: carData.newCustomerPhone.trim(),
          address: carData.newCustomerAddress?.trim() || '',
          createdAt: new Date().toISOString(),
        };
        customers.unshift(existingCust);
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      }
      customerId = existingCust._id;
    }

    const newCar = {
      _id: 'car-' + Date.now(),
      customerId,
      carName: carData.carName.trim(),
      model: carData.model.trim(),
      registrationNumber: carData.registrationNumber.toUpperCase().trim(),
      chassisNumber: carData.chassisNumber?.toUpperCase().trim() || '',
      currentKm: Number(carData.currentKm) || 0,
      phone: carData.phone?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    cars.unshift(newCar);
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return newCar;
  },

  updateCar: (id, updateData) => {
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const index = cars.findIndex((c) => c._id === id);
    if (index === -1) throw new Error('Car not found');

    cars[index] = {
      ...cars[index],
      ...updateData,
      currentKm: Number(updateData.currentKm) || cars[index].currentKm,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    return cars[index];
  },

  deleteCar: (id) => {
    let cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    let services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');

    cars = cars.filter((c) => c._id !== id);
    services = services.filter((s) => s.carId !== id);

    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  // 3. SERVICES
  getServices: (search = '', status = 'all', carId = null) => {
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');

    let list = services.map((s) => {
      const car = cars.find((c) => c._id === s.carId) || null;
      const customer = customers.find((c) => c._id === (s.customerId || car?.customerId)) || null;
      return {
        ...s,
        carId: car,
        customerId: customer,
      };
    });

    if (carId) {
      list = list.filter((s) => s.carId?._id === carId || s.carId === carId);
    }

    if (status && status !== 'all') {
      list = list.filter((s) => s.status?.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter((s) => {
        const carMatch =
          s.carId?.carName?.toLowerCase().includes(q) ||
          s.carId?.registrationNumber?.toLowerCase().includes(q) ||
          s.carId?.model?.toLowerCase().includes(q);
        const custMatch =
          s.customerId?.name?.toLowerCase().includes(q) ||
          s.customerId?.phone?.toLowerCase().includes(q);
        const codeMatch = s.serviceCode?.toLowerCase().includes(q);
        const typeMatch = s.serviceType?.toLowerCase().includes(q);
        return carMatch || custMatch || codeMatch || typeMatch;
      });
    }

    return list.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
  },

  getDashboardStats: () => {
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');

    const totalCars = cars.length;
    const totalCustomers = customers.length;
    const activeServices = services.filter((s) =>
      ['Pending', 'In Service'].includes(s.status)
    ).length;
    const completedServices = services.filter((s) =>
      ['Completed', 'Delivered'].includes(s.status)
    ).length;

    const populatedServices = services.map((s) => {
      const car = cars.find((c) => c._id === s.carId) || null;
      const customer = customers.find((c) => c._id === (s.customerId || car?.customerId)) || null;
      return {
        ...s,
        carId: car,
        customerId: customer,
      };
    }).sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

    const recentServices = populatedServices.slice(0, 6);
    const inServiceList = populatedServices.filter((s) =>
      ['Pending', 'In Service'].includes(s.status)
    );

    return {
      stats: {
        totalCars,
        totalCustomers,
        activeServices,
        completedServices,
      },
      recentServices,
      inServiceList,
    };
  },

  createService: (serviceData) => {
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');

    const car = cars.find((c) => c._id === serviceData.carId);
    if (!car) throw new Error('Car not found');

    const nextCount = services.length + 1;
    const serviceCode = `SRV-${String(nextCount).padStart(4, '0')}`;
    const labour = Number(serviceData.labourCost) || 0;
    const partsCost = Number(serviceData.partsCost) || 0;
    const total =
      serviceData.totalCost !== undefined && serviceData.totalCost !== null && serviceData.totalCost !== ''
        ? Number(serviceData.totalCost)
        : labour + partsCost;

    const newService = {
      _id: 'srv-' + Date.now(),
      serviceCode,
      carId: serviceData.carId,
      customerId: serviceData.customerId || car.customerId,
      serviceDate: serviceData.serviceDate || new Date().toISOString().split('T')[0],
      serviceType: serviceData.serviceType || 'General Service',
      currentKm: Number(serviceData.currentKm) || car.currentKm || 0,
      status: serviceData.status || 'Pending',
      expectedDeliveryDate: serviceData.expectedDeliveryDate || null,
      workDescription: serviceData.workDescription?.trim() || '',
      parts: serviceData.parts?.trim() || '',
      labourCost: labour,
      partsCost: partsCost,
      totalCost: total,
      notes: serviceData.notes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    services.unshift(newService);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));

    // Update car odometer if higher
    if (newService.currentKm > car.currentKm) {
      const carIndex = cars.findIndex((c) => c._id === car._id);
      if (carIndex !== -1) {
        cars[carIndex].currentKm = newService.currentKm;
        localStorage.setItem(CARS_KEY, JSON.stringify(cars));
      }
    }

    return newService;
  },

  updateService: (id, updateData) => {
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    const cars = JSON.parse(localStorage.getItem(CARS_KEY) || '[]');
    const index = services.findIndex((s) => s._id === id);
    if (index === -1) throw new Error('Service record not found');

    const labour = updateData.labourCost !== undefined ? Number(updateData.labourCost) : services[index].labourCost;
    const partsCost = updateData.partsCost !== undefined ? Number(updateData.partsCost) : services[index].partsCost;
    const total =
      updateData.totalCost !== undefined && updateData.totalCost !== null && updateData.totalCost !== ''
        ? Number(updateData.totalCost)
        : (labour || 0) + (partsCost || 0);

    services[index] = {
      ...services[index],
      ...updateData,
      labourCost: labour,
      partsCost: partsCost,
      totalCost: total,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));

    // Update car KM if higher
    const carIndex = cars.findIndex((c) => c._id === services[index].carId);
    if (carIndex !== -1 && services[index].currentKm > cars[carIndex].currentKm) {
      cars[carIndex].currentKm = services[index].currentKm;
      localStorage.setItem(CARS_KEY, JSON.stringify(cars));
    }

    return services[index];
  },

  deleteService: (id) => {
    let services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    services = services.filter((s) => s._id !== id);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  // 4. USERS
  getUsers: () => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  createUser: (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser = {
      _id: 'user-' + Date.now(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'Admin',
      createdAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  updateUser: (id, updateData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = {
      ...users[index],
      name: updateData.name || users[index].name,
      email: updateData.email || users[index].email,
      role: updateData.role || users[index].role,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  },

  deleteUser: (id) => {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    users = users.filter((u) => u._id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
};
