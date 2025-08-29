import { SourceUrlUIPart } from "ai";
import { WebSearchToolPart } from "./types";
import { WebSearchTool } from "./WebSearchTool";

export interface ToolRendererProps {
  part: WebSearchToolPart;
  messageId: string;
  index: number;
  sources: SourceUrlUIPart[];
}

export function ToolRenderer({
  part,
  messageId,
  index,
  sources,
}: ToolRendererProps) {
  switch (part.type) {
    case "tool-web_search_preview":
      return (
        <WebSearchTool
          part={part}
          messageId={messageId}
          index={index}
          sources={sources}
        />
      );

    default:
      return null;
  }
}
