import { Behavior } from "@matter/main";
import { ClusterId } from "@home-assistant-matter-hub/common";
import { HomeAssistantEntityBehavior } from "../custom-behaviors/home-assistant-entity-behavior.js";
import type { ValueSetter } from "./utils/cluster-config.js";

export interface VacuumCommandsServerConfig {
  cleanSpot: ValueSetter<void>;
  locate: ValueSetter<void>;
}

class VacuumCommandsServerBase extends Behavior {
  static override readonly id = ClusterId.vacuumCommands;
  declare state: VacuumCommandsServerBase.State;

  override async initialize() {
    await this.agent.load(HomeAssistantEntityBehavior);
  }

  async cleanSpot() {
    const ha = this.agent.get(HomeAssistantEntityBehavior);
    await ha.callAction(this.state.config.cleanSpot(void 0, this.agent));
  }

  async locate() {
    const ha = this.agent.get(HomeAssistantEntityBehavior);
    await ha.callAction(this.state.config.locate(void 0, this.agent));
  }
}

namespace VacuumCommandsServerBase {
  export class State extends Behavior.State {
    config!: VacuumCommandsServerConfig;
  }
}

export function VacuumCommandsServer(config: VacuumCommandsServerConfig) {
  return VacuumCommandsServerBase.set({ config });
}
