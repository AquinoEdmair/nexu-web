'use client';

import Image from 'next/image';
import { useTeam } from '@/lib/hooks/useTeam';
import { TeamMember } from '@/lib/api/team';
import { useTranslations } from 'next-intl';

function MemberCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="glass-card p-8 group hover:border-nexus-blue/30 transition-all duration-500 relative overflow-hidden bg-white/[0.01] flex flex-col items-center text-center">
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-nexus-blue transition-all duration-700" />

      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 ring-2 ring-white/10 group-hover:ring-nexus-blue/40 transition-all duration-500">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-nexus-blue/20 flex items-center justify-center">
            <span className="text-2xl font-black text-nexus-blue-light">{initials}</span>
          </div>
        )}
      </div>

      <h4 className="text-lg font-black text-white uppercase tracking-tight italic mb-1">
        {member.name}
      </h4>
      <p className="text-xs font-bold text-nexus-blue-light uppercase tracking-widest mb-4">
        {member.title}
      </p>
      {member.bio && (
        <p className="text-sm text-nexus-text/70 leading-relaxed font-medium">
          {member.bio}
        </p>
      )}
    </div>
  );
}

export function TeamSection() {
  const { data: members, isLoading } = useTeam();
  const t = useTranslations('home.team');

  if (isLoading || !members?.length) return null;

  return (
    <section id="equipo" className="space-y-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nexus-blue-light mb-4">
            {t('sectionLabel')}
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            {t('title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-blue to-white/60">
              NEXU.
            </span>
          </h3>
        </div>
        <p className="max-w-md text-nexus-text text-sm font-medium leading-relaxed italic opacity-60">
          "{t('quote')}"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
