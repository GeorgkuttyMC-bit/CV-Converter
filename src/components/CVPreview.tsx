import React from 'react';
import { MinimalistTheme } from './themes/MinimalistTheme';
import { CreativeTheme } from './themes/CreativeTheme';
import { CVData, ThemeConfig } from '../types';

interface CVPreviewProps {
  data: CVData | null;
  theme: ThemeConfig;
  previewRef: React.RefObject<HTMLDivElement>;
}

export function CVPreview({ data, theme, previewRef }: CVPreviewProps) {
  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-white shadow-xl rounded-lg border border-gray-100 min-h-[600px] aspect-[1/1.414]">
        <div className="w-24 h-24 mb-6 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-500">Upload a CV to see preview</p>
        <p className="text-sm mt-2 max-w-sm text-center">Your resume will be transformed and displayed here, ready for customization.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-10">
      {/* 
        This is the actual container that gets captured by html2canvas.
        Fixed aspect ratio for A4 standard (1:1.414). Width ~ 800px.
        Scale transform helps to fit it visually inside the browser while maintaining high-res for export.
      */}
      <div 
        ref={previewRef}
        className="relative mx-auto shadow-2xl overflow-hidden cv-preview-container"
        style={{ width: '800px', minHeight: '1131px', backgroundColor: '#ffffff', color: '#111827' }} 
        id="cv-preview-content"
      >
          {theme.id === 'minimalist' && <MinimalistTheme data={data} theme={theme} />}
          {theme.id === 'creative' && <CreativeTheme data={data} theme={theme} />}
      </div>
    </div>
  );
}
