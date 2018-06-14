export interface CreepMemory {
  role : string;
  mining : boolean;
  upgrading : boolean;
  building : boolean;
  needsRenew : boolean;
  workplaceID : string;
}

export interface RoomMemory{

}

export interface SourceMemory{
  creepLimit : number;
  activeHarvesters : number;
}
