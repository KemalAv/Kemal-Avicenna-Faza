import React from 'react';
import { LatexRenderer } from './LatexRenderer';

interface ContentRendererProps {
  content: string;
  latexEnabled?: boolean;
  className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  content, 
  latexEnabled = true,
  className = ''
}) => {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <LatexRenderer content={content.replace(/\n/g, '<br/>')} enabled={latexEnabled} />
    </div>
  );
};
