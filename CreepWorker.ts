import * as MEM from "./Mem";

const MIN_LIFE_VALUE_BEFORE_RENEVAL = 700;

export class CreepWorker extends Creep
{
    public static mine(creep : Creep) : void
    {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }

    private static pickRenovationPlaces(creep : Creep) : StructureSpawn | null
    {
        var renovationPlaces : StructureSpawn[] = creep.room.find(FIND_MY_SPAWNS);
        if(renovationPlaces.length > 0)
        {
            return renovationPlaces[0];
        }
        else
            return null;
    }

    public static renew(creep : Creep): void
    {
        var renovationPlace : StructureSpawn | null = this.pickRenovationPlaces(creep);

        if(renovationPlace == null)
        {
            //TODO add some kind of exception
            return;
        }

        if(renovationPlace.renewCreep(creep) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(renovationPlace, {visualizePathStyle: {stroke: '#42f835'}});
            creep.say("🔋 Renew");
        }
    }

    public static checkVitals(creep : Creep) : boolean
    {
        let timeLeft : number | undefined = creep.ticksToLive;
        let memory : MEM.CreepMemory = creep.memory as MEM.CreepMemory;

        if(timeLeft == undefined || timeLeft >= 1400)
        {
            memory.needsRenew = false;
            return true;
        }

        if(timeLeft <= MIN_LIFE_VALUE_BEFORE_RENEVAL || memory.needsRenew)
        {
            memory.needsRenew = true;
            this.renew(creep);
            return false;
        }

        return true;
    }
}
