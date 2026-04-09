import Link from 'next/link';
import { Search, Settings, User as UserIcon, Bell } from 'lucide-react';

export function Navbar() {
  return (
    <header className="w-full top-0 sticky bg-[#0a0f16]/90 backdrop-blur-3xl z-[99] border-b border-white/5 flex items-center justify-center">
      <div className="flex justify-between items-center px-6 md:px-10 py-5 w-full max-max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group transition-all">
            <div className="relative">
              <img src="/nexu.png" alt="NEXU Logo" className="h-9 w-auto brightness-110 drop-shadow-[0_0_12px_rgba(24,136,243,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(24,136,243,0.6)] transition-all" />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-blue-light animate-pulse shadow-[0_0_8px_rgba(24,136,243,1)]"></div>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Red: Sincronizada</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1 md:gap-2 pr-4 border-r border-white/5">
            <button className="p-2.5 rounded-2xl hover:bg-white/5 transition-all text-white/20 hover:text-nexus-blue-light active:scale-90 group relative">
              <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>
            <button className="p-2.5 rounded-2xl hover:bg-white/5 transition-all text-white/20 hover:text-nexus-blue-light active:scale-90 group relative">
              <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-nexus-blue-light rounded-full border-2 border-[#0a0f16] shadow-[0_0_8px_rgba(24,136,243,0.6)]"></span>
            </button>
            <button className="p-2.5 rounded-2xl hover:bg-white/5 transition-all text-white/20 hover:text-nexus-blue-light active:scale-90 group">
              <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>
          
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">Alexander V.</p>
              <p className="text-[8px] font-black text-nexus-blue-light/60 uppercase tracking-widest leading-none">ID: 9921-X</p>
            </div>
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-nexus-blue-light/20 bg-white/5 flex items-center justify-center group-hover:border-nexus-blue-light transition-all shadow-[0_0_15px_rgba(11,64,193,0.1)] group-hover:shadow-[0_0_20px_rgba(24,136,243,0.2)]">
              <UserIcon className="h-5 w-5 text-nexus-blue-light group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
