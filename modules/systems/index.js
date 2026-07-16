const SUPPORTED_SYSTEMS = {
  "":""
};

const defaultLoadClockFromActor = ({ actor }) => {
  return {
    progress: actor.getFlag("lancer-clocks", "progress"),
    size: actor.getFlag("lancer-clocks", "size"),
    theme: actor.getFlag("lancer-clocks", "theme")
  };
};

const defaultPersistClockToActor = async ({ clock }) => {
  return {
    flags: {
      "lancer-clocks": {
        progress: clock.progress,
        size: clock.size,
        theme: clock.theme
      }
    }
  };
};

export const getSystemMapping = (id) => {
  const defaultSystemConfig = {
    loadClockFromActor: defaultLoadClockFromActor,
    persistClockToActor: defaultPersistClockToActor
  };

  if (!SUPPORTED_SYSTEMS[id]) {
		return {
		  id,
		  ...defaultSystemConfig,
		  registerSheetOptions: {
			types: ["npc"] //Fuck it. Hard coding this shit at this point. Needed to jump through so many hoops just in case before, but now I can just go ["npc"]. If the system doesn't have an NPC category for sheets, what the hell is wrong with the developer of it?
		  }
		};
  }

  return {
    id,
    ...defaultSystemConfig,
    ...SUPPORTED_SYSTEMS[id]
  };
};
