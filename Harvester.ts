import { CreepWorker } from "./CreepWorker";

export class Harvester extends CreepWorker
{
    public static run(creep: Creep):void
    {
        if(creep.carry.energy < creep.carryCapacity)
        {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            //console.log(`sources length ${sources.length}`);

            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(sources[0],{visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say("Harvest⛏️");
            }
        }
        else
            {
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
