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
        className="block text-sm font-medium text-foreground mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-input bg-background px-3 py-3 pl-9 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-11 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
