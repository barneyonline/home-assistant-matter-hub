import { RvcCleanMode } from "@matter/main/clusters";
import { RvcCleanModeServer } from "../../../behaviors/rvc-clean-mode-server.js";
import { HomeAssistantEntityBehavior } from "../../../custom-behaviors/home-assistant-entity-behavior.js";

export const VacuumRvcCleanModeServer = RvcCleanModeServer({
  getCurrentMode: (state) => {
    const list = (state.attributes as any)?.fan_speed_list ?? [];
    const current = (state.attributes as any)?.fan_speed ?? list[0];
    return list.indexOf(current ?? "");
  },
  getSupportedModes: (state) => {
    const list = (state.attributes as any)?.fan_speed_list ?? [];
    return list.map((label: string, idx: number) => ({
      label,
      mode: idx,
      modeTags: [{ value: RvcCleanMode.ModeTag.Vacuum }],
    }));
  },
  changeMode: (mode, agent) => {
    const list =
      (agent.get(HomeAssistantEntityBehavior).entity.state.attributes as any)
        ?.fan_speed_list ?? [];
    return {
      action: "vacuum.set_fan_speed",
      data: { fan_speed: list[mode] },
    };
  },
});
