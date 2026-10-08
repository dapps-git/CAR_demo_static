import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const s = status || 'Pending';

  let config = {
    bg: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    dot: 'bg-[#F59E0B]',
    label: 'Pending',
  };

  if (s === 'In Service') {
    config = {
      bg: 'bg-[#EAF4FC] text-[#1677C8] border-[#BAE0FD]',
      dot: 'bg-[#1677C8] animate-pulse',
      label: 'In Service',
    };
  } else if (s === 'Completed') {
    config = {
      bg: 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]',
      dot: 'bg-[#16A36A]',
      label: 'Completed',
    };
  } else if (s === 'Delivered') {
    config = {
      bg: 'bg-slate-100 text-[#667085] border-[#E2E8F0]',
      dot: 'bg-[#667085]',
      label: 'Delivered',
    };
  } else if (s === 'Ready') {
    config = {
      bg: 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]',
      dot: 'bg-[#16A36A]',
      label: 'Ready',
    };
  }

  const sizeClasses = size === 'lg' 
    ? 'px-3 py-1 text-xs font-semibold' 
    : 'px-2.5 py-0.5 text-[11px] font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} tracking-tight shadow-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
