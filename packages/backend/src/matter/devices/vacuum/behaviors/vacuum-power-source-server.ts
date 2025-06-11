import { PowerSourceServer } from "../../../behaviors/power-source-server.js";
import { HomeAssistantEntityBehavior } from "../../../custom-behaviors/home-assistant-entity-behavior.js";

export const VacuumPowerSourceServer = PowerSourceServer({
  getBatteryPercent: (state) => {
    const level = (state.attributes as any)?.battery_level;
    if (level == null) return null;
    const num = typeof level === "string" ? parseFloat(level) : level;
    return Number.isNaN(num) ? null : num / 100;
  },
});
