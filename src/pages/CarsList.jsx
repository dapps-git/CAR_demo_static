import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useSearchParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Car,
  Search,
  Plus,
  Eye,
  Trash2,
  Edit2,
  Calendar,
  Phone,
  User,
  Filter,
  Users,
  Wrench,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

export const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [carToDelete, setCarToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const isCustomersView = location.pathname === '/customers';
  const outletContext = useOutletContext();
  const onOpenAddCar = outletContext?.onOpenAddCar;

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cars?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      setCars(res.data);
    } catch (err) {
      console.error('Error fetching cars list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();

    const handleRefresh = () => fetchCars();
    window.addEventListener('car-created', handleRefresh);
    window.addEventListener('service-created', handleRefresh);

    return () => {
      window.removeEventListener('car-created', handleRefresh);
      window.removeEventListener('service-created', handleRefresh);
    };
  }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!carToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/cars/${carToDelete._id}`);
      setCarToDelete(null);
      fetchCars();
    } catch (err) {
      console.error('Error deleting car', err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(cars.map((c) => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Oct 08, 2026';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-0.5">
            {isCustomersView ? 'CUSTOMERS' : 'VEHICLES'}
          </span>
          <h1 className="text-[28px] font-bold text-[#172033] tracking-tight leading-tight">
            {isCustomersView ? 'Customer Directory' : 'Vehicle Registry'}
          </h1>
          <p className="text-[14px] text-[#667085] font-normal mt-0.5">
            {isCustomersView
              ? 'Manage customer records, contact info, and associated vehicles.'
              : 'Manage registered vehicles, mileage, registration numbers, and service histories.'}
          </p>
        </div>

        <button
          onClick={() => onOpenAddCar?.()}
          className="btn-primary self-start sm:self-auto py-2.5 px-4 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{isCustomersView ? '+ Add New Customer' : '+ Add New Vehicle'}</span>
        </button>
      </div>

      {/* 2. Four Stat Summary Cards (Exact replica of top row) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#667085]">Total Customers</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-bold text-[#172033] font-mono">842</span>
              <span className="text-[11px] font-bold text-[#16A36A]">↑ 14%</span>
            </div>
            <p className="text-[10px] text-[#667085]">vs. last month</p>
          </div>
        </div>

        {/* Total Vehicles */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#667085]">Total Vehicles</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-bold text-[#172033] font-mono">1,265</span>
              <span className="text-[11px] font-bold text-[#1677C8]">↑ 9%</span>
            </div>
            <p className="text-[10px] text-[#667085]">vs. last month</p>
          </div>
        </div>

        {/* Service This Month */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#16A36A] flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#667085]">Service This Month</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-bold text-[#172033] font-mono">156</span>
              <span className="text-[11px] font-bold text-[#16A36A]">↑ 12%</span>
            </div>
            <p className="text-[10px] text-[#667085]">vs. last month</p>
          </div>
        </div>

        {/* Active Appointments */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF5FF] text-[#7E22CE] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#667085]">Active Appointments</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-bold text-[#172033] font-mono">28</span>
              <span className="text-[11px] font-bold text-[#16A36A]">↑ 18%</span>
            </div>
            <p className="text-[10px] text-[#667085]">vs. today</p>
          </div>
        </div>
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, registration number, or vehicle..."
            className="w-full bg-[#F5F7FA] border border-[#E2E8F0] focus:border-[#1677C8] focus:bg-white rounded-lg pl-10 pr-4 py-2 text-[13px] text-[#172033] placeholder-[#667085]/70 focus:outline-none focus:ring-1 focus:ring-[#1677C8]"
          />
        </div>

        {/* Filters Stack */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#F5F7FA] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg text-[13px] text-[#172033]">
            <Car className="w-4 h-4 text-[#667085]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[13px] text-[#172033] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Vehicle Statuses</option>
              <option value="In Service">In Service</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed / Active</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F5F7FA] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg text-[13px] text-[#172033]">
            <Users className="w-4 h-4 text-[#667085]" />
            <select className="bg-transparent text-[13px] text-[#172033] font-medium focus:outline-none cursor-pointer">
              <option value="all">All Customers</option>
              <option value="vip">VIP Clients</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F5F7FA] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg text-[13px] text-[#172033]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#667085]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[13px] text-[#172033] font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="name">Sort by: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table (Aligned exactly like screenshot) */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F5F7FA] text-[#667085] text-[11px] uppercase font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === cars.length && cars.length > 0}
                    className="rounded border-[#E2E8F0] text-[#1677C8] focus:ring-[#1677C8]"
                  />
                </th>
                <th className="px-4 py-3">CUSTOMER</th>
                <th className="px-4 py-3">VEHICLE</th>
                <th className="px-4 py-3">REGISTRATION NO.</th>
                <th className="px-4 py-3">PHONE</th>
                <th className="px-4 py-3">LAST SERVICE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-8 text-center text-[#667085] text-[13px] font-medium">
                    Loading customer directory...
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-[#667085] text-[13px]">
                    <Users className="w-8 h-8 text-[#667085]/40 mx-auto mb-2" />
                    No customer records found.
                  </td>
                </tr>
              ) : (
                cars.map((car) => {
                  const isChecked = selectedIds.includes(car._id);
                  return (
                    <tr
                      key={car._id}
                      onClick={() => navigate(`/cars/${car._id}`)}
                      className="hover:bg-[#EAF4FC]/40 transition-colors group cursor-pointer"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(car._id)}
                          className="rounded border-[#E2E8F0] text-[#1677C8] focus:ring-[#1677C8]"
                        />
                      </td>

                      {/* Customer (Clean default user silhouette icon avatar) */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#EAF4FC] border border-[#1677C8]/20 flex items-center justify-center text-[#1677C8] shrink-0 shadow-sm">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#172033] group-hover:text-[#1677C8] transition-colors leading-tight">
                              {car.customerId?.name || 'Customer'}
                            </p>
                            <p className="text-[11px] text-[#667085] mt-0.5">
                              {car.customerId?.email || `${car.customerId?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}@domain.com`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle with car image/thumbnail */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded-md bg-[#F5F7FA] border border-[#E2E8F0] overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src="/car-banner.jpg"
                              alt="Car"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#172033] leading-tight">
                              {car.carName}
                            </p>
                            <p className="text-[11px] text-[#667085] mt-0.5">
                              {car.model}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Registration No (Blue badge) */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[12px] font-bold text-[#1677C8] bg-[#EAF4FC] px-2.5 py-1 rounded-md border border-[#1677C8]/20 inline-block">
                          {car.registrationNumber}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 font-mono text-[12px] text-[#172033]">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#1677C8]" />
                          <span>{car.customerId?.phone || car.phone || '+91 98765 43210'}</span>
                        </div>
                      </td>

                      {/* Last Service */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#667085] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[12px] font-semibold text-[#172033]">
                              {formatDate(car.lastService)}
                            </p>
                            <p className="text-[10px] text-[#667085]">
                              {car.latestServiceType || 'General Service'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={car.currentStatus || 'Completed'} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 text-[#667085]">
                          <button
                            onClick={() => navigate(`/cars/${car._id}`)}
                            title="View Vehicle"
                            className="p-1.5 rounded-md hover:text-[#1677C8] hover:bg-[#EAF4FC] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/cars/${car._id}`)}
                            title="Edit Vehicle"
                            className="p-1.5 rounded-md hover:text-[#1677C8] hover:bg-[#EAF4FC] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCarToDelete(car)}
                            title="Delete"
                            className="p-1.5 rounded-md hover:text-[#DC3545] hover:bg-[#FEF2F2] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer (Matching screenshot) */}
        <div className="px-4 py-3 bg-white border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#667085]">
          <div>
            Showing <strong className="text-[#172033]">1 – {cars.length}</strong> of{' '}
            <strong className="text-[#172033]">{isCustomersView ? '842 customers' : '1,265 vehicles'}</strong>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#667085] disabled:opacity-40">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-md bg-[#1677C8] text-white font-bold text-[12px]">
              1
            </button>
            <button className="w-7 h-7 rounded-md border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#172033] font-semibold text-[12px]">
              2
            </button>
            <button className="w-7 h-7 rounded-md border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#172033] font-semibold text-[12px]">
              3
            </button>
            <button className="w-7 h-7 rounded-md border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#172033] font-semibold text-[12px]">
              4
            </button>
            <button className="w-7 h-7 rounded-md border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#172033] font-semibold text-[12px]">
              5
            </button>
            <button className="p-1.5 rounded-md border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#667085]">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <select className="ml-2 bg-[#F5F7FA] border border-[#E2E8F0] rounded-md px-2 py-1 text-[11px] text-[#172033] font-semibold focus:outline-none">
              <option>5 / page</option>
              <option>10 / page</option>
              <option>25 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!carToDelete}
        onClose={() => setCarToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Customer & Vehicle"
        message={`Are you sure you want to delete ${carToDelete?.carName} (${carToDelete?.registrationNumber})? This will permanently remove the vehicle and its service logs.`}
      />
    </div>
  );
};
