export type DocStatus  = 'active' | 'expiring' | 'expired' | 'paid' | 'pending' | 'processed';
export type FileType   = 'PDF' | 'IMG' | 'DOC' | 'XLS';
export type CategoryId = 'warranty' | 'invoice' | 'deposit' | 'services' | 'contracts';

export interface DocItem {
  id:           string;
  name:         string;
  provider:     string;
  date:         string;
  amount:       number | null;
  fileType:     FileType;
  fileSize:     string;
  thumbnailUrl: string | null;
  status:       DocStatus;
  categoryId:   CategoryId;
}

export interface DocsResponse {
  docs:    DocItem[];
  total:   number;
  totals:  Partial<Record<CategoryId, number>>;
  offset:  number;
  limit:   number;
}

export interface ExtraField {
  label:     string;
  value:     string;
  icon:      string;   // nombre de Ionicon
  iconColor: string;
}

export interface LinkedDoc {
  id:        string;
  name:      string;
  subtitle:  string;
  isPrimary: boolean;
}

export interface DocumentDetail {
  id:           string;
  title:        string;
  subtitle:     string;
  category:     string;
  status:       string;
  amount:       number | null;
  currency:     string;
  date:         string;
  provider:     string;
  identifier:   string;
  fileType:     FileType;
  fileSize:     string;
  thumbnailUrl: string | null;
  originalName: string | null;
  extraFields:  ExtraField[];
  linkedDocs:   LinkedDoc[];
}