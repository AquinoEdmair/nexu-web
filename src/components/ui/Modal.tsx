import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className={cn(
        "relative z-50 w-full max-w-lg rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-2xl animate-in zoom-in-95 duration-300",
        className
      )}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-white/5 transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {(title || description) && (
          <div className="flex flex-col space-y-2 text-center sm:text-left mb-6">
            {title && <h2 className="text-xl font-bold text-white tracking-tight leading-none">{title}</h2>}
            {description && <p className="text-sm text-on-surface-variant font-medium">{description}</p>}
          </div>
        )}
        
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}
