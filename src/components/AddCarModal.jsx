import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import api from '../api/axios';
import { Car, User, Plus } from 'lucide-react';

export const AddCarModal = ({ isOpen, onClose, onSuccess, initialCustomerId = null }) => {
  const [mode, setMode] = useState('existing');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  // New Customer Fields
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // Car Fields
  const [carName, setCarName] = useState('');
  const [model, setModel] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [currentKm, setCurrentKm] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      setError('');
      if (initialCustomerId) {
        setSelectedCustomerId(initialCustomerId);
        setMode('existing');
      }
    }
  }, [isOpen, initialCustomerId]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
      if (res.data.length > 0 && !selectedCustomerId && !initialCustomerId) {
        setSelectedCustomerId(res.data[0]._id);
      }
      if (res.data.length === 0) {
        setMode('new');
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    }
  };

  const resetForm = () => {
    setCarName('');
    setModel('');
    setRegistrationNumber('');
    setChassisNumber('');
    setCurrentKm('');
    setPhone('');
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!carName.trim() || !model.trim() || !registrationNumber.trim()) {
      setError('Please provide car brand/name, model, and registration plate');
      return;
    }

    if (mode === 'new' && (!newCustomerName.trim() || !newCustomerPhone.trim())) {
      setError('Please provide customer name and phone');
      return;
    }

    if (mode === 'existing' && !selectedCustomerId) {
      setError('Please select an existing customer');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        carName,
        model,
        registrationNumber: registrationNumber.toUpperCase().trim(),
        chassisNumber,
        currentKm: Number(currentKm) || 0,
        phone: phone || (mode === 'new' ? newCustomerPhone : ''),
      };

      if (mode === 'existing') {
        payload.customerId = selectedCustomerId;
      } else {
        payload.newCustomerName = newCustomerName;
        payload.newCustomerPhone = newCustomerPhone;
        payload.newCustomerAddress = newCustomerAddress;
      }

      await api.post('/cars', payload);
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Vehicle & Customer" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 1. Customer Section */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
              <User className="w-4 h-4 text-blue-600" />
              <span>Customer Information</span>
            </div>

            {/* Toggle Mode */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs">
              <button
                type="button"
                onClick={() => setMode('existing')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mode === 'existing'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Select Existing
              </button>
              <button
                type="button"
                onClick={() => setMode('new')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mode === 'new'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + New Customer
              </button>
            </div>
          </div>

          {mode === 'existing' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="select-field"
                required
              >
                {customers.length === 0 && <option value="">No customers found</option>}
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.phone} {c.address ? `(${c.address})` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="input-field"
                  required={mode === 'new'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Customer Phone *
                </label>
                <input
                  type="text"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="input-field"
                  required={mode === 'new'}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Customer Address
                </label>
                <input
                  type="text"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  placeholder="e.g. Villa 14, Royal Palm Avenue, Kochi"
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Car Details */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
            <Car className="w-4 h-4 text-blue-600" />
            <span>Vehicle Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Car Brand / Name *
              </label>
              <input
                type="text"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="e.g. Toyota Corolla, BMW 5 Series"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Model / Variant *
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Altis 1.8G, 2024"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Registration Number *
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                placeholder="e.g. KL 07 AB 1234"
                className="input-field uppercase font-mono font-bold text-blue-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Current Odometer (KM) *
              </label>
              <input
                type="number"
                value={currentKm}
                onChange={(e) => setCurrentKm(e.target.value)}
                placeholder="e.g. 45200"
                min="0"
                className="input-field font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Chassis Number / VIN
              </label>
              <input
                type="text"
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                placeholder="e.g. WBA5A5C58GH129845"
                className="input-field font-mono uppercase text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Alternate Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Driver or alternate phone"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary font-semibold"
          >
            {loading ? 'Saving Vehicle...' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
