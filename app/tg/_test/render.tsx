import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { AppRoot } from "@telegram-apps/telegram-ui/dist/components/Service/AppRoot/AppRoot";

/** TelegramUI components read platform and theme from AppRoot, as in the /tg layout. */
export function renderInApp(ui: ReactElement) {
  return render(ui, { wrapper: AppRoot });
}
