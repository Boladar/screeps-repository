import { CreepWorker, CreepRoleInterface } from "./CreepWorker";
import * as MEM from "./Mem";

export class Harvester extends CreepWorker implements CreepRoleInterface
{
    public Work():void
    {
        if(this.creep.carry.energy < this.creep.carryCapacity)
        {
            this.Mine();
        }
        else
        {
            let memory = this.creep.memory as MEM.CreepMemory;
            if(memory.mining == true)
            {
                memory.mining = false;
                Memory.sources[memory.workplaceID]  -= 1;
                memory.workplaceID = "";
            }

            var targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
}
