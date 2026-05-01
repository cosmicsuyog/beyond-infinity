import React from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder = "Select...", className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="
          appearance-none
          bg-[#07080f]
          border border-white/[0.08]
          hover:border-white/20
          text-white
          font-barlow text-[10px] tracking-[0.14em] uppercase
          px-3 py-1.5 pr-8
          rounded
          cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-white/20
          transition-all duration-200
          w-full
        "
      >
        <option value="" className="bg-[#0b0d18] text-white/40">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0b0d18] text-white py-2">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 group-hover:text-white/60">
        <ChevronDown size={10} />
      </div>
    </div>
  );
};

export default CustomSelect;
