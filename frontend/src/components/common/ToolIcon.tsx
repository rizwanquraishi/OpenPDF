import React from 'react';
import * as Icons from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-6 h-6' }) => {
  // @ts-expect-error dynamic lucide icon lookup
  const IconComponent = Icons[name] || Icons.FileText;
  return <IconComponent className={className} />;
};
