
export class CreepManager
{
    private static instance : CreepManager;

    public constructor()
    {
        if(CreepManager.instance)
        {
            throw new Error("there's already and instance of CreepManager!");
        }
    }

    static getInstance():CreepManager
    {
        if(CreepManager.instance)
            return CreepManager.instance;
        else
            return new CreepManager();
    }
}
