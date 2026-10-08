import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge } from '../components/StatusBadge';
import { ServiceTypeBadge } from '../components/ServiceTypeBadge';
import { AddServiceModal } from '../components/AddServiceModal';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Modal } from '../components/Modal';
import {
  Car,
  User,
  Phone,
  Gauge,
  Calendar,
  Wrench,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

export const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditCarOpen, setIsEditCarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [carToDelete, setCarToDelete] = useState(false);

  // Edit Car Form State
  const [editCarName, setEditCarName] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editReg, setEditReg] = useState('');
  const [editChassis, setEditChassis] = useState('');
  const [editKm, setEditKm] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerAddress, setEditCustomerAddress] = useState('');
  const [savingCar, setSavingCar] = useState(false);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cars/${id}`);
      setCar(res.data);

      setEditCarName(res.data.carName || '');
      setEditModel(res.data.model || '');
      setEditReg(res.data.registrationNumber || '');
      setEditChassis(res.data.chassisNumber || '');
      setEditKm(res.data.currentKm || '');
      setEditPhone(res.data.phone || '');
      if (res.data.customerId) {
        setEditCustomerName(res.data.customerId.name || '');
        setEditCustomerPhone(res.data.customerId.phone || '');
        setEditCustomerAddress(res.data.customerId.address || '');
      }
    } catch (err) {
      console.error('Error fetching car details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setSavingCar(true);
    try {
      await api.put(`/cars/${id}`, {
        carName: editCarName,
        model: editModel,
        registrationNumber: editReg,
        chassisNumber: editChassis,
        currentKm: editKm,
        phone: editPhone,
      });

      if (car?.customerId?._id) {
        await api.put(`/customers/${car.customerId._id}`, {
          name: editCustomerName,
          phone: editCustomerPhone,
          address: editCustomerAddress,
        });
      }

      setIsEditCarOpen(false);
      fetchCarDetails();
    } catch (err) {
      console.error('Failed to update car', err);
    } finally {
      setSavingCar(false);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      await api.delete(`/services/${serviceToDelete._id}`);
      setServiceToDelete(null);
      fetchCarDetails();
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  };

  const handleDeleteCar = async () => {
    try {
      await api.delete(`/cars/${id}`);
      navigate('/cars');
    } catch (err) {
      console.error('Failed to delete car', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="card-premium p-12 text-center text-[#667085] text-[14px] max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-[#1677C8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading complete vehicle file...
      </div>
    );
  }

  if (!car) {
    return (
      <div className="card-premium p-12 text-center text-[#667085] text-[14px] max-w-xl mx-auto">
        <p className="text-[#172033] font-bold text-base mb-2">Vehicle Not Found</p>
        <p className="mb-4">The requested vehicle record does not exist or has been removed.</p>
        <button onClick={() => navigate('/cars')} className="btn-primary">
          Back to Vehicles List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back button and page navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/cars')}
          className="btn-ghost text-[13px] flex items-center gap-1.5 pl-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditCarOpen(true)}
            className="btn-secondary text-[13px] py-1.5 px-3.5 flex items-center gap-1.5 font-semibold"
          >
            <Edit className="w-3.5 h-3.5 text-[#667085]" />
            <span>Edit Vehicle</span>
          </button>
          <button
            onClick={() => setIsAddServiceOpen(true)}
            className="btn-primary text-[13px] py-1.5 px-4 flex items-center gap-1.5 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Service</span>
          </button>
        </div>
      </div>

      {/* FLAGSHIP HERO HEADER CARD */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-card relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Car Brand, Plate, Status */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#EAF4FC] border border-[#1677C8]/20 flex items-center justify-center text-[#1677C8] shrink-0 shadow-sm">
              <Car className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[28px] font-bold text-[#172033] tracking-tight leading-tight">
                  {car.carName}
                </h1>
                <span className="font-mono text-[14px] font-bold text-[#1677C8] bg-[#EAF4FC] border border-[#1677C8]/30 px-2.5 py-0.5 rounded-md">
                  {car.registrationNumber}
                </span>
              </div>
              <p className="text-[14px] font-medium text-[#667085] mt-1">
                {car.model}
              </p>
              <div className="flex items-center gap-3 mt-2.5">
                <StatusBadge status={car.currentStatus} size="lg" />
                <span className="text-[12px] text-[#667085] font-medium">
                  {car.totalServices} Recorded {car.totalServices === 1 ? 'Service' : 'Services'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Odometer & Lifetime Metrics */}
          <div className="grid grid-cols-2 gap-3.5 lg:min-w-[280px]">
            <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs text-[#667085] font-bold mb-1">
                <Gauge className="w-3.5 h-3.5 text-[#1677C8]" />
                <span className="uppercase tracking-wider text-[10px]">
                  Current KM
                </span>
              </div>
              <p className="text-[20px] font-bold text-[#172033] font-mono">
                {car.currentKm ? car.currentKm.toLocaleString() : '0'} <span className="text-[11px] text-[#667085] font-sans font-normal">KM</span>
              </p>
            </div>

            <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs text-[#667085] font-bold mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#16A36A]" />
                <span className="uppercase tracking-wider text-[10px]">
                  Total Spent
                </span>
              </div>
              <p className="text-[20px] font-bold text-[#16A36A] font-mono">
                ₹{(car.totalSpent || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN VEHICLE & CUSTOMER DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Car Information */}
        <div className="card-premium space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-[16px] font-semibold text-[#172033] flex items-center gap-2">
              <Car className="w-4 h-4 text-[#1677C8]" />
              <span>Car Information</span>
            </h3>
            <span className="text-[11px] font-mono text-[#1677C8] bg-[#EAF4FC] px-2 py-0.5 rounded font-bold">Verified</span>
          </div>

          <div className="space-y-2 text-[13px] divide-y divide-[#E2E8F0]">
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Car Brand / Name</span>
              <span className="text-[#172033] font-bold">{car.carName}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Model / Variant</span>
              <span className="text-[#172033] font-semibold">{car.model}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Registration Number</span>
              <span className="text-[#1677C8] font-mono font-bold">
                {car.registrationNumber}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Chassis Number / VIN</span>
              <span className="text-[#172033] font-mono text-[11px] font-medium">
                {car.chassisNumber || 'Not recorded'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Odometer Reading</span>
              <span className="text-[#172033] font-mono font-bold">
                {car.currentKm ? `${car.currentKm.toLocaleString()} KM` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Customer Information */}
        <div className="card-premium space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-[16px] font-semibold text-[#172033] flex items-center gap-2">
              <User className="w-4 h-4 text-[#7E22CE]" />
              <span>Customer Information</span>
            </h3>
            <span className="text-[11px] text-[#667085] font-medium">Registered Owner</span>
          </div>

          <div className="space-y-2 text-[13px] divide-y divide-[#E2E8F0]">
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Customer Name</span>
              <span className="text-[#172033] font-bold">
                {car.customerId?.name || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5">
              <span className="text-[#667085] font-medium">Primary Phone</span>
              <a
                href={`tel:${car.customerId?.phone}`}
                className="text-[#1677C8] font-mono font-bold hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {car.customerId?.phone || '—'}
              </a>
            </div>
            <div className="flex items-start justify-between pt-1.5">
              <span className="text-[#667085] font-medium shrink-0">Address</span>
              <span className="text-[#172033] text-right leading-snug max-w-[220px] font-medium">
                {car.customerId?.address || 'No registered address'}
              </span>
            </div>
            {car.phone && (
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-[#667085] font-medium">Alternate Contact</span>
                <span className="text-[#172033] font-mono font-semibold">{car.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 10: COMPLETE SERVICE HISTORY */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[20px] font-semibold text-[#172033] tracking-tight uppercase">
              Service History
            </h2>
            <span className="bg-[#EAF4FC] text-[#1677C8] font-mono text-[12px] px-2 py-0.5 rounded-full border border-[#1677C8]/20 font-bold">
              {car.services?.length || 0} Records
            </span>
          </div>

          <button
            onClick={() => setIsAddServiceOpen(true)}
            className="btn-secondary text-[12px] py-1.5 px-3 flex items-center gap-1.5 font-semibold text-[#1677C8]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service Record</span>
          </button>
        </div>

        {car.services?.length === 0 ? (
          <div className="card-premium p-10 text-center border-dashed border-[#E2E8F0] space-y-3">
            <Wrench className="w-10 h-10 text-[#667085]/40 mx-auto" />
            <h4 className="text-[16px] font-semibold text-[#172033]">No Service History Yet</h4>
            <p className="text-[13px] text-[#667085] max-w-sm mx-auto">
              Start recording maintenance jobs, oil changes, or major inspections for this vehicle.
            </p>
            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Record First Service</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#E2E8F0] before:hidden md:before:block">
            {car.services.map((service, index) => (
              <div
                key={service._id}
                className="relative flex flex-col md:flex-row items-stretch gap-3 group"
              >
                {/* Timeline node */}
                <div className="hidden md:flex w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] group-hover:border-[#1677C8] text-[#1677C8] items-center justify-center shrink-0 z-10 shadow-sm transition-all font-mono text-[11px] font-bold">
                  #{car.services.length - index}
                </div>

                {/* Service Card */}
                <div
                  onClick={() => setSelectedService(service)}
                  className="flex-1 card-premium hover:border-[#1677C8]/40 cursor-pointer group/card transition-all"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-[12px] font-bold text-[#172033] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#1677C8]" />
                        {formatDate(service.serviceDate)}
                      </span>
                      <span className="text-[#667085]/40">•</span>
                      <ServiceTypeBadge type={service.serviceType} />
                      <span className="text-[#667085]/40">•</span>
                      <span className="font-mono text-[12px] text-[#667085] font-semibold">
                        {service.currentKm ? `${service.currentKm.toLocaleString()} KM` : '—'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[15px] font-bold text-[#172033]">
                        ₹{(service.totalCost || 0).toLocaleString()}
                      </span>
                      <StatusBadge status={service.status} />
                    </div>
                  </div>

                  {/* Work Description & Parts */}
                  <div className="py-2.5 space-y-1.5">
                    {service.workDescription ? (
                      <p className="text-[13px] text-[#172033] leading-relaxed font-medium">
                        {service.workDescription}
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#667085] italic">
                        Standard service checkpoint execution.
                      </p>
                    )}

                    {service.parts && (
                      <div className="bg-[#F5F7FA] p-2.5 rounded-lg border border-[#E2E8F0] text-[12px] text-[#667085]">
                        <span className="text-[#1677C8] font-bold mr-1.5">Parts Replaced:</span>
                        {service.parts}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] text-[#667085]">
                    <div className="flex items-center gap-3">
                      {service.labourCost > 0 && (
                        <span>
                          Labour: <strong className="text-[#172033] font-mono">₹{service.labourCost.toLocaleString()}</strong>
                        </span>
                      )}
                      {service.partsCost > 0 && (
                        <span>
                          Parts: <strong className="text-[#172033] font-mono">₹{service.partsCost.toLocaleString()}</strong>
                        </span>
                      )}
                      {service.notes && (
                        <span className="hidden sm:inline italic text-[#667085] truncate max-w-[180px]">
                          Note: {service.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setIsAddServiceOpen(true);
                        }}
                        className="p-1 rounded-md text-[#667085] hover:text-[#1677C8] hover:bg-[#EAF4FC] transition-colors"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setServiceToDelete(service)}
                        className="p-1 rounded-md text-[#667085] hover:text-[#DC3545] hover:bg-[#FEF2F2] transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[#1677C8] text-[12px] font-bold flex items-center gap-0.5 group-hover/card:translate-x-0.5 transition-transform pl-1">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Delete Vehicle */}
      <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-[13px]">
        <span className="text-[#667085]">
          Permanent vehicle record removal
        </span>
        <button
          onClick={() => setCarToDelete(true)}
          className="btn-danger"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Vehicle Record</span>
        </button>
      </div>

      {/* Modals */}
      <AddServiceModal
        isOpen={isAddServiceOpen}
        preselectedCarId={car._id}
        editService={editingService}
        onClose={() => {
          setIsAddServiceOpen(false);
          setEditingService(null);
        }}
        onSuccess={() => {
          setIsAddServiceOpen(false);
          setEditingService(null);
          fetchCarDetails();
        }}
      />

      {selectedService && (
        <ServiceDetailModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onEdit={(srv) => {
            setSelectedService(null);
            setEditingService(srv);
            setIsAddServiceOpen(true);
          }}
          onDelete={(srv) => {
            setSelectedService(null);
            setServiceToDelete(srv);
          }}
        />
      )}

      {/* Edit Car Modal */}
      <Modal
        isOpen={isEditCarOpen}
        onClose={() => setIsEditCarOpen(false)}
        title="Edit Vehicle & Customer Information"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleUpdateCar} className="space-y-4">
          <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
            <h4 className="text-[13px] font-bold text-[#1677C8] uppercase tracking-wider">
              Vehicle Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Car Brand / Name *
                </label>
                <input
                  type="text"
                  value={editCarName}
                  onChange={(e) => setEditCarName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Model / Variant *
                </label>
                <input
                  type="text"
                  value={editModel}
                  onChange={(e) => setEditModel(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  value={editReg}
                  onChange={(e) => setEditReg(e.target.value.toUpperCase())}
                  className="input-field uppercase font-mono font-bold text-[#1677C8]"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Current KM *
                </label>
                <input
                  type="number"
                  value={editKm}
                  onChange={(e) => setEditKm(e.target.value)}
                  className="input-field font-mono"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Chassis Number / VIN
                </label>
                <input
                  type="text"
                  value={editChassis}
                  onChange={(e) => setEditChassis(e.target.value.toUpperCase())}
                  className="input-field uppercase font-mono text-[12px]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
            <h4 className="text-[13px] font-bold text-[#7E22CE] uppercase tracking-wider">
              Customer Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  value={editCustomerPhone}
                  onChange={(e) => setEditCustomerPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-medium text-[#667085] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editCustomerAddress}
                  onChange={(e) => setEditCustomerAddress(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditCarOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingCar}
              className="btn-primary"
            >
              {savingCar ? 'Saving...' : 'Update Vehicle & Customer'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
        title="Delete Service Record"
        message={`Are you sure you want to delete this ${serviceToDelete?.serviceType} record (${formatDate(serviceToDelete?.serviceDate)})?`}
      />

      <ConfirmModal
        isOpen={carToDelete}
        onClose={() => setCarToDelete(false)}
        onConfirm={handleDeleteCar}
        title="Delete Entire Vehicle & History"
        message={`Are you sure you want to delete ${car.carName} (${car.registrationNumber})? All associated service logs will be permanently deleted.`}
      />
    </div>
  );
};
