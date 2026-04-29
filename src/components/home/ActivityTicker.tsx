'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';
import { useRecentActivity } from '@/lib/hooks/useMetrics';
import { useTranslations } from 'next-intl';

export function ActivityTicker() {
  const { data: activities = [] } = useRecentActivity();
  const t = useTranslations('home.activityTicker');

  const formatTime = (isoTime: string) => {
    try {
      const diffInMinutes = Math.floor((new Date().getTime() - new Date(isoTime).getTime()) / 60000);
      
      if (diffInMinutes < 1) return t('justNow');
      if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes });
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return t('hoursAgo', { hours: diffInHours });
      
      const diffInDays = Math.floor(diffInHours / 24);
      return t('daysAgo', { days: diffInDays });
    } catch (e) {
      return isoTime;
    }
  };

  const getLabel = (type: string) => {
    if (type === 'deposit') return t('deposit');
    if (type === 'yield') return t('yield');
    if (type === 'withdrawal') return t('withdrawal');
    return type;
  };

  // If no data yet, show nothing or placeholder
  if (activities.length === 0) return null;

  return (
    <div className="w-full bg-[#050b11] border-y border-white/5 py-3.5 overflow-hidden whitespace-nowrap relative group">
      {/* Fade effects for edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050b11] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050b11] to-transparent z-10"></div>

      <motion.div 
        className="flex gap-16 items-center"
        animate={{ x: [0, -2000] }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {/* Triple array to ensure seamless loop with dynamic data */}
        {[...activities, ...activities, ...activities].map((activity, idx) => (
          <div key={idx} className="flex items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase">
            <div className={`p-1.5 rounded-md ${
              activity.type === 'deposit' ? 'bg-nexus-blue/10 text-nexus-blue border border-nexus-blue/20' :
              activity.type === 'yield' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            } shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
              {activity.type === 'deposit' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {activity.type === 'yield' && <Zap className="w-3.5 h-3.5" />}
              {activity.type === 'withdrawal' && <ArrowDownLeft className="w-3.5 h-3.5" />}
            </div>
            <span className="text-white/40 italic">{activity.user}</span>
            <span className="text-white">
              {getLabel(activity.type)}
            </span>
            <span className={`${
              activity.type === 'deposit' ? 'text-nexus-blue' :
              activity.type === 'yield' ? 'text-emerald-400 font-black' :
              'text-amber-400'
            } drop-shadow-[0_0_8px_currentColor] opacity-90`}>
              {parseFloat(activity.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {activity.currency}
            </span>
            <span className="text-nexus-blue-light/50 font-bold">{formatTime(activity.time).toUpperCase()}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
