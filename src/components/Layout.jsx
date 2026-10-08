import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AddCarModal } from './AddCarModal';
import { AddServiceModal } from './AddServiceModal';

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [preselectedCarId, setPreselectedCarId] = useState(null);

  const handleOpenAddServiceWithCar = (carId) => {
    setPreselectedCarId(carId || null);
    setIsAddServiceOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-charcoal-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          onOpenAddCar={() => setIsAddCarOpen(true)}
          onOpenAddService={() => {
            setPreselectedCarId(null);
            setIsAddServiceOpen(true);
          }}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar
              onOpenAddCar={() => {
                setMobileMenuOpen(false);
                setIsAddCarOpen(true);
              }}
              onOpenAddService={() => {
                setMobileMenuOpen(false);
                setPreselectedCarId(null);
                setIsAddServiceOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onOpenAddCar={() => setIsAddCarOpen(true)}
          onOpenAddService={() => {
            setPreselectedCarId(null);
            setIsAddServiceOpen(true);
          }}
          toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet
            context={{
              onOpenAddCar: () => setIsAddCarOpen(true),
              onOpenAddService: handleOpenAddServiceWithCar,
            }}
          />
        </main>
      </div>

      {/* Global Modals */}
      <AddCarModal
        isOpen={isAddCarOpen}
        onClose={() => setIsAddCarOpen(false)}
        onSuccess={() => {
          // Trigger any refresh if needed
          window.dispatchEvent(new CustomEvent('car-created'));
        }}
      />

      <AddServiceModal
        isOpen={isAddServiceOpen}
        preselectedCarId={preselectedCarId}
        onClose={() => {
          setIsAddServiceOpen(false);
          setPreselectedCarId(null);
        }}
        onSuccess={() => {
          window.dispatchEvent(new CustomEvent('service-created'));
        }}
      />
    </div>
  );
};
