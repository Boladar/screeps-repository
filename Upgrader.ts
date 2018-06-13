import * as MEM from "./Mem";
import { Worker } from "./Worker";

export class Upgrader extends Worker
{
    public static run(creep : Creep):void
    {
        let memory : MEM.CreepMemory = creep.memory as MEM.CreepMemory;

        if(memory.upgrading && creep.carry.energy == 0) {
            memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }
	    if(memory.upgrading) {

            let a : StructureController | undefined = creep.room.controller;
            if (a == undefined)
                return;

            let controller : StructureController = a;

            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}
