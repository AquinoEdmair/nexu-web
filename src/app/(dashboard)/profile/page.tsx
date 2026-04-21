'use client';

import React, { useState } from 'react';
import { Pencil, Lock, Key, User, CheckCircle, Save, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { apiClient } from '@/lib/api/axios';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const t = useTranslations('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.put('/auth/profile', formData);
      if (response.data.data.user) {
        setUser(response.data.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(t('updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-32 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">{t('pageStatus')}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{t('pageTitle')}</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">{t('pageSubtitle')}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <CheckCircle className="w-4 h-4 text-nexus-blue-light" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('pageKyc')}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside className="lg:col-span-5 space-y-8">
          <section className="flex flex-col items-center bg-[#0a0f16]/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-nexus-blue/20 transition-all">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-nexus-blue/5 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
              <div className="relative group/avatar mx-auto w-40 h-40">
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-nexus-blue-light/20 p-2 bg-white/5 group-hover/avatar:border-nexus-blue-light/50 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-nexus-blue/10 flex items-center justify-center">
                    <User className="w-16 h-16 text-nexus-blue-light/40" />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-wrap max-w-xs overflow-hidden">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">{user?.name}</h2>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-nexus-blue-light text-[10px] font-black tracking-[0.3em] uppercase">{t('operatorRank')}</span>
                </div>

                <div className="mt-2 flex items-center justify-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-nexus-blue-light animate-pulse shadow-[0_0_10px_rgba(24,136,243,1)]"></div>
                  <span className="text-[9px] text-white/50 font-black tracking-widest uppercase">{t('operativeStatus')}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>

        <section className="lg:col-span-7 space-y-10">
          <div className="space-y-5">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase">{t('registrationProtocol')}</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-nexus-blue-light text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  <Pencil className="w-3 h-3" /> {t('edit')}
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3" /> {t('cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-nexus-blue-light text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} {t('save')}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#0a0f16]/40 border border-white/10 rounded-[2.5rem] p-10 space-y-8 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">{t('alias')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 p-5 rounded-2xl border border-nexus-blue-light/30 text-sm font-black text-white tracking-tighter uppercase focus:outline-none focus:border-nexus-blue-light transition-all"
                    />
                  ) : (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-sm font-black text-white tracking-tighter uppercase">{user?.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">{t('corporate')}</label>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-sm font-black text-nexus-blue-light tracking-tighter uppercase">{user?.referral_code}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 opacity-60">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">{t('contactNode')}</label>
                  <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-sm font-black text-white/40 tracking-tighter">{user?.email}</p>
                    <Lock className="w-4 h-4 text-white/10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">{t('secureLine')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 p-5 rounded-2xl border border-nexus-blue-light/30 text-sm font-black text-white tracking-tighter uppercase focus:outline-none focus:border-nexus-blue-light transition-all"
                    />
                  ) : (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-sm font-black text-white tracking-tighter uppercase">{user?.phone || t('notRegistered')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-nexus-blue/5 border border-nexus-blue-light/10 rounded-[2rem] p-8 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-nexus-blue/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-nexus-blue-light" />
            </div>
            <div>
              <p className="text-[10px] font-black text-nexus-blue-light uppercase tracking-widest">{t('encryptionProtocol')}</p>
              <p className="text-xs text-white/60 font-medium">{t('encryptionDetail')}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
