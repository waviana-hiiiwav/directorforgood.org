import Deck from '@/components/otw-deck/Deck';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oakland Tech Week Phase II Proposal',
  description: 'Oakland Tech Week 2025-2026 Phase II Proposal and Vision',
};

export default function OTWDeckPage() {
  return (
    <main className="min-h-screen bg-black">
      <Deck />
    </main>
  );
}
