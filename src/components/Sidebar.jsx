import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  Wrench,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ onOpenAddCar, onOpenAddService }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      isActive: location.pathname === '/dashboard' || location.pathname === '/',
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users,
      isActive: location.pathname === '/customers',
    },
    {
      name: 'Vehicles',
      path: '/cars',
      icon: Car,
      isActive: location.pathname === '/cars' || (location.pathname.startsWith('/cars/') && location.pathname !== '/customers'),
    },
    {
      name: 'Service Jobs',
      path: '/services',
      icon: Wrench,
      isActive: location.pathname === '/services',
    },
    {
      name: 'Staff & Users',
      path: '/users',
      icon: UserCheck,
      isActive: location.pathname === '/users',
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1F33] text-slate-300 flex flex-col shrink-0 min-h-screen select-none border-r border-[#163352]">
      {/* Brand Header */}
      <div 
        onClick={() => navigate('/dashboard')}
        className="h-20 flex items-center px-6 gap-3.5 border-b border-[#163352] cursor-pointer hover:bg-[#0e243a]/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#1677C8] flex items-center justify-center text-white font-black shadow-sm shrink-0">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-[16px] tracking-tight text-white flex items-center gap-1">
            AutoCare <span className="text-[#1677C8] font-bold">Pro</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            Service Center OS
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-3.5 space-y-1 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 group ${
                  active
                    ? 'bg-[#1677C8] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#10273F]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.name}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Promo Card: Better Care for Every Mile */}
      <div className="p-3.5">
        <div className="bg-[#10273F] p-3.5 rounded-xl border border-[#1C3A5E] relative overflow-hidden shadow-md">
          <div className="w-full h-24 rounded-lg overflow-hidden mb-3 bg-[#0B1F33] border border-[#1C3A5E]">
            <img
              src="/car-banner.jpg"
              alt="Better Care for Every Mile"
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-[13px] font-bold text-white leading-snug">
            Better Care for Every Mile
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Trusted Service. Lasting Performance.
          </p>
        </div>
      </div>

      {/* User Info & Sign Out Footer */}
      <div className="p-3.5 border-t border-[#163352] bg-[#071524]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1677C8] text-white flex items-center justify-center text-xs font-bold shrink-0">
              MS
            </div>
            <div className="truncate">
              <p className="text-[13px] font-bold text-white truncate">
                {user?.name || 'Marcus Sterling'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Service Manager
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#DC3545] hover:bg-[#10273F] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
