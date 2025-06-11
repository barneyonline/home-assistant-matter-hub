import { VacuumCommandsServer as Base } from "../../../behaviors/vacuum-commands-server.js";

export const VacuumCommandsServer = Base({
  cleanSpot: () => ({ action: "vacuum.clean_spot" }),
  locate: () => ({ action: "vacuum.locate" }),
});
