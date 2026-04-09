'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Zap, DollarSign } from 'lucide-react';

const ACTIVITIES = [
  { type: 'deposit', amount: '2,450.00', currency: 'USDT', user: 'Us***92', time: 'Justo ahora' },
  { type: 'profit', amount: '124.20', currency: 'USD', user: 'Mi***8k', time: 'Hace 2m' },
  { type: 'withdrawal', amount: '1,200.00', currency: 'BTC', user: 'An***2x', time: 'Hace 5m' },
  { type: 'deposit', amount: '500.00', currency: 'USDT', user: 'Ka***01', time: 'Hace 8m' },
  { type: 'profit', amount: '89.45', currency: 'USD', user: 'Jo***pp', time: 'Hace 12m' },
  { type: 'deposit', amount: '10,000.00', currency: 'USDT', user: 'Wh***le', time: 'Hace 15m' },
];

export function ActivityTicker() {
  return (
    <div className="w-full bg-[#050b11] border-y border-white/5 py-3.5 overflow-hidden whitespace-nowrap relative group">
      {/* Fade effects for edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050b11] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050b11] to-transparent z-10"></div>

      <motion.div 
        className="flex gap-16 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 35, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Double array to ensure seamless loop */}
        {[...ACTIVITIES, ...ACTIVITIES].map((activity, idx) => (
          <div key={idx} className="flex items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase">
            <div className={`p-1.5 rounded-md ${
              activity.type === 'deposit' ? 'bg-nexus-blue/10 text-nexus-blue border border-nexus-blue/20' :
              activity.type === 'profit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            } shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
              {activity.type === 'deposit' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {activity.type === 'profit' && <Zap className="w-3.5 h-3.5" />}
              {activity.type === 'withdrawal' && <ArrowDownLeft className="w-3.5 h-3.5" />}
            </div>
            <span className="text-white/40 italic">{activity.user}</span>
            <span className="text-white">
              {activity.type === 'deposit' ? 'Depósito' : 
               activity.type === 'profit' ? 'Rendimiento' : 'Retiro'}
            </span>
            <span className={`${
              activity.type === 'deposit' ? 'text-nexus-blue' :
              activity.type === 'profit' ? 'text-emerald-400 font-black' :
              'text-amber-400'
            } drop-shadow-[0_0_8px_currentColor] opacity-90`}>
              {activity.amount} {activity.currency}
            </span>
            <span className="text-nexus-blue-light/50 font-bold">{activity.time.toUpperCase()}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
