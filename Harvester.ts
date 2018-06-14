import { CreepWorker } from "./CreepWorker";
import * as MEM from "./Mem";

export class Harvester extends CreepWorker
{
    public static run(creep: Creep):void
    {
        if(creep.carry.energy < creep.carryCapacity)
        {
            CreepWorker.mine(creep);
        }
        else
            {
                let memory = creep.memory as MEM.CreepMemory;
                if(memory.mining == true)
                {
                    memory.mining = false;
                    Memory.sources[memory.workplaceID]  -= 1;
                    memory.workplaceID = "";
                }

                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
    }
}
