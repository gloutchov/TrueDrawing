import { Settings } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type SettingsSummaryProps = {
  config: AppConfig;
  imageGenerationModel: string;
};

export function SettingsSummary({
  config,
  imageGenerationModel
}: SettingsSummaryProps): JSX.Element {
  return (
    <div className="settings-summary">
      <Settings size={16} />
      <span>{config.imageGeneration.defaultProvider}</span>
      <span>{imageGenerationModel}</span>
    </div>
  );
}

