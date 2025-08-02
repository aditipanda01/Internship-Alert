import { Youtube, Linkedin, Send, Instagram } from 'lucide-react';
import type { Platform, PlatformInfo } from '@/lib/types';

export const PLATFORM_INFO: Record<Platform, PlatformInfo> = {
  YouTube: { name: 'YouTube', Icon: Youtube, color: '#FF0000' },
  LinkedIn: { name: 'LinkedIn', Icon: Linkedin, color: '#0A66C2' },
  Telegram: { name: 'Telegram', Icon: Send, color: '#24A1DE' },
  Instagram: { name: 'Instagram', Icon: Instagram, color: '#E4405F' },
};

export const PLATFORMS = Object.values(PLATFORM_INFO);
