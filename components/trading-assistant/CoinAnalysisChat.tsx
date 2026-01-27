"use client";

import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface CoinAnalysisChatProps {
  coinId: string;
  coinSymbol: string;
  coinName: string;
}

export default function CoinAnalysisChat({ coinId, coinSymbol, coinName }: CoinAnalysisChatProps) {
  return (
    <Button variant="outline" className="gap-2 cursor-not-allowed opacity-60" disabled>
      <Bot className="w-4 h-4" />
      Ask AI Assistant
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium ml-1">
        Coming Soon
      </span>
    </Button>
  );
}
