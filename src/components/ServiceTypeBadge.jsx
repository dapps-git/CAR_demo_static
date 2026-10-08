import React from 'react';
import { Wrench, Droplet, Wind, Disc, Cog, Sparkles } from 'lucide-react';

export const ServiceTypeBadge = ({ type }) => {
  const t = type || 'General Service';

  let config = {
    bg: 'bg-slate-50 text-[#172033] border-[#E2E8F0]',
    icon: Wrench,
  };

  if (t === 'Major Service') {
    config = {
      bg: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] font-semibold',
      icon: Sparkles,
    };
  } else if (t === 'Oil Service') {
    config = {
      bg: 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]',
      icon: Droplet,
    };
  } else if (t === 'AC Service') {
    config = {
      bg: 'bg-[#EAF4FC] text-[#1677C8] border-[#BAE0FD]',
      icon: Wind,
    };
  } else if (t === 'Brake Service') {
    config = {
      bg: 'bg-[#FEF2F2] text-[#DC3545] border-[#FECACA]',
      icon: Disc,
    };
  } else if (t === 'Engine Service') {
    config = {
      bg: 'bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]',
      icon: Cog,
    };
  }

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[12px] font-medium ${config.bg} shadow-sm`}
    >
      <IconComponent className="w-3 h-3 shrink-0" />
      <span>{t}</span>
    </span>
  );
};
