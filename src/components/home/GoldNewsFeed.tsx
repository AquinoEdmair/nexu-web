'use client';

import { Clock, ExternalLink } from 'lucide-react';
import { useGoldNews } from '@/lib/hooks/useMetrics';
import { useTranslations } from 'next-intl';

const MOCK_NEWS = [
  {
    title: 'XAU/USD: El oro alcanza nuevos máximos ante debilidad del dólar',
    excerpt: 'El precio del oro supera resistencias clave mientras el índice dólar retrocede en sesiones consecutivas. Analistas apuntan a $2,500 como próximo objetivo.',
    source: 'Financial Intelligence',
    date: 'Hace 1h',
    category: 'XAU/USD',
    url: '#',
  },
  {
    title: 'Bancos centrales acumulan reservas de oro al ritmo más alto desde 1967',
    excerpt: 'La demanda institucional de oro físico marca récord anual, impulsada por la diversificación de reservas y la cobertura ante la inflación global.',
    source: 'World Gold Council',
    date: 'Hace 3h',
    category: 'Institucional',
    url: '#',
  },
  {
    title: 'Oro digital: plataformas tokenizadas registran flujo récord en Q1',
    excerpt: 'Las plataformas de inversión respaldadas en oro superan los $4,000M en activos gestionados, consolidándose como alternativa al oro físico tradicional.',
    source: 'NEXU Insight',
    date: 'Hace 5h',
    category: 'Ecosistema',
    url: '#',
  },
  {
    title: 'Tensiones geopolíticas impulsan el precio del oro como activo refugio',
    excerpt: 'En contextos de incertidumbre global, el XAU mantiene su rol histórico de depósito de valor, con entradas netas récord en ETFs respaldados en oro.',
    source: 'Reuters Commodities',
    date: 'Hace 8h',
    category: 'Mercado',
    url: '#',
  },
];

export function GoldNewsFeed() {
  const { data: newsApi, isLoading } = useGoldNews();
  const t = useTranslations('home.newsFeed');

  const news = newsApi && newsApi.length > 0 ? newsApi : MOCK_NEWS;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="group border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] p-5 lg:p-6 transition-all cursor-pointer border-l-2 border-l-transparent hover:border-l-nexus-blue rounded-2xl relative overflow-hidden">
              <div className="flex flex-col space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[.2em] text-nexus-blue-light bg-nexus-blue-light/10 px-2.5 py-1 rounded-md border border-nexus-blue/20">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-nexus-text text-[10px] font-bold">
                    <Clock className="w-3 h-3 text-nexus-blue-light" />
                    {item.date.toUpperCase()}
                  </div>
                </div>

                <div>
                  <h4 className="text-white text-base lg:text-lg font-black leading-tight group-hover:text-nexus-blue-light transition-colors mb-2">
                    {item.title}
                  </h4>
                  <p className="text-nexus-text font-medium text-[12px] lg:text-[13px] line-clamp-2 leading-relaxed opacity-90">
                    {item.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {item.source}
                  </span>
                  <div className="flex items-center gap-2 text-white/20 group-hover:text-nexus-blue-light transition-colors">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{t('readMore')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
