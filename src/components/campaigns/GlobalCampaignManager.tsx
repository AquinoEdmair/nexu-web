'use client';

import { useEffect, useState } from 'react';
import { useCampaigns, type Campaign } from './useCampaigns';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function GlobalCampaignManager() {
  const { activeCampaigns, markAsViewed, respondToCampaign } = useCampaigns();
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only show if there's no active modal and we haven't suppressed them for this session
    if (activeCampaigns.length > 0 && !currentCampaign && !sessionStorage.getItem('campaigns_suppressed')) {
      const highestPriority = [...activeCampaigns].sort((a, b) => b.priority - a.priority)[0];
      
      setCurrentCampaign(highestPriority);
      setIsOpen(true);
      markAsViewed.mutate(highestPriority.id);
    }
  }, [activeCampaigns, currentCampaign, markAsViewed]);

  const handleAction = async (action: 'accepted' | 'rejected') => {
    if (!currentCampaign) return;

    setIsOpen(false);
    
    // Suppress further campaigns for this session if they rejected it (optional UX pattern)
    if (action === 'rejected') {
      sessionStorage.setItem('campaigns_suppressed', 'true');
    }

    try {
      await respondToCampaign.mutateAsync({ id: currentCampaign.id, action });
      
      if (action === 'accepted' && currentCampaign.cta_type === 'redirect' && currentCampaign.cta_url) {
        router.push(currentCampaign.cta_url);
      }
    } finally {
      setCurrentCampaign(null);
    }
  };

  if (!currentCampaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleAction('rejected')}>
      <DialogContent className="sm:max-w-md bg-[#0a0f16] border border-white/10 text-white rounded-3xl overflow-hidden p-0 gap-0">
        <DialogTitle className="sr-only">{currentCampaign.title}</DialogTitle>
        <DialogDescription className="sr-only">Campaign Modal</DialogDescription>
        
        {currentCampaign.image_url && (
          <div className="w-full h-48 bg-white/5 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentCampaign.image_url} 
              alt={currentCampaign.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
              {currentCampaign.title}
            </h3>
            
            {currentCampaign.description && (
              <div 
                className="text-sm text-white/60 leading-relaxed prose prose-invert"
                // WARNING: Use DOMPurify in production before injecting HTML
                dangerouslySetInnerHTML={{ __html: currentCampaign.description }}
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {currentCampaign.type === 'action' && currentCampaign.cta_text && (
              <Button 
                onClick={() => handleAction('accepted')}
                className="w-full bg-nexus-blue hover:bg-nexus-blue-light text-white font-black uppercase tracking-widest rounded-xl h-12"
              >
                {currentCampaign.cta_text}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => handleAction('rejected')}
              className="w-full border-white/10 hover:bg-white/5 text-white/60 font-bold uppercase tracking-wider rounded-xl h-12"
            >
              Cerrar
            </Button>
          </div>
        </div>
        
        <button 
          onClick={() => handleAction('rejected')}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/60 transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
