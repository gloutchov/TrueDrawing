import { useId, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { EffectiveLocale } from "../app/uiPreferences";
import { t } from "../i18n/appI18n";

type Props = {
  title: string;
  icon: ReactNode;
  locale: EffectiveLocale;
  className?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function CollapsiblePanel({ title, icon, locale, className, actions, children }: Props): JSX.Element {
  const [expanded, setExpanded] = useState(true);
  const contentId = useId();

  return (
    <section className={`panel${className ? ` ${className}` : ""}`} aria-label={title} data-expanded={expanded}>
      <div className="panel-header">
        <button
          className="panel-title-button"
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          aria-label={`${t(locale, expanded ? "collapsePanel" : "expandPanel")}: ${title}`}
          onClick={() => setExpanded((value) => !value)}
        >
          {icon}
          <span>{title}</span>
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        {expanded && actions && <div className="panel-actions">{actions}</div>}
      </div>
      <div id={contentId} hidden={!expanded}>{children}</div>
    </section>
  );
}
