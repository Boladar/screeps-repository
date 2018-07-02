import { CreepRoleInterface } from "./CreepWorker";
import * as MEM from "./Mem";
import { Harvester } from "./Harvester";
import { Builder } from "./Builder";
import { Upgrader } from "./Upgrader";
import { Carrier } from "./Carrier";

export class CreepManager
{
    private static instance : CreepManager;
    public Creeps : CreepRoleInterface[] = [];

    public constructor()
    {
        if(CreepManager.instance)
        {
            throw new Error("there's already and instance of CreepManager!");
        }
        this.GetCreepsFromMemory();
    }

    public ManageCreeps():void
    {
        this.Creeps.forEach(creep => {creep.Work();});
    }

    public GetCreepsFromMemory()
    {
        for(var name in Game.creeps)
        {
            let gameCreep = Game.creeps[name];
            let memory = gameCreep.memory as MEM.CreepMemory;

            if(memory === undefined)
            {
                console.log("memory is undefined");
                memory = {} as MEM.CreepMemory;
            }
            let creep : any;

            if(memory.role == undefined)
                memory.role = "";


            if(memory.role == 'Harvester')
                creep = new Harvester(gameCreep);
            else if(memory.role == "Builder")
                creep = new Builder(gameCreep);
            else if(memory.role == "Upgrader")
                creep = new Upgrader(gameCreep);
            else if(memory.role == "Carrier")
                creep = new Carrier(gameCreep);

            this.Creeps.push(creep);
        }
        console.log("creeps list size:" + this.Creeps.length);
    }

    static getInstance():CreepManager
    {
        if(CreepManager.instance)
            return CreepManager.instance;
        else
            return new CreepManager();
    }
}
