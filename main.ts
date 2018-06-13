import { ErrorMapper } from "./utils/ErrorMapper";
import {Harvester} from "./Harvester";
import {Upgrader} from "./Upgrader";
import {Builder} from "./Builder";
import * as MEM from "./Mem";
import { Worker } from "./Worker";
import {RoomManager} from "./RoomManager";
//import {Upgrader} from "./Upgrader";

function MainLoop(){
  //console.log(`Current game tick is ${Game.time}`);

  for(let room in Game.rooms)
  {
    RoomManager.CalculateSourcesLimits(Game.rooms[room]);
  }

  for(let name in Game.creeps)
  {
    let creep : Creep = Game.creeps[name];
    let crmem : MEM.CreepMemory = creep.memory as MEM.CreepMemory;

    if(Worker.checkVitals(creep))
    {
      if(crmem.role == 'Harvester')
        Harvester.run(creep);
      if(crmem.role == 'Upgrader')
        Upgrader.run(creep);
      if(crmem.role == 'Builder')
        Builder.run(creep);
    }
  }

  // Automatically delete memory of missing creeps
  if (Memory.creeps == null)
    return;

  for (const name in Memory.creeps) {

    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}


// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(MainLoop);


//Game.spawns['Home'].spawnCreep([WORK, CARRY, MOVE], 'Worker1', { memory: {role: 'Harvester'}});
