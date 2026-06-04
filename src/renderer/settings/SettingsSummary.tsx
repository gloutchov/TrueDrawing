import { Settings } from "lucide-react";

import type { AppConfig } from "../../shared/config/appConfigSchema";

type SettingsSummaryProps = {
  config: AppConfig;
};

export function SettingsSummary({ config }: SettingsSummaryProps): JSX.Element {
  return (
    <div className="settings-summary">
      <Settings size={16} />
      <span>{config.imageGeneration.defaultProvider}</span>
      <span>{config.imageGeneration.defaultModel}</span>
    </div>
  );
}

