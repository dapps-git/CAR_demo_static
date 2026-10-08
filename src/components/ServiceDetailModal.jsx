import React from 'react';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';
import { ServiceTypeBadge } from './ServiceTypeBadge';
import {
  Car,
  User,
  Calendar,
  Gauge,
  Clock,
  Edit3,
  Trash2,
  FileText,
  DollarSign,
  Package,
} from 'lucide-react';

export const ServiceDetailModal = ({
  isOpen,
  onClose,
  service,
  onEdit,
  onDelete,
}) => {
  if (!service) return null;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const car = service.carId || {};
  const customer = service.customerId || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Service Job Card — ${service.serviceCode || 'Record'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-lg border border-blue-200">
                  {car.registrationNumber || 'N/A'}
                </span>
                <h4 className="text-base font-bold text-slate-800">
                  {car.carName} {car.model ? `(${car.model})` : ''}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Customer: <span className="text-slate-800 font-semibold">{customer.name || 'N/A'}</span>
                {customer.phone && ` • ${customer.phone}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
            <StatusBadge status={service.status} size="lg" />
            <span className="font-mono text-xs text-slate-400 font-semibold">
              Code: {service.serviceCode || 'SRV-000'}
            </span>
          </div>
        </div>

        {/* Quick Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Service Date</span>
            </div>
            <p className="text-xs font-bold text-slate-800 font-mono">
              {formatDate(service.serviceDate)}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-600" />
              <span>Odometer</span>
            </div>
            <p className="text-xs font-bold text-slate-800 font-mono">
              {service.currentKm ? `${service.currentKm.toLocaleString()} KM` : '—'}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <span>Service Type</span>
            </div>
            <ServiceTypeBadge type={service.serviceType} />
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Exp. Delivery</span>
            </div>
            <p className="text-xs font-bold text-slate-800 font-mono">
              {formatDate(service.expectedDeliveryDate)}
            </p>
          </div>
        </div>

        {/* Work Description & Parts */}
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Work Performed
            </h5>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {service.workDescription || 'Standard vehicle service checklist carried out.'}
            </p>
          </div>

          {service.parts && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-blue-600" />
                Parts & Materials Replaced
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {service.parts}
              </p>
            </div>
          )}

          {service.notes && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Technician / Service Notes
              </h5>
              <p className="text-xs text-slate-600 italic">{service.notes}</p>
            </div>
          )}
        </div>

        {/* Cost Summary Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Cost & Billing Breakdown
            </h5>
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Labour Charges</span>
              <span className="font-mono font-bold text-slate-800">
                ₹{(service.labourCost || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Parts & Materials</span>
              <span className="font-mono font-bold text-slate-800">
                ₹{(service.partsCost || 0).toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900">
              <span className="text-blue-700 font-extrabold">Total Amount</span>
              <span className="font-mono text-blue-700 text-base font-extrabold">
                ₹{(service.totalCost || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete?.(service);
            }}
            className="btn-danger text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Service</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit?.(service);
              }}
              className="btn-primary text-xs font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Service</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
