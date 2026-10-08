import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge } from '../components/StatusBadge';
import { ServiceTypeBadge } from '../components/ServiceTypeBadge';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { AddServiceModal } from '../components/AddServiceModal';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Wrench,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';

export const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onOpenAddService = outletContext?.onOpenAddService;

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/services?search=${encodeURIComponent(search)}&status=${statusFilter}`
      );
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();

    const handleRefresh = () => fetchServices();
    window.addEventListener('service-created', handleRefresh);
    window.addEventListener('car-created', handleRefresh);

    return () => {
      window.removeEventListener('service-created', handleRefresh);
      window.removeEventListener('car-created', handleRefresh);
    };
  }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/services/${serviceToDelete._id}`);
      setServiceToDelete(null);
      fetchServices();
    } catch (err) {
      console.error('Error deleting service', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = (status) => {
    if (status === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#172033] tracking-tight leading-tight">
            Service Orders & Job Cards
          </h1>
          <p className="text-[14px] text-[#667085] font-normal mt-0.5">
            Complete log of maintenance, repairs, inspections, and billing.
          </p>
        </div>

        <button
          onClick={() => onOpenAddService?.()}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-premium p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job code (#SRV-001), registration plate, car name, customer..."
            className="w-full bg-[#F5F7FA] border border-[#E2E8F0] focus:border-[#1677C8] focus:bg-white rounded-lg pl-10 pr-4 py-2 text-[13px] text-[#172033] placeholder-[#667085]/60 focus:outline-none focus:ring-1 focus:ring-[#1677C8]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'In Service', label: '🔵 In Service' },
            { id: 'Pending', label: '🟡 Pending' },
            { id: 'Completed', label: '🟢 Completed' },
            { id: 'Delivered', label: '⚫ Delivered' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => handleStatusChange(st.id)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-[#1677C8] text-white shadow-sm'
                  : 'bg-[#F5F7FA] text-[#667085] hover:text-[#172033] border border-[#E2E8F0]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="card-premium p-0 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F5F7FA] text-[#667085] text-[12px] uppercase font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-5 py-3.5">Service ID</th>
                <th className="px-5 py-3.5">Vehicle</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Service Type</th>
                <th className="px-5 py-3.5">Date & KM</th>
                <th className="px-5 py-3.5">Total Cost</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-[#667085] text-[13px] font-medium">
                    Loading service history records...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-[#667085] text-[13px]">
                    <Wrench className="w-8 h-8 text-[#667085]/40 mx-auto mb-2" />
                    No service records found.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr
                    key={srv._id}
                    onClick={() => setSelectedService(srv)}
                    className="hover:bg-[#EAF4FC]/50 transition-colors group cursor-pointer"
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-[12px] font-bold text-[#172033] bg-[#F5F7FA] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                        {srv.serviceCode || 'SRV-000'}
                      </span>
                    </td>

                    {/* Vehicle */}
                    <td className="px-5 py-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cars/${srv.carId?._id}`);
                        }}
                        className="hover:text-[#1677C8] transition-colors"
                      >
                        <div className="text-[14px] font-bold text-[#172033] group-hover:text-[#1677C8] transition-colors">
                          {srv.carId?.carName || 'Vehicle'}
                        </div>
                        <div className="font-mono text-[12px] text-[#1677C8] font-bold">
                          {srv.carId?.registrationNumber}
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="text-[14px] font-semibold text-[#172033]">{srv.customerId?.name || '—'}</div>
                      <div className="text-[11px] text-[#667085] font-mono">
                        {srv.customerId?.phone}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <ServiceTypeBadge type={srv.serviceType} />
                    </td>

                    {/* Date & KM */}
                    <td className="px-5 py-4">
                      <div className="font-mono text-[13px] font-bold text-[#172033]">
                        {formatDate(srv.serviceDate)}
                      </div>
                      <div className="font-mono text-[11px] text-[#667085]">
                        {srv.currentKm ? `${srv.currentKm.toLocaleString()} KM` : '—'}
                      </div>
                    </td>

                    {/* Cost */}
                    <td className="px-5 py-4 font-mono text-[14px] font-bold text-[#172033]">
                      ₹{(srv.totalCost || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={srv.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedService(srv)}
                          title="View Details"
                          className="p-1.5 rounded-md text-[#667085] hover:text-[#1677C8] hover:bg-[#EAF4FC] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingService(srv);
                          }}
                          title="Edit Service"
                          className="p-1.5 rounded-md text-[#667085] hover:text-[#1677C8] hover:bg-[#EAF4FC] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setServiceToDelete(srv)}
                          title="Delete Service"
                          className="p-1.5 rounded-md text-[#667085] hover:text-[#DC3545] hover:bg-[#FEF2F2] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedService && (
        <ServiceDetailModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onEdit={(srv) => {
            setSelectedService(null);
            setEditingService(srv);
          }}
          onDelete={(srv) => {
            setSelectedService(null);
            setServiceToDelete(srv);
          }}
        />
      )}

      {editingService && (
        <AddServiceModal
          isOpen={!!editingService}
          editService={editingService}
          onClose={() => setEditingService(null)}
          onSuccess={() => {
            setEditingService(null);
            fetchServices();
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Service Record"
        message={`Are you sure you want to delete service ${serviceToDelete?.serviceCode || ''} for ${serviceToDelete?.carId?.carName || 'this vehicle'}?`}
      />
    </div>
  );
};
