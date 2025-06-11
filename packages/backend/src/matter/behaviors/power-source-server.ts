import type { HomeAssistantEntityInformation } from "@home-assistant-matter-hub/common";
import { PowerSourceServer as Base } from "@matter/main/behaviors";
import { applyPatchState } from "../../utils/apply-patch-state.js";
import { HomeAssistantEntityBehavior } from "../custom-behaviors/home-assistant-entity-behavior.js";
import type { ValueGetter } from "./utils/cluster-config.js";

export interface PowerSourceServerConfig {
  getBatteryPercent: ValueGetter<number | null>;
}

class PowerSourceServerBase extends Base {
  declare state: PowerSourceServerBase.State;

  override async initialize() {
    await super.initialize();
    const ha = await this.agent.load(HomeAssistantEntityBehavior);
    this.update(ha.entity);
    this.reactTo(ha.onChange, this.update);
  }

  private update(entity: HomeAssistantEntityInformation) {
    const percent = this.state.config.getBatteryPercent(entity.state, this.agent);
    applyPatchState(this.state as any, {
      batPercentRemaining: percent == null ? null : Math.round(percent * 2),
    });
  }
}

namespace PowerSourceServerBase {
  export class State extends Base.State {
    config!: PowerSourceServerConfig;
  }
}

export function PowerSourceServer(config: PowerSourceServerConfig) {
  return PowerSourceServerBase.set({ config });
}
