export type WritingMeta = {
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
  tags?: string[];
  draft?: boolean;
};

export type WritingPostModule = {
  default: (props: unknown) => JSX.Element;
  meta: WritingMeta;
};
