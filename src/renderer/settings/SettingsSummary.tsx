import { Settings } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";
import type { AppConfig } from "../../shared/config/appConfigSchema";

type SettingsSummaryProps = {
  config: AppConfig;
  locale: EffectiveLocale;
  imageGenerationModel: string;
  imageGenerationStyle: string;
};

export function SettingsSummary({
  config,
  locale,
  imageGenerationModel,
  imageGenerationStyle
}: SettingsSummaryProps): JSX.Element {
  return (
    <div className="settings-summary" aria-label={t(locale, "appSettings")}>
      <Settings size={16} />
      <span>{config.imageGeneration.defaultProvider}</span>
      <span>{imageGenerationModel}</span>
      <span>{imageGenerationStyle}</span>
    </div>
  );
}

