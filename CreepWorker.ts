import * as MEM from "./Mem";

const MIN_LIFE_VALUE_BEFORE_RENEVAL = 700;

export class CreepWorker extends Creep
{
    static PickHarvestingSpot(creep: Creep) : Source | null
    {
        let availableSpotsInRoom : Source[] = creep.room.find(FIND_SOURCES);
        if(availableSpotsInRoom.length == 0)
            return null;

        availableSpotsInRoom = availableSpotsInRoom.filter( (source) => {
            let sourceMemory : MEM.SourceMemory = Memory.sources[source.id] as MEM.SourceMemory;
            if(sourceMemory.activeHarvesters == null || sourceMemory.activeHarvesters == undefined)
                return true;

            return (sourceMemory.activeHarvesters < sourceMemory.creepLimit)
        });

        availableSpotsInRoom.sort((a,b)=>{
            if( creep.room.findPath(creep.pos,a.pos).length < creep.room.findPath(creep.pos,b.pos).length)
                return -1;
            else
                return 1;
        });

        if(availableSpotsInRoom.length == 0)
            return null;


        return availableSpotsInRoom[0];
    }

    public static mine(creep : Creep) : void
    {
        let memory : MEM.CreepMemory = creep.memory as MEM.CreepMemory;
        let availableSpot : Source | null;

        if(memory.workplaceID == "" || memory.workplaceID == undefined)
            availableSpot = this.PickHarvestingSpot(creep);
        else
            availableSpot = Game.getObjectById(memory.workplaceID);

        if(availableSpot == null)
            return;

        console.log(availableSpot.id);
        if(memory.mining == false || memory.mining == undefined)
        {
            memory.mining = true;
            memory.workplaceID = availableSpot.id;

            let srcMem = Memory.sources[availableSpot.id] as MEM.SourceMemory;
            srcMem.activeHarvesters += 1;
        }
        else if(memory.mining == true)
        {
            if(creep.harvest(availableSpot) == ERR_NOT_IN_RANGE) {
                creep.moveTo(availableSpot, {visualizePathStyle: {stroke: '#eeff00'}});
            }
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
