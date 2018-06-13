import * as MEM from "./Mem";
import { CreepWorker } from "./CreepWorker";

export class Builder extends CreepWorker
{
    public static checkForBuildingsRequiringRepairWork(creep : Creep): Structure[]
    {
        let structures : Structure[] = creep.room.find(FIND_STRUCTURES);
        let result : Structure[] = [];

        for(let i = 0; i < structures.length;i++)
        {
            let structure = structures[i];
            let hitsPercentage : number = (structure.hits / structure.hitsMax) * 100;

            if(hitsPercentage < 100)
                result.push(structure);
        }
        return result;
    }

    public static run(creep : Creep) :void
    {
        let memory : MEM.CreepMemory = creep.memory as MEM.CreepMemory;

        let structures : Structure[] = this.checkForBuildingsRequiringRepairWork(creep);
        if(structures.length > 0)
        {
            memory.building = false;

            if(creep.carry.energy < creep.carryCapacity)
            {
                CreepWorker.mine(creep);
            }
            else if(creep.repair(structures[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(structures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('🔨 repair')
            }
        }
        else
        {
            if(memory.building && creep.carry.energy == 0)
            {
                memory.building = false;
                creep.say('🔄 harvest');
            }
            if(!memory.building && creep.carry.energy == creep.carryCapacity)
            {
                memory.building = true;
                creep.say('🔨 building');
            }

            if(memory.building)
            {
                var structuresToBuild = creep.room.find(FIND_CONSTRUCTION_SITES);

                if(creep.build(structuresToBuild[0]) == ERR_NOT_IN_RANGE)
                    creep.moveTo(structuresToBuild[0],{visualizePathStyle: {stroke: '#ffffff'}});
            }
            else
            {
                    var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
            }
        }
    }

}
