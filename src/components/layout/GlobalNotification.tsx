'use client';

import { useNotificationStore } from '@/lib/store/notificationStore';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ICON_MAP = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
};

const COLOR_MAP = {
  success: 'border-nexus-blue-light/50 text-nexus-blue-light bg-[#0a0f16]/95 shadow-[0_0_30px_rgba(24,136,243,0.15)]',
  error:   'border-red-500/50 text-red-500 bg-[#0a0f16]/95 shadow-[0_0_30px_rgba(239,68,68,0.15)]',
  warning: 'border-amber-500/50 text-amber-500 bg-[#0a0f16]/95 shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  info:    'border-nexus-blue/50 text-nexus-blue bg-[#0a0f16]/95 shadow-[0_0_30px_rgba(11,64,193,0.15)]',
};

export function GlobalNotification() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-4 w-full max-w-md px-6">
      {notifications.map((n) => {
        const Icon = ICON_MAP[n.type];
        return (
          <div
            key={n.id}
            className={cn(
              "flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-2xl animate-in slide-in-from-top-6 duration-500 ease-out fill-mode-both",
              COLOR_MAP[n.type]
            )}
          >
            <div className="shrink-0 pt-0.5">
              <Icon className={cn("h-5 w-5", n.type === 'success' ? 'animate-pulse' : '')} />
            </div>
            
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black leading-none tracking-[0.15em] uppercase text-white">
                {n.title}
              </h4>
              <p className="text-[11px] leading-relaxed font-black opacity-60 text-white uppercase tracking-tight">
                {n.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="shrink-0 p-1.5 hover:bg-white/5 rounded-xl transition-all border-none bg-transparent group"
            >
              <X className="h-4 w-4 text-white/20 group-hover:text-white transition-colors" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
