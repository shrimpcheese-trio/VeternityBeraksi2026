"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

export function PasswordInput({
  name,
  label,
  placeholder,
  required,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-navy mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          placeholder={placeholder}
          className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-10 text-sm text-navy outline-none transition-all focus:border-sky focus:bg-white focus:ring-4 focus:ring-sky/10"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-11 text-slate-400 hover:text-navy transition-colors"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
