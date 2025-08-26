import { UIMessage } from "ai";
import { LocationTool } from "./LocationTool";
import { WeatherTool } from "./WeatherTool";

interface ToolRendererProps {
  part: UIMessage["parts"][0];
  messageId: string;
  index: number;
}

export function ToolRenderer({ part, messageId, index }: ToolRendererProps) {
  switch (part.type) {
    case "tool-getLocation":
      return <LocationTool part={part} messageId={messageId} index={index} />;

    case "tool-getWeather":
      return <WeatherTool part={part} messageId={messageId} index={index} />;

    default:
      return null;
  }
}
