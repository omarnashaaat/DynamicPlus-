import { LucideIcon, icons } from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon = ({ name, size = 24, className, strokeWidth }: IconProps) => {
  // Convert kebab-case to PascalCase for Lucide
  const pascalName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') as keyof typeof icons;

  const LucideIcon = icons[pascalName] as LucideIcon;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" (PascalCase: "${pascalName}") not found in lucide-react`);
    return null;
  }

  return <LucideIcon size={size} className={className} strokeWidth={strokeWidth} />;
};
