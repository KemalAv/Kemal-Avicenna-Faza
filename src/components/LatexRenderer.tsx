import React from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  }
};

interface LatexRendererProps {
  content: string;
  enabled?: boolean;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ content, enabled = true }) => {
  if (!enabled) return <>{content}</>;

  return (
    <MathJaxContext config={config}>
      <MathJax>
        <span dangerouslySetInnerHTML={{ __html: content }} />
      </MathJax>
    </MathJaxContext>
  );
};
