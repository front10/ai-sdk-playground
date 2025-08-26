import { UIMessage } from "ai";
import { WeatherTool } from "./WeatherTool";

interface ToolRendererProps {
  part: UIMessage["parts"][0];
  messageId: string;
  index: number;
}

export function ToolRenderer({ part, messageId, index }: ToolRendererProps) {
  switch (part.type) {
    case "tool-getWeather":
      return <WeatherTool part={part} messageId={messageId} index={index} />;

    default:
      return null;
  }
}
