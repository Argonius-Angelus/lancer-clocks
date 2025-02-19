import { Clock } from "./clock.js";
import { getSystemMapping } from "./systems/index.js";
import { log, warn } from "./util.js";

const DISPLAY_NAME = {
  ALWAYS_FOR_EVERYONE: 50
};
const DISPOSITION = {
  NEUTRAL: 0
};
const DEFAULT_TOKEN = {
  scale: 1,
  actorLink: true
};

export class ClockSheet extends ActorSheet {
  static get defaultOptions() {
	//log("Default Options.")
    const supportedSystem = getSystemMapping(game.data.system.id);
	  return mergeObject(
      super.defaultOptions,
      {
        classes: ["lancer-clocks", "sheet", `lancer-clocks-system-${game.data.system.id}`, "actor", "npc"],
        template: "modules/lancer-clocks/templates/sheet.html",
        width: 375,
        height: 600,
        ...supportedSystem.sheetDefaultOptions
      }
    );
  }

  static register () {
	//log("Register.")
	//log("Supported System.")
    const supportedSystem = getSystemMapping(game.data.system.id);
	//log("Actors.")
    Actors.registerSheet(supportedSystem.id, ClockSheet, supportedSystem.registerSheetOptions);
    log("Sheet Registered");
  }

  constructor (...args) {
    super(...args);
    this._system = getSystemMapping(game.data.system.id);
  }

  get system () {
    return this._system;
  }

  async getData () {
    const clock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
	await clock.themesPromise;
	await clock.extraThemesPromise;
	//console.log(clock);
	//console.log(clock._themes)
	
	let compiledThemes = [];
	compiledThemes.push(...clock._themes);
	//console.log(compiledThemes);
	
	let compiledThemePaths = [];
	compiledThemePaths.push(...clock._themePaths)
	//console.log(compiledThemePaths)
	
	let themeDict = {};
	compiledThemes.forEach((themeItem) =>{
		themeDict[themeItem] = compiledThemePaths[compiledThemes.indexOf(themeItem)]
	});
	//console.log(themeDict);
	
	//console.log(`/${themeDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`)
	
    return mergeObject(super.getData(), {
      clock: {
        progress: clock.progress,
        size: clock.size,
        theme: clock.theme,
        image: {
          url: `${themeDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`,
          width: clock.image.width,
          height: clock.image.height
        },
        settings: {
          sizes: Clock.sizes,
          themes: compiledThemes
        }
      }
    });
  }

  activateListeners (html) {
    super.activateListeners(html);

    html.find("button[name=minus]").click(async (ev) => {
      ev.preventDefault();
      const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
      this.updateClock(oldClock.decrement());
    });

    html.find("button[name=plus]").click(async (ev) => {
      ev.preventDefault();
      const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
      this.updateClock(oldClock.increment());
    });

    html.find("button[name=reset]").click(async (ev) => {
      ev.preventDefault();
      const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
      this.updateClock(new Clock({
        theme: oldClock.theme,
        progress: 0,
        size: oldClock.size
      }));
    });
	
  }

  async _updateObject(_event, form) {
    await this.object.update({
      name: form.name
    });

    const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
    let newClock = new Clock({
      progress: oldClock.progress,
      size: form.size,
      theme: form.theme
    });
    await this.updateClock(newClock);
  }

  async updateClock(clock) {
    const actor = this.actor;
	
	await clock.themesPromise;
	await clock.extraThemesPromise;
	
	let compiledThemes = [];
	compiledThemes.push(...clock._themes,...(clock._extraThemes ?? []));
	//console.log(compiledThemes);
	
	let compiledThemePaths = [];
	compiledThemePaths.push(...clock._themePaths,...(clock._extraThemePaths ?? []))
	//console.log(compiledThemePaths)
	
	let themeDict = {};
	compiledThemes.forEach((themeItem) =>{
		themeDict[themeItem] = compiledThemePaths[compiledThemes.indexOf(themeItem)]
	});
    const tokens = actor.getActiveTokens();
    for (const t of tokens) {
		await t.document.update({
			img: `${themeDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`,
			actorLink: true
		});
    }

    // update the Actor
    const persistObj = await this.system.persistClockToActor({ actor, clock });
    const visualObj = {
      img: `${themeDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`,
      token: {
        img: `${themeDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`,
        ...DEFAULT_TOKEN
      }
    };
    await actor.update(mergeObject(visualObj, persistObj));
  }
}
