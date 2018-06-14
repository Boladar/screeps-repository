import * as MEM from "./Mem";
import { CreepWorker, CreepRoleInterface} from "./CreepWorker";

export class Builder extends CreepWorker implements CreepRoleInterface
{
    private checkForBuildingsRequiringRepairWork(): Structure[]
    {
        let structures : Structure[] = this.creep.room.find(FIND_STRUCTURES);
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

    public Work() :void
    {
        let structures : Structure[] = this.checkForBuildingsRequiringRepairWork();
        if(structures.length > 0)
        {
            this.building = false;

            if(this.creep.carry.energy == 0)
            {
                this.Mine();
            }
            else if(this.creep.repair(structures[0]) == ERR_NOT_IN_RANGE)
            {
                this.creep.moveTo(structures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                this.creep.say('🔨 repair')
            }
        }
        else
        {
            if(this.building && this.creep.carry.energy == 0)
            {
                this.building = false;
                this.creep.say('🔄 harvest');
            }
            if(!this.building && this.creep.carry.energy == this.creep.carryCapacity)
            {
                this.building = true;
                this.creep.say('🔨 build');
            }

            if(this.building)
            {
                var structuresToBuild = this.creep.room.find(FIND_CONSTRUCTION_SITES);

                if(this.creep.build(structuresToBuild[0]) == ERR_NOT_IN_RANGE)
                    this.creep.moveTo(structuresToBuild[0],{visualizePathStyle: {stroke: '#ffffff'}});
            }
            else
            {
                this.Mine();
            }
        }
    }

}
