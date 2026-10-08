import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../api/axios';
import { StatusBadge } from '../components/StatusBadge';
import { ServiceTypeBadge } from '../components/ServiceTypeBadge';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import {
  Car,
  Users,
  Wrench,
  Check,
  Calendar,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Plus,
  Layers,
  ArrowRight,
  Box,
  UserPlus,
  Zap,
  Clock,
  User,
} from 'lucide-react';

export const Dashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalCars: 0,
      totalCustomers: 0,
      activeServices: 0,
      completedServices: 0,
    },
    recentServices: [],
    inServiceList: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onOpenAddCar = outletContext?.onOpenAddCar;
  const onOpenAddService = outletContext?.onOpenAddService;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services/dashboard-stats');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('service-created', handleRefresh);
    window.addEventListener('car-created', handleRefresh);

    return () => {
      window.removeEventListener('service-created', handleRefresh);
      window.removeEventListener('car-created', handleRefresh);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. HERO BANNER + QUICK ACTIONS (Exact Replica of Uploaded Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Hero Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-white via-white to-[#EAF4FC]/60 border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-card flex flex-col justify-between">
          <div className="relative z-10 max-w-md space-y-2.5">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#B45309] text-[11px] font-extrabold uppercase tracking-wider">
              PREMIUM SERVICE CENTER
            </span>
            <h1 className="text-[28px] font-extrabold text-[#172033] tracking-tight leading-tight">
              Premium Car Care, <br />
              <span className="text-[#1677C8]">Managed Simply.</span>
            </h1>
            <p className="text-[13px] text-[#667085] font-normal leading-relaxed">
              Complete service management for every vehicle, customer & job.
            </p>

            {/* 4 Feature Badges */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 p-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#172033] leading-tight">Book Service</p>
                  <p className="text-[10px] text-[#667085]">Online</p>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 p-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#172033] leading-tight">Track Status</p>
                  <p className="text-[10px] text-[#667085]">In Real-time</p>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 p-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#172033] leading-tight">Manage Jobs</p>
                  <p className="text-[10px] text-[#667085]">& Inventory</p>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 p-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#172033] leading-tight">Grow Your</p>
                  <p className="text-[10px] text-[#667085]">Business</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Workshop Car Banner with cursive watermark */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none">
            <img
              src="/car-banner.jpg"
              alt="Premium Car Care"
              className="w-full h-full object-cover object-left"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 30%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)',
              }}
            />
            <div className="absolute bottom-3 right-4 text-white text-[12px] font-serif italic drop-shadow-md font-bold">
              Your Vehicle Our Priority
            </div>
          </div>
        </div>

        {/* Right Quick Actions Stack */}
        <div className="space-y-2.5 flex flex-col justify-center">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[14px] font-bold text-[#172033] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#1677C8]" /> Quick Actions
            </h3>
            <button
              onClick={() => navigate('/services')}
              className="text-[12px] font-semibold text-[#1677C8] hover:underline"
            >
              View All
            </button>
          </div>

          {/* Solid Blue Button: New Service Order */}
          <button
            onClick={() => onOpenAddService?.()}
            className="w-full bg-[#1677C8] hover:bg-[#1263A8] text-white p-3.5 rounded-xl flex items-center justify-between text-left group shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-bold leading-tight">New Service Order</p>
                <p className="text-[11px] text-[#EAF4FC] font-normal">Create a new job / service</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* White Card: Add Customer */}
          <button
            onClick={() => onOpenAddCar?.()}
            className="w-full bg-white hover:bg-slate-50 border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between text-left group shadow-card transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#172033] leading-tight">Add Customer</p>
                <p className="text-[11px] text-[#667085]">Register new customer</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#667085] group-hover:text-[#1677C8] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* White Card: Add Vehicle */}
          <button
            onClick={() => onOpenAddCar?.()}
            className="w-full bg-white hover:bg-slate-50 border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between text-left group shadow-card transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#172033] leading-tight">Add Vehicle</p>
                <p className="text-[11px] text-[#667085]">Add vehicle details</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#667085] group-hover:text-[#1677C8] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* White Card: Vehicle Registry & History */}
          <button
            onClick={() => navigate('/cars')}
            className="w-full bg-white hover:bg-slate-50 border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between text-left group shadow-card transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#172033] leading-tight">Vehicle Registry & History</p>
                <p className="text-[11px] text-[#667085]">View vehicle history</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#667085] group-hover:text-[#1677C8] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* 2. FIVE METRIC STATS CARDS (Exact match to screenshot row) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Today's Jobs */}
        <div
          onClick={() => navigate('/services')}
          className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-card hover:shadow-card-hover cursor-pointer transition-all relative group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#1677C8] transition-colors" />
          </div>
          <p className="text-[12px] font-semibold text-[#667085]">Today's Jobs</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[22px] font-bold text-[#172033] font-mono">
              {data.inServiceList?.length + 4 || 7}
            </span>
            <span className="text-[11px] font-bold text-[#16A36A]">↑ 20%</span>
          </div>
          <p className="text-[10px] text-[#667085] mt-0.5">vs. yesterday</p>
        </div>

        {/* 2. In Progress */}
        <div
          onClick={() => navigate('/services?status=In Service')}
          className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-card hover:shadow-card-hover cursor-pointer transition-all relative group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#16A36A] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#1677C8] transition-colors" />
          </div>
          <p className="text-[12px] font-semibold text-[#667085]">In Progress</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[22px] font-bold text-[#172033] font-mono">
              {data.stats.activeServices || 3}
            </span>
            <span className="text-[11px] font-bold text-[#16A36A]">↑ 11%</span>
          </div>
          <p className="text-[10px] text-[#667085] mt-0.5">vs. yesterday</p>
        </div>

        {/* 3. Completed */}
        <div
          onClick={() => navigate('/services?status=Completed')}
          className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-card hover:shadow-card-hover cursor-pointer transition-all relative group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] text-[#7E22CE] flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#1677C8] transition-colors" />
          </div>
          <p className="text-[12px] font-semibold text-[#667085]">Completed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[22px] font-bold text-[#172033] font-mono">
              {data.stats.completedServices || 4}
            </span>
            <span className="text-[11px] font-bold text-[#16A36A]">↑ 32%</span>
          </div>
          <p className="text-[10px] text-[#667085] mt-0.5">vs. yesterday</p>
        </div>

        {/* 4. Customers */}
        <div
          onClick={() => navigate('/customers')}
          className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-card hover:shadow-card-hover cursor-pointer transition-all relative group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#DB2777] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#1677C8] transition-colors" />
          </div>
          <p className="text-[12px] font-semibold text-[#667085]">Customers</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[22px] font-bold text-[#172033] font-mono">
              {data.stats.totalCustomers || 5}
            </span>
            <span className="text-[11px] font-bold text-[#16A36A]">↑ 14%</span>
          </div>
          <p className="text-[10px] text-[#667085] mt-0.5">vs. this month</p>
        </div>

        {/* 5. Vehicles */}
        <div
          onClick={() => navigate('/cars')}
          className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-card hover:shadow-card-hover cursor-pointer transition-all relative group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] text-[#1677C8] flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#1677C8] transition-colors" />
          </div>
          <p className="text-[12px] font-semibold text-[#667085]">Vehicles</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[22px] font-bold text-[#172033] font-mono">
              {data.stats.totalCars || 6}
            </span>
            <span className="text-[11px] font-bold text-[#1677C8]">↑ 9%</span>
          </div>
          <p className="text-[10px] text-[#667085] mt-0.5">vs. this month</p>
        </div>
      </div>

      {/* 3. THREE-COLUMN BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Upcoming Appointments */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-[15px] font-bold text-[#172033] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1677C8]" /> Upcoming Appointments
              </h3>
              <button
                onClick={() => navigate('/services')}
                className="text-[12px] font-semibold text-[#1677C8] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  time: '10:00 AM',
                  name: 'Rahul Sharma',
                  car: 'Toyota Corolla (KL 07 AB 1234)',
                  service: 'General Service',
                  status: 'Scheduled',
                  badgeBg: 'bg-[#EFF6FF] text-[#1677C8]',
                },
                {
                  time: '11:30 AM',
                  name: 'Priya Nair',
                  car: 'Honda City (KL 08 CD 5678)',
                  service: 'Oil Change',
                  status: 'In Progress',
                  badgeBg: 'bg-[#ECFDF5] text-[#16A36A]',
                },
                {
                  time: '01:00 PM',
                  name: 'Arjun Menon',
                  car: 'Hyundai Creta (KL 09 EF 9012)',
                  service: 'Brake Check',
                  status: 'Pending',
                  badgeBg: 'bg-[#FEF3C7] text-[#B45309]',
                },
                {
                  time: '03:30 PM',
                  name: 'Sneha Pillai',
                  car: 'Maruti Swift (KL 10 GH 3456)',
                  service: 'AC Service',
                  status: 'Confirmed',
                  badgeBg: 'bg-[#F0FDF4] text-[#15803D]',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/services')}
                  className="p-2.5 bg-[#F8FAFC] hover:bg-[#EAF4FC]/60 rounded-xl border border-[#E2E8F0] cursor-pointer transition-all flex items-center justify-between gap-2.5 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-[#667085] shrink-0 w-16">
                      {item.time}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#EAF4FC] border border-[#1677C8]/20 flex items-center justify-center text-[#1677C8] shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-[13px] font-bold text-[#172033] truncate group-hover:text-[#1677C8]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#667085] truncate">
                        {item.car}
                      </p>
                      <p className="text-[10px] text-[#667085]/80">{item.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.badgeBg}`}>
                      {item.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#1677C8]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Service Overview & Real Care Card */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-[15px] font-bold text-[#172033] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1677C8]" /> Service Overview
              </h3>
              <span className="text-[11px] text-[#667085] font-semibold bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E2E8F0]">
                This Month ▾
              </span>
            </div>

            <div className="flex items-center gap-6">
              {/* Donut Graphic with Total in Center */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#1677C8]"
                    strokeDasharray="45, 100"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#16A36A]"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-45"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#F59E0B]"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-65"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#7E22CE]"
                    strokeDasharray="10, 100"
                    strokeDashoffset="-80"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-[#667085] font-medium leading-tight">Total Services</span>
                  <span className="text-[18px] font-bold text-[#172033] font-mono">287</span>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#667085] text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-[#1677C8]" /> General Service
                  </span>
                  <span className="font-bold text-[#172033] text-[12px]">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#667085] text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-[#16A36A]" /> Oil Change
                  </span>
                  <span className="font-bold text-[#172033] text-[12px]">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#667085] text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Brake Service
                  </span>
                  <span className="font-bold text-[#172033] text-[12px]">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#667085] text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-[#7E22CE]" /> AC Service
                  </span>
                  <span className="font-bold text-[#172033] text-[12px]">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#667085] text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Others
                  </span>
                  <span className="font-bold text-[#172033] text-[12px]">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Care, Maximum Performance Card */}
          <div className="bg-[#EAF4FC] p-4 rounded-xl border border-[#1677C8]/20 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1677C8] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#172033] leading-tight">
                  Premium Care, Maximum Performance
                </h4>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Skilled technicians. Genuine parts. Quality service.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenAddService?.()}
              className="w-7 h-7 rounded-full bg-[#1677C8] text-white flex items-center justify-center hover:bg-[#1263A8] transition-colors shrink-0 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Column 3: Recent Activity */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-[15px] font-bold text-[#172033] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1677C8]" /> Recent Activity
            </h3>
            <button
              onClick={() => navigate('/services')}
              className="text-[12px] font-semibold text-[#1677C8] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#ECFDF5] border border-[#16A36A]/30 text-[#16A36A] flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#172033]">Service completed</p>
                  <span className="text-[10px] text-[#667085] font-mono">09:45 AM</span>
                </div>
                <p className="text-[11px] text-[#667085] truncate">BMW 5 Series (KL 10 AB 1234) — General Service</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#EAF4FC] border border-[#1677C8]/30 text-[#1677C8] flex items-center justify-center shrink-0 shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#172033]">New job booked</p>
                  <span className="text-[10px] text-[#667085] font-mono">08:32 AM</span>
                </div>
                <p className="text-[11px] text-[#667085] truncate">Mercedes E-Class — AC Service</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#EAF4FC] border border-[#1677C8]/30 text-[#1677C8] flex items-center justify-center shrink-0 shadow-sm">
                <Box className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#172033]">Inventory updated</p>
                  <span className="text-[10px] text-[#667085] font-mono">07:15 AM</span>
                </div>
                <p className="text-[11px] text-[#667085] truncate">Engine Oil (5L) — 3 units</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#EAF4FC] border border-[#1677C8]/30 text-[#1677C8] flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#172033]">New customer registered</p>
                  <span className="text-[10px] text-[#667085] font-mono">06:20 AM</span>
                </div>
                <p className="text-[11px] text-[#667085] truncate">Vikram S.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#EAF4FC] border border-[#1677C8]/30 text-[#1677C8] flex items-center justify-center shrink-0 shadow-sm">
                <Car className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#172033]">Vehicle added</p>
                  <span className="text-[10px] text-[#667085] font-mono">05:10 AM</span>
                </div>
                <p className="text-[11px] text-[#667085] truncate">Kia Seltos (KL 11 U 7890)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onEdit={(srv) => {
            setSelectedService(null);
            onOpenAddService?.(srv.carId?._id);
          }}
          onDelete={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};
