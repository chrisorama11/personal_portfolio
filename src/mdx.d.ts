import type { WritingMeta } from "./writing/types";

declare module "*.mdx" {
  const MDXComponent: (props: any) => JSX.Element;
  export const meta: WritingMeta;
  export default MDXComponent;
}
