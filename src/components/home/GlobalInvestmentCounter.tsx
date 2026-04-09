'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useGlobalInvestment } from '@/lib/hooks/useMetrics';
import { formatCurrency } from '@/lib/utils/format';
import { TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function GlobalInvestmentCounter() {
  const { data, isLoading } = useGlobalInvestment();
  const [target, setTarget] = useState(0);

  useEffect(() => {
    if (data?.total_investment) {
      setTarget(data.total_investment);
    }
  }, [data]);

  const springConfig = { damping: 20, stiffness: 100 };
  const springValue = useSpring(0, springConfig);
  const displayValue = useTransform(springValue, (latest) => 
    formatCurrency(Math.floor(latest))
  );

  useEffect(() => {
    springValue.set(target);
  }, [target, springValue]);

  if (isLoading) {
    return (
      <div className="h-48 w-full bg-white/5 animate-pulse rounded-2xl border border-white/10" />
    );
  }

  return (
    <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-8 backdrop-blur-xl">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Inversión Total Asegurada</span>
          </div>
          <h2 className="text-slate-400 text-lg">Confianza global en NEXU</h2>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <motion.div 
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span>{displayValue}</motion.span>
          </motion.div>
          <div className="flex items-center gap-2 text-emerald-400 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Creciendo en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full" />
      <div className="absolute -left-16 -top-16 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
    </Card>
  );
}
