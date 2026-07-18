const SUPPORTED_SYSTEMS = {};
const MODULE_ID = "lancer-clock-14";
const LEGACY_MODULE_ID = "lancer-clocks";

const getRawFlag = (actor, scope, key) => {
  return actor.flags?.[scope]?.[key]
    ?? actor._source?.flags?.[scope]?.[key]
    ?? actor.toObject?.()?.flags?.[scope]?.[key];
};

const getModuleFlag = (actor, key) => {
  return actor.getFlag(MODULE_ID, key) ?? getRawFlag(actor, LEGACY_MODULE_ID, key);
};

const defaultLoadClockFromActor = ({ actor }) => {
  return {
    progress: getModuleFlag(actor, "progress"),
    size: getModuleFlag(actor, "size"),
    theme: getModuleFlag(actor, "theme")
  };
};

const defaultPersistClockToActor = async ({ clock }) => {
  return {
    flags: {
      [MODULE_ID]: {
        progress: clock.progress,
        size: clock.size,
        theme: clock.theme
      }
    }
  };
};

const getActorTypes = () => {
  const types = game.system?.documentTypes?.Actor
    ?? game.system?.template?.Actor?.types
    ?? game.data?.system?.template?.Actor?.types
    ?? game.data?.template?.Actor?.types
    ?? game.model?.Actor?.types
    ?? Object.keys(CONFIG.Actor?.dataModels ?? {});
  return Array.isArray(types) ? types : [];
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
			label: "Lancer Clock v14",
			types: getActorTypes()
		  }
		};
  }

  return {
    id,
    ...defaultSystemConfig,
    ...SUPPORTED_SYSTEMS[id]
  };
};
