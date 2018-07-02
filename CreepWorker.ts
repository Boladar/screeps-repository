import * as MEM from "./Mem";

const MIN_LIFE_VALUE_BEFORE_RENEVAL = 700;

export interface CreepRoleInterface
{
    Work():void
}

export class CreepWorker
{
    public creep : Creep;
    private memory : MEM.CreepMemory;

    //memory variables
    private _role : string
    get role():string{
        return this._role;
    }
    set role(theRole:string){
        this._role = theRole;
    }

    private _mining : boolean
    get mining():boolean{
        return this._mining;
    }
    set mining(theMining:boolean){
        this._mining = theMining;
    }

    private _upgrading : boolean
    get upgrading():boolean{
        return this._upgrading;
    }
    set upgrading(theUpgrading : boolean){
        this._upgrading = theUpgrading;
    }

    private _buidling : boolean
    get building():boolean{
        return this._buidling;
    }
    set building(theBuilding : boolean){
        this._buidling = theBuilding;
    }

    private _needsRenew : boolean
    get needsRenew():boolean{
        return this._needsRenew;
    }
    set needsRenew(theNeed : boolean){
        this._needsRenew = theNeed;
    }

    private _workplaceID : string
    get workplaceID():string{
        return this._workplaceID;
    }
    set workplaceID(workplaceID : string){
        this._workplaceID = workplaceID;
    }

    public constructor(creep : Creep)
    {
        this.creep = creep;
        this.memory = creep.memory as MEM.CreepMemory;

        this._role = this.memory.role;
        this._mining = this.memory.mining;
        this._upgrading = this.memory.upgrading;
        this._buidling = this.memory.building;
        this._needsRenew = this.memory.needsRenew;
        this._workplaceID = this.memory.workplaceID;
    }

    private PickHarvestingSpot() : Source | null
    {
        let availableSpotsInRoom : Source[] = this.creep.room.find(FIND_SOURCES);
        if(availableSpotsInRoom.length == 0)
            return null;

        availableSpotsInRoom = availableSpotsInRoom.filter( (source) => {
            let sourceMemory : MEM.SourceMemory = Memory.sources[source.id] as MEM.SourceMemory;
            if(sourceMemory.activeHarvesters == null || sourceMemory.activeHarvesters == undefined)
                return true;

            return (sourceMemory.activeHarvesters < sourceMemory.creepLimit)
        });

        availableSpotsInRoom.sort((a,b)=>{
            if( this.creep.room.findPath(this.creep.pos,a.pos).length < this.creep.room.findPath(this.creep.pos,b.pos).length)
                return -1;
            else
                return 1;
        });

        if(availableSpotsInRoom.length == 0)
            return null;


        return availableSpotsInRoom[0];
    }

    protected Mine() : void
    {
        let memory : MEM.CreepMemory = this.creep.memory as MEM.CreepMemory;
        let availableSpot : Source | null;

        if(memory.workplaceID == "" || memory.workplaceID == undefined)
            availableSpot = this.PickHarvestingSpot();
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
            if(this.creep.harvest(availableSpot) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(availableSpot, {visualizePathStyle: {stroke: '#eeff00'}});
                this.creep.say('🔄 harvest');
            }
        }
    }

    private pickRenovationPlaces() : StructureSpawn | null
    {
        var renovationPlaces : StructureSpawn[] = this.creep.room.find(FIND_MY_SPAWNS);
        if(renovationPlaces.length > 0)
        {
            return renovationPlaces[0];
        }
        else
            return null;
    }

    private renew(): void
    {
        var renovationPlace : StructureSpawn | null = this.pickRenovationPlaces();

        if(renovationPlace == null)
        {
            //TODO add some kind of exception
            return;
        }

        if(renovationPlace.renewCreep(this.creep) == ERR_NOT_IN_RANGE)
        {
            this.creep.moveTo(renovationPlace, {visualizePathStyle: {stroke: '#42f835'}});
            this.creep.say("🔋 Renew");
        }
    }

    private checkVitals() : boolean
    {
        let timeLeft : number | undefined = this.creep.ticksToLive;
        let memory : MEM.CreepMemory = this.creep.memory as MEM.CreepMemory;

        if(timeLeft == undefined || timeLeft >= 1400)
        {
            memory.needsRenew = false;
            return true;
        }

        if(timeLeft <= MIN_LIFE_VALUE_BEFORE_RENEVAL || memory.needsRenew)
        {
            memory.needsRenew = true;
            this.renew();
            return false;
        }

        return true;
    }
}
