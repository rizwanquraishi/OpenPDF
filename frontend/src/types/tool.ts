export type ToolCategory = 'organize' | 'optimize' | 'convert' | 'edit' | 'security';

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolDefinition {
  id: string; // slug e.g. "merge-pdf"
  name: string;
  category: ToolCategory;
  shortDescription: string;
  description: string;
  popular?: boolean;
  icon: string;
  accept: string;
  multiple: boolean;
  endpoint: string;
  clientSide?: boolean;
  metaTitle: string;
  metaDescription: string;
  howTo: string[];
  faqs: ToolFaq[];
  relatedTools: string[];
}
