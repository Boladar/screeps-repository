import * as MEM from "./Mem";
import { CreepWorker, CreepRoleInterface } from "./CreepWorker";

export class Upgrader extends CreepWorker implements CreepRoleInterface
{
    public Work():void
    {
        let memory : MEM.CreepMemory = this.creep.memory as MEM.CreepMemory;

        if(memory.upgrading && this.creep.carry.energy == 0) {
            memory.upgrading = false;
            this.creep.say('🔄 harvest');
	    }
	    if(!memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
	        memory.upgrading = true;
	        this.creep.say('⚡ upgrade');
	    }
	    if(memory.upgrading) {

            let a : StructureController | undefined = this.creep.room.controller;
            if (a == undefined)
                return;

            let controller : StructureController = a;

            if(this.creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = this.creep.room.find(FIND_SOURCES);
            if(this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }

    public static run(creep : Creep):void
    {

    }
}
