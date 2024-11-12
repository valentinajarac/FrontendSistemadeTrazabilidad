import React from 'react';
import { Certification } from '../types';

interface CertificationBadgesProps {
  certifications: Certification[];
}

const CERTIFICATION_LABELS: Record<Certification, string> = {
  'FAIRTRADE_USA': 'Fairtrade USA',
  'GLOBAL_GAP': 'Global GAP',
  'ICA': 'ICA',
  'NINGUNA': 'Sin certificaciones'
};

export function CertificationBadges({ certifications }: CertificationBadgesProps) {
  if (!certifications?.length || certifications.includes('NINGUNA')) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Sin certificaciones
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {certifications.map((cert) => (
        <span
          key={cert}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {CERTIFICATION_LABELS[cert]}
        </span>
      ))}
    </div>
  );
}