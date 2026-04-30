'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, ShieldCheck, Loader2, MessageCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/axios';
import { configApi, PublicConfig } from '@/lib/api/config';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const t = useTranslations('home.contact');

  useEffect(() => {
    configApi.getPublicConfig().then(setConfig).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await apiClient.post('/contact', { name, email, phone, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || t('errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-20 border-t border-white/5">
      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nexus-blue-light">{t('sectionLabel')}</h2>
          <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            {t('title')} <br /> <span className="text-nexus-blue">NEXU.</span>
          </h3>
          <p className="text-nexus-text font-medium leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-nexus-blue/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-nexus-blue/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-nexus-blue-light" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{t('addressLabel')}</h4>
              <p className="text-sm font-black text-white leading-tight uppercase tracking-widest italic font-mono">
                {t('address')}
              </p>
            </div>
          </div>

          <a
            href="tel:+14708269616"
            className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-nexus-blue/20 transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-nexus-blue/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-nexus-blue-light" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{t('phoneLabel')}</h4>
              <p className="text-sm font-black text-white leading-tight uppercase tracking-[0.5em] italic font-mono">
                {t('phone')}
              </p>
            </div>
          </a>

          {config?.telegram_community_url && (
            <a
              href={config.telegram_community_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-6 rounded-2xl bg-nexus-blue/5 border border-nexus-blue/20 group hover:border-nexus-blue/40 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(11,64,193,0.1)]"
            >
              <div className="w-12 h-12 rounded-xl bg-nexus-blue/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-nexus-blue-light" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{t('telegramLabel')}</h4>
                <p className="text-sm font-black text-nexus-blue-light leading-tight uppercase tracking-widest italic">
                  {t('telegramButton')}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>

      <div className="lg:col-span-7 h-full">
        <div className="glass-card p-1 relative overflow-hidden bg-gradient-to-br from-nexus-blue/10 to-transparent">
          <form
            onSubmit={handleSubmit}
            className="bg-[#0a0c10] p-8 lg:p-10 rounded-[1.5rem] border border-white/5 space-y-8 relative z-20"
          >
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <Mail className="w-5 h-5 text-nexus-blue-light" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">{t('formTitle')}</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t('nameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t('emailLabel')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t('phoneLabel2')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t('subjectLabel')}</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('subjectPlaceholder')}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">{t('messageLabel')}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('messagePlaceholder')}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-6 text-white font-bold text-xs outline-none focus:border-nexus-blue/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 tracking-widest resize-none"
                ></textarea>
              </div>
            </div>

            {errorMsg && (
              <div className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">
                {errorMsg}
              </div>
            )}

            {success && (
              <div className="text-green-400 text-xs font-bold bg-green-400/10 p-4 rounded-xl border border-green-400/20 text-center uppercase tracking-widest">
                {t('successMessage')}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-5 bg-nexus-blue text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:bg-nexus-blue-light hover:shadow-[0_0_30px_rgba(11,64,193,0.3)] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>{t('sending')} <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : success ? (
                t('sent')
              ) : (
                <>
                  {t('submit')}
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-4 flex items-center justify-center gap-2 text-nexus-text/40 italic">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">{t('security')}</span>
            </div>
          </form>

          <div className="absolute inset-0 bg-[#0a0c10] grid grid-cols-12 grid-rows-12 opacity-[0.03] pointer-events-none">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-nexus-blue"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
