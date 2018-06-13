import * as MEM from "./Mem";

export interface RoomSquare
{
    type : string;
}

export interface RoomSquareTerrain extends RoomSquare
{
    terrain : string;
    x : number;
    y : number;
}

export interface RoomSquareStructure extends RoomSquare
{
    structure : Structure;
}

export class RoomManager
{

    public static CalculateSourcesLimits(room : Room)
    {
        let activeSources : Source[] =  room.find(FIND_SOURCES_ACTIVE);

        for(var i = 0; i < activeSources.length;i++)
        {
            let source : Source = activeSources[i];

            if(Memory.sources[source.id] == undefined)
                Memory.sources[source.id] = {} as MEM.SourceMemory;

            let memory : MEM.SourceMemory = Memory.sources[source.id] as MEM.SourceMemory;
            memory.creepLimit = this.GetSourceCreepLimit(room,source);

            Memory.sources[source.id] = memory;
        }
    }

    private static GetSourceCreepLimit(room : Room,source : Source) : number
    {
        let x : number = source.pos.x;
        let y : number = source.pos.y;

        let terrainArea = room.lookForAtArea(LOOK_TERRAIN,y-1,x-1,y+1,x+1,true) as RoomSquareTerrain[];
        terrainArea = terrainArea.filter( (square) => { return square.terrain != "wall"; });
        return terrainArea.length;
    }
}
