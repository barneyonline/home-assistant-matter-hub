import { VacuumDeviceFeature } from "@home-assistant-matter-hub/common";
import type { EndpointType } from "@matter/main";
import { RoboticVacuumCleanerDevice } from "@matter/main/devices";
import { testBit } from "../../../utils/test-bit.js";
import { BasicInformationServer } from "../../behaviors/basic-information-server.js";
import { IdentifyServer } from "../../behaviors/identify-server.js";
import { HomeAssistantEntityBehavior } from "../../custom-behaviors/home-assistant-entity-behavior.js";
import { VacuumOnOffServer } from "./behaviors/vacuum-on-off-server.js";
import { VacuumRvcOperationalStateServer } from "./behaviors/vacuum-rvc-operational-state-server.js";
import { VacuumRvcRunModeServer } from "./behaviors/vacuum-rvc-run-mode-server.js";
import { VacuumPowerSourceServer } from "./behaviors/vacuum-power-source-server.js";
import { VacuumRvcCleanModeServer } from "./behaviors/vacuum-rvc-clean-mode-server.js";
import { VacuumCommandsServer } from "./behaviors/vacuum-commands-server.js";

const VacuumEndpointType = RoboticVacuumCleanerDevice.with(
  BasicInformationServer,
  IdentifyServer,
  HomeAssistantEntityBehavior,
  VacuumRvcOperationalStateServer,
  VacuumRvcRunModeServer,
  VacuumPowerSourceServer,
  VacuumRvcCleanModeServer,
  VacuumCommandsServer,
);

export function VacuumDevice(
  homeAssistantEntity: HomeAssistantEntityBehavior.State,
): EndpointType | undefined {
  if (homeAssistantEntity.entity.state === undefined) {
    return undefined;
  }

  const attributes = homeAssistantEntity.entity.state.attributes as any;
  const supportedFeatures = attributes.supported_features ?? 0;
  let device = VacuumEndpointType.set({ homeAssistantEntity });
  if (attributes.battery_level != null || testBit(supportedFeatures, VacuumDeviceFeature.BATTERY)) {
    device = device.with(VacuumPowerSourceServer);
  }
  if (testBit(supportedFeatures, VacuumDeviceFeature.FAN_SPEED)) {
    device = device.with(VacuumRvcCleanModeServer);
  }
  if (
    testBit(supportedFeatures, VacuumDeviceFeature.CLEAN_SPOT) ||
    testBit(supportedFeatures, VacuumDeviceFeature.LOCATE)
  ) {
    device = device.with(VacuumCommandsServer);
  }
  if (testBit(supportedFeatures, VacuumDeviceFeature.START)) {
    device = device.with(VacuumOnOffServer);
  }
  return device;
}
