'use client';

import { useState } from 'react';
import {
  MessageSquare, Plus, ChevronLeft, Send, Loader2,
  Clock, CheckCircle, AlertCircle, X, Headphones
} from 'lucide-react';
import { useCreateTicket, useReplyTicket, useTicket, useTickets } from '@/lib/hooks/useSupport';
import { useNotificationStore } from '@/lib/store/notificationStore';
import type { SupportTicket } from '@/types/models';
import { AxiosError } from 'axios';

const STATUS_CONFIG = {
  open:        { label: 'Abierto',     className: 'bg-amber-500/10 border-amber-500/30 text-amber-400',        icon: AlertCircle },
  in_progress: { label: 'En Progreso', className: 'bg-nexus-blue/10 border-nexus-blue-light/30 text-nexus-blue-light', icon: Clock },
  closed:      { label: 'Cerrado',     className: 'bg-white/5 border-white/10 text-white/30',                  icon: CheckCircle },
} as const;

// ── Create Ticket Modal ───────────────────────────────────────────────────────

function CreateTicketModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { mutate, isPending } = useCreateTicket();
  const { addNotification } = useNotificationStore();

  const handleSubmit = () => {
    if (subject.trim().length < 5 || message.trim().length < 10) return;
    mutate(
      { subject, message },
      {
        onSuccess: () => {
          addNotification({ type: 'success', title: 'Ticket Creado', message: 'Tu ticket fue registrado. Te responderemos en máximo 48 horas hábiles.' });
          onClose();
        },
        onError: (err) => {
          const msg = err instanceof AxiosError ? err.response?.data?.message ?? 'Error al crear ticket.' : 'Error inesperado.';
          addNotification({ type: 'error', title: 'Error', message: msg });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0a0f16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Nuevo Ticket de Soporte</h2>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5">Respuesta en máx. 48 horas hábiles (GMT-4)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
              <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
              Asunto
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Describe brevemente tu problema..."
              maxLength={150}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-white font-black text-sm outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
              <span className="w-1 h-3 bg-nexus-blue-light rounded-full inline-block" />
              Descripción
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Explica tu consulta con el mayor detalle posible..."
              rows={5}
              maxLength={5000}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-white font-black text-sm outline-none focus:border-nexus-blue/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 resize-none"
            />
            <p className="text-[9px] text-white/20 font-black text-right">{message.length}/5000</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending || subject.trim().length < 5 || message.trim().length < 10}
            className="w-full py-4 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Crear Ticket</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Ticket Thread ─────────────────────────────────────────────────────────────

function TicketThread({ ticket, onBack }: { ticket: SupportTicket; onBack: () => void }) {
  const [replyText, setReplyText] = useState('');
  const { data, isLoading } = useTicket(ticket.id);
  const { mutate, isPending } = useReplyTicket(ticket.id);
  const { addNotification } = useNotificationStore();

  const full = data?.data;
  const messages = full?.messages ?? [];
  const isClosed = full?.status === 'closed';

  const ticketId = '#' + ticket.id.substring(0, 8).toUpperCase();
  const statusCfg = STATUS_CONFIG[full?.status ?? ticket.status] ?? STATUS_CONFIG.open;
  const StatusIcon = statusCfg.icon;

  const handleReply = () => {
    if (replyText.trim().length < 2) return;
    mutate(replyText.trim(), {
      onSuccess: () => {
        setReplyText('');
        addNotification({ type: 'success', title: 'Respuesta enviada', message: 'Tu mensaje fue enviado al equipo de soporte.' });
      },
      onError: (err) => {
        const msg = err instanceof AxiosError ? err.response?.data?.message ?? 'Error al enviar.' : 'Error inesperado.';
        addNotification({ type: 'error', title: 'Error', message: msg });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Ticket header */}
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="px-8 py-5 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{ticketId}</p>
              <h2 className="text-base font-black text-white uppercase tracking-tighter">{ticket.subject}</h2>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${statusCfg.className}`}>
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </span>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-nexus-blue-light animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-widest py-16">Sin mensajes</p>
          ) : (
            messages.map(msg => {
              const isAdmin = msg.sender_type === 'admin';
              return (
                <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-4 space-y-1.5 ${
                    isAdmin
                      ? 'bg-nexus-blue/10 border border-nexus-blue/20 rounded-tl-none'
                      : 'bg-white/5 border border-white/10 rounded-tr-none'
                  }`}>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'text-nexus-blue-light' : 'text-white/30'}`}>
                      {isAdmin ? 'Soporte NEXU' : 'Tú'} · {new Date(msg.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })} {new Date(msg.created_at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-white/80 font-medium leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply input */}
        {!isClosed && (
          <div className="px-6 pb-6">
            <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                rows={2}
                className="flex-1 bg-transparent text-white font-medium text-sm outline-none placeholder:text-white/20 resize-none"
              />
              <button
                onClick={handleReply}
                disabled={isPending || replyText.trim().length < 2}
                className="self-end p-3 bg-nexus-blue rounded-xl hover:bg-nexus-blue-light transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                {isPending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
        )}

        {isClosed && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/5 rounded-2xl">
              <CheckCircle className="w-4 h-4 text-white/20 shrink-0" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Este ticket está cerrado. Puedes abrir uno nuevo si necesitas más ayuda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Ticket List ───────────────────────────────────────────────────────────────

function TicketList({ onSelect }: { onSelect: (t: SupportTicket) => void }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTickets(page);
  const tickets = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-nexus-blue-light animate-spin" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl flex flex-col items-center justify-center py-24 gap-4 backdrop-blur-xl">
        <MessageSquare className="w-12 h-12 text-white/5" />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No tienes tickets de soporte</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0f16]/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
        <div className="divide-y divide-white/5">
          {tickets.map(ticket => {
            const cfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open;
            const Icon = cfg.icon;
            const ticketId = '#' + ticket.id.substring(0, 8).toUpperCase();
            return (
              <button
                key={ticket.id}
                onClick={() => onSelect(ticket)}
                className="w-full px-8 py-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors text-left group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-2.5 rounded-xl border ${cfg.className} shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white uppercase tracking-tighter truncate">{ticket.subject}</p>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-0.5">
                      {ticketId} · {new Date(ticket.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                      {ticket.messages_count !== undefined && ` · ${ticket.messages_count} mensaje${ticket.messages_count !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] shrink-0 ${cfg.className}`}>
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors">Anterior</button>
          <span className="text-[10px] font-black text-nexus-blue-light">{page} / {meta.last_page}</span>
          <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 disabled:opacity-20 hover:text-nexus-blue-light transition-colors">Siguiente</button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  return (
    <main className="max-w-4xl mx-auto pt-6 pb-32 px-4 md:px-8 space-y-10">
      {showCreate && <CreateTicketModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Headphones className="w-4 h-4 text-nexus-blue-light animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-nexus-blue-light/60 uppercase">Módulo: Soporte al Cliente</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Centro de Soporte</h1>
          <p className="text-sm text-nexus-text/40 font-medium tracking-tight">Atención personalizada en máximo 48 horas hábiles (GMT-4).</p>
        </div>
        {!selectedTicket && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-3 bg-nexus-blue text-white font-black rounded-2xl hover:bg-nexus-blue-light transition-all uppercase tracking-[0.2em] text-xs shadow-[0_4px_20px_rgba(11,64,193,0.3)]"
          >
            <Plus className="w-4 h-4" /> Nuevo Ticket
          </button>
        )}
      </header>

      {selectedTicket ? (
        <TicketThread ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
      ) : (
        <TicketList onSelect={setSelectedTicket} />
      )}
    </main>
  );
}
