import React from 'react';
import { QuickSearch } from './QuickSearch';
import { useAuth } from '../context/AuthContext';
import { Plus, Wrench, Menu, Bell, Calendar, User, ChevronDown } from 'lucide-react';

export const Navbar = ({ onOpenAddCar, onOpenAddService, toggleMobileMenu }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
      {/* Mobile menu toggle & Quick search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-[#667085] hover:text-[#172033] hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <QuickSearch />
        </div>
      </div>

      {/* Top right quick shortcuts & User profile */}
      <div className="flex items-center gap-3">
        {/* Quick Add Buttons */}
        <button
          onClick={onOpenAddCar}
          className="hidden sm:inline-flex btn-secondary text-[13px] py-1.5 px-3 items-center gap-1.5 font-semibold"
        >
          <Plus className="w-3.5 h-3.5 text-[#1677C8]" />
          <span>Add Vehicle</span>
        </button>
        <button
          onClick={onOpenAddService}
          className="hidden sm:inline-flex btn-primary text-[13px] py-1.5 px-3 items-center gap-1.5 font-semibold"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Record Service</span>
        </button>

        <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block mx-0.5" />

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-1.5 rounded-lg text-[#667085] hover:text-[#172033] hover:bg-slate-100 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC3545] rounded-full ring-2 ring-white" />
        </div>

        {/* Calendar Shortcut */}
        <button className="p-1.5 rounded-lg text-[#667085] hover:text-[#172033] hover:bg-slate-100 transition-colors hidden sm:block">
          <Calendar className="w-4 h-4" />
        </button>

        {/* User profile with clean default unknown user icon */}
        <div className="flex items-center gap-2.5 pl-1.5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#EAF4FC] border border-[#1677C8]/30 text-[#1677C8] flex items-center justify-center shadow-sm shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left leading-tight">
            <p className="text-[13px] font-bold text-[#172033]">
              {user?.name || 'Marcus Sterling'}
            </p>
            <p className="text-[11px] text-[#667085] font-medium">
              Service Manager
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#667085] hidden md:block" />
        </div>
      </div>
    </header>
  );
};
