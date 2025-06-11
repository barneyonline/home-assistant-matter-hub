import type { HomeAssistantEntityInformation } from "@home-assistant-matter-hub/common";
import { RvcCleanModeServer as Base } from "@matter/main/behaviors";
import { ModeBase } from "@matter/main/clusters";
import { applyPatchState } from "../../utils/apply-patch-state.js";
import { HomeAssistantEntityBehavior } from "../custom-behaviors/home-assistant-entity-behavior.js";
import type { ValueGetter, ValueSetter } from "./utils/cluster-config.js";

export interface RvcCleanModeServerConfig {
  getCurrentMode: ValueGetter<number>;
  getSupportedModes: ValueGetter<ModeBase.ModeOption[]>;

  changeMode: ValueSetter<number>;
}

class RvcCleanModeServerBase extends Base {
  declare state: RvcCleanModeServerBase.State;

  override async initialize() {
    const ha = await this.agent.load(HomeAssistantEntityBehavior);
    this.update(ha.entity);
    this.reactTo(ha.onChange, this.update);
    await super.initialize();
  }

  private update(entity: HomeAssistantEntityInformation) {
    applyPatchState(this.state, {
      currentMode: this.state.config.getCurrentMode(entity.state, this.agent),
      supportedModes: this.state.config.getSupportedModes(entity.state, this.agent),
    });
  }

  override async changeToMode(request: ModeBase.ChangeToModeRequest): Promise<ModeBase.ChangeToModeResponse> {
    const ha = this.agent.get(HomeAssistantEntityBehavior);
    await ha.callAction(this.state.config.changeMode(request.newMode, this.agent));
    return { status: ModeBase.ModeChangeStatus.Success, statusText: "Changed" };
  }
}

namespace RvcCleanModeServerBase {
  export class State extends Base.State {
    config!: RvcCleanModeServerConfig;
  }
}

export function RvcCleanModeServer(config: RvcCleanModeServerConfig) {
  return RvcCleanModeServerBase.set({ config });
}
