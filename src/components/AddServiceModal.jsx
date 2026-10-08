import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import api from '../api/axios';
import { Wrench, DollarSign, Calendar, FileText } from 'lucide-react';

export const AddServiceModal = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedCarId = null,
  editService = null,
}) => {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState('');
  const [serviceDate, setServiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [serviceType, setServiceType] = useState('General Service');
  const [currentKm, setCurrentKm] = useState('');
  const [status, setStatus] = useState('Pending');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [parts, setParts] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    'General Service',
    'Oil Service',
    'AC Service',
    'Brake Service',
    'Engine Service',
    'Major Service',
    'Other',
  ];

  const statuses = ['Pending', 'In Service', 'Completed', 'Delivered'];

  useEffect(() => {
    if (isOpen) {
      fetchCars();
      if (editService) {
        setCarId(editService.carId?._id || editService.carId || '');
        setServiceDate(
          editService.serviceDate
            ? new Date(editService.serviceDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        );
        setServiceType(editService.serviceType || 'General Service');
        setCurrentKm(editService.currentKm || '');
        setStatus(editService.status || 'Pending');
        setExpectedDeliveryDate(
          editService.expectedDeliveryDate
            ? new Date(editService.expectedDeliveryDate).toISOString().split('T')[0]
            : ''
        );
        setWorkDescription(editService.workDescription || '');
        setParts(editService.parts || '');
        setLabourCost(editService.labourCost || '');
        setPartsCost(editService.partsCost || '');
        setTotalCost(editService.totalCost || '');
        setNotes(editService.notes || '');
      } else {
        resetForm();
        if (preselectedCarId) {
          setCarId(preselectedCarId);
        }
      }
    }
  }, [isOpen, editService, preselectedCarId]);

  useEffect(() => {
    if (carId && !editService && cars.length > 0) {
      const selected = cars.find((c) => c._id === carId);
      if (selected && selected.currentKm) {
        setCurrentKm(selected.currentKm);
      }
    }
  }, [carId, cars, editService]);

  const handleLabourChange = (val) => {
    setLabourCost(val);
    const l = Number(val) || 0;
    const p = Number(partsCost) || 0;
    setTotalCost(l + p);
  };

  const handlePartsCostChange = (val) => {
    setPartsCost(val);
    const l = Number(labourCost) || 0;
    const p = Number(val) || 0;
    setTotalCost(l + p);
  };

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data);
      if (res.data.length > 0 && !carId && !preselectedCarId && !editService) {
        setCarId(res.data[0]._id);
        setCurrentKm(res.data[0].currentKm || '');
      }
    } catch (err) {
      console.error('Failed to load cars', err);
    }
  };

  const resetForm = () => {
    setCarId(preselectedCarId || '');
    setServiceDate(new Date().toISOString().split('T')[0]);
    setServiceType('General Service');
    setCurrentKm('');
    setStatus('Pending');
    setExpectedDeliveryDate('');
    setWorkDescription('');
    setParts('');
    setLabourCost('');
    setPartsCost('');
    setTotalCost('');
    setNotes('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!carId) {
      setError('Please select a vehicle');
      return;
    }

    if (!currentKm) {
      setError('Please provide current odometer reading');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        carId,
        serviceDate,
        serviceType,
        currentKm: Number(currentKm),
        status,
        expectedDeliveryDate: expectedDeliveryDate || null,
        workDescription,
        parts,
        labourCost: Number(labourCost) || 0,
        partsCost: Number(partsCost) || 0,
        totalCost: Number(totalCost) || (Number(labourCost) || 0) + (Number(partsCost) || 0),
        notes,
      };

      if (editService) {
        await api.put(`/services/${editService._id}`, payload);
      } else {
        await api.post('/services', payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editService ? `Edit Service (${editService.serviceCode || 'Record'})` : 'Record New Service Order'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 1. Basic Info */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Job Card & Vehicle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Select Vehicle *
              </label>
              {editService ? (
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold flex items-center justify-between shadow-sm">
                  <span className="font-mono text-blue-700">
                    {editService.carId?.registrationNumber} — {editService.carId?.carName}
                  </span>
                  <span className="text-slate-500 font-normal">
                    Owner: {editService.customerId?.name}
                  </span>
                </div>
              ) : (
                <select
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                  className="select-field"
                  disabled={!!preselectedCarId}
                  required
                >
                  <option value="">-- Select Registered Vehicle --</option>
                  {cars.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.registrationNumber} — {c.carName} {c.model} ({c.customerId?.name || 'Customer'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Service Type *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="select-field"
                required
              >
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type} {type === 'Major Service' ? '⭐ (Full Service)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Service Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select-field font-semibold"
                required
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st === 'Pending' && '🟡 Pending'}
                    {st === 'In Service' && '🔵 In Service'}
                    {st === 'Completed' && '🟢 Completed'}
                    {st === 'Delivered' && '⚫ Delivered'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Service Date *
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Current KM *
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

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Expected Delivery Date (Optional)
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* 2. Work & Parts Details */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span>Work Description & Parts</span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Work Description
              </label>
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="e.g. Engine service, Brake replacement, Transmission oil flush, Suspension inspection"
                rows="2"
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Parts / Items Used
              </label>
              <textarea
                value={parts}
                onChange={(e) => setParts(e.target.value)}
                placeholder="e.g. Synthetic Oil (7L), Ceramic Brake Pads, Oil Filter, Spark Plugs"
                rows="2"
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Technician Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Suspension lubricated. All diagnostics cleared."
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* 3. Cost Calculation */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Billing Breakdown (₹ INR)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Labour Cost (₹)
              </label>
              <input
                type="number"
                value={labourCost}
                onChange={(e) => handleLabourChange(e.target.value)}
                placeholder="e.g. 2500"
                min="0"
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Parts Cost (₹)
              </label>
              <input
                type="number"
                value={partsCost}
                onChange={(e) => handlePartsCostChange(e.target.value)}
                placeholder="e.g. 14000"
                min="0"
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-700 mb-1">
                Total Amount (₹)
              </label>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="e.g. 16500"
                min="0"
                className="input-field font-mono font-bold text-blue-700 border-blue-300 bg-blue-50/50"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            {loading ? 'Saving Record...' : editService ? 'Save Changes' : 'Save Service Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
