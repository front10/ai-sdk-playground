import { LocationTool } from "./LocationTool";
import { ToolPart } from "./types";
import { WeatherTool } from "./WeatherTool";

export interface ToolRendererProps {
  part: ToolPart;
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
