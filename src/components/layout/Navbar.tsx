'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User as UserIcon, Bell, LogOut, Shield, ChevronDown, Check, CheckCheck } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useUnreadCount, useNotifications, useMarkRead, useMarkAllRead } from '@/lib/hooks/useNotifications';
import type { InAppNotification } from '@/lib/api/notifications';

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useNotifications(1);
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllRead();
  const router = useRouter();

  const handleClick = (n: InAppNotification) => {
    if (!n.read_at) markRead(n.id);
    onClose();
    if (n.data.url) router.push(n.data.url);
  };

  return (
    <div className="absolute right-0 mt-4 w-80 bg-[#0d131c] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Notificaciones</p>
        <button
          onClick={() => markAllRead()}
          disabled={markingAll}
          className="flex items-center gap-1 text-[8px] font-black text-nexus-blue-light/60 hover:text-nexus-blue-light uppercase tracking-widest transition-all disabled:opacity-40"
        >
          <CheckCheck className="w-3 h-3" />
          Marcar todas
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
        {isLoading && (
          <div className="p-6 text-center text-[10px] text-white/20 uppercase tracking-widest">Cargando...</div>
        )}
        {!isLoading && (!data?.data?.length) && (
          <div className="p-6 text-center text-[10px] text-white/20 uppercase tracking-widest">Sin notificaciones</div>
        )}
        {data?.data?.map((n) => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-all flex items-start gap-3 ${!n.read_at ? 'bg-nexus-blue/5' : ''}`}
          >
            <div className="mt-1 flex-shrink-0">
              {n.read_at
                ? <div className="w-2 h-2 rounded-full bg-white/10" />
                : <div className="w-2 h-2 rounded-full bg-nexus-blue-light shadow-[0_0_6px_rgba(24,136,243,0.8)]" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-black uppercase tracking-tight leading-tight ${n.read_at ? 'text-white/40' : 'text-white'}`}>
                {n.data.title}
              </p>
              <p className="text-[9px] text-white/30 mt-0.5 leading-relaxed line-clamp-2">
                {n.data.body}
              </p>
              <p className="text-[8px] text-white/20 mt-1 uppercase tracking-widest">
                {new Date(n.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!n.read_at && (
              <Check className="w-3 h-3 text-nexus-blue-light flex-shrink-0 mt-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadCount();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsBellOpen(false);
      }
    };
    if (isBellOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isBellOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="w-full top-0 sticky bg-[#0a0f16]/90 backdrop-blur-3xl z-[99] border-b border-white/5 flex items-center justify-center">
      <div className="flex justify-between items-center px-6 md:px-10 py-5 w-full max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group transition-all">
            <div className="relative">
              <img src="/nexu.png" alt="NEXU Logo" className="h-9 w-auto brightness-110 drop-shadow-[0_0_12px_rgba(24,136,243,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(24,136,243,0.6)] transition-all" />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-blue-light animate-pulse shadow-[0_0_8px_rgba(24,136,243,1)]"></div>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Estado: Protegido</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Notification Bell */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => { setIsBellOpen(!isBellOpen); setIsProfileOpen(false); }}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:border-nexus-blue-light/40 hover:bg-nexus-blue/10 transition-all"
            >
              <Bell className="w-4 h-4 text-white/50 hover:text-nexus-blue-light transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-nexus-blue-light rounded-full text-[8px] font-black text-white flex items-center justify-center shadow-[0_0_8px_rgba(24,136,243,0.8)]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {isBellOpen && (
              <NotificationDropdown onClose={() => setIsBellOpen(false)} />
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsBellOpen(false); }}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">
                  {user?.name || 'Inversor NEXU'}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <Shield className="w-2 h-2 text-nexus-blue-light" />
                  <p className="text-[8px] font-black text-nexus-blue-light/60 uppercase tracking-widest leading-none">
                    ID: {user?.referral_code || 'AUTH-0'}
                  </p>
                </div>
              </div>
              <div className={`w-11 h-11 rounded-2xl overflow-hidden border transition-all shadow-[0_0_15px_rgba(11,64,193,0.1)] flex items-center justify-center ${isProfileOpen ? 'border-nexus-blue-light bg-nexus-blue/10' : 'border-nexus-blue-light/20 bg-white/5 group-hover:border-nexus-blue-light'}`}>
                <UserIcon className={`h-5 w-5 transition-transform ${isProfileOpen ? 'text-nexus-blue-light scale-110' : 'text-nexus-blue-light group-hover:scale-110'}`} />
              </div>
              <ChevronDown className={`w-3 h-3 text-white/20 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-nexus-blue-light' : 'group-hover:text-white/40'}`} />
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div className="absolute right-0 mt-4 w-64 bg-[#0d131c] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Estatus de Perfil</p>
                    <p className="text-xs font-black text-white uppercase truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-white/60 uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                    >
                      <UserIcon className="w-4 h-4 text-nexus-blue-light" />
                      Gestionar Perfil
                    </Link>
                    <div className="h-px bg-white/5 my-2 mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 top-[85px] bg-[#0a0f16]/60 backdrop-blur-md z-[98] flex justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl">
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-nexus-blue-light" />
                <input
                  autoFocus
                  placeholder="BUSCAR MOVIMIENTO, RENDIMIENTO O SOPORTE..."
                  className="w-full bg-[#0d131c] border border-nexus-blue-light/30 rounded-[2rem] py-5 px-16 text-xs font-black uppercase text-white tracking-widest focus:outline-none focus:border-nexus-blue-light focus:ring-4 focus:ring-nexus-blue/10 transition-all"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/20 hover:text-white uppercase tracking-widest"
                >
                  [BORRAR]
                </button>
             </div>
          </div>
        </div>
      )}
    </header>
  );
}
