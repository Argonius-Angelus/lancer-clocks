import { Clock } from "./clock.js";
import { getSystemMapping } from "./systems/index.js";
import { foundryGeneration, getSystemId, log, mergeData } from "./util.js";

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

const TEMPLATE_PATH = "modules/lancer-clock-14/templates/sheet.html";
const HAS_APP_V2 = !!foundry.applications?.sheets?.ActorSheetV2 && !!foundry.applications?.api?.HandlebarsApplicationMixin;
const BaseActorSheet = HAS_APP_V2
  ? foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2)
  : globalThis.ActorSheet;

export class ClockSheet extends BaseActorSheet {
  static PARTS = {
    form: {
      template: TEMPLATE_PATH
    }
  };

  static get DEFAULT_OPTIONS() {
    if (!HAS_APP_V2) return super.DEFAULT_OPTIONS;
    const systemId = getSystemId();
    const supportedSystem = getSystemMapping(systemId);
    return mergeData(
      super.DEFAULT_OPTIONS,
      {
        tag: "div",
        classes: ["lancer-clock-14", "sheet", `lancer-clock-14-system-${systemId}`, "actor", "npc"],
        position: {
          width: 375,
          height: 600
        },
        window: {
          resizable: true
        },
        ...supportedSystem.sheetDefaultOptions
      },
      { inplace: false }
    );
  }

  static get defaultOptions() {
    if (HAS_APP_V2) return super.defaultOptions ?? {};
	//log("Default Options.")
    const systemId = getSystemId();
    const supportedSystem = getSystemMapping(systemId);
	  return mergeData(
      super.defaultOptions,
      {
        classes: ["lancer-clock-14", "sheet", `lancer-clock-14-system-${systemId}`, "actor", "npc"],
        template: TEMPLATE_PATH,
        width: 375,
        height: 600,
        ...supportedSystem.sheetDefaultOptions
      },
      { inplace: false }
    );
  }

  static register () {
	//log("Register.")
	//log("Supported System.")
    const supportedSystem = getSystemMapping(getSystemId());
	//log("Actors.")
    const ActorsCollection = foundry.documents?.collections?.Actors ?? globalThis.Actors;
    ActorsCollection.registerSheet(supportedSystem.id, ClockSheet, supportedSystem.registerSheetOptions);
    log("Sheet Registered");
  }

  constructor (...args) {
    super(...args);
    this._system = getSystemMapping(getSystemId());
  }

  get system () {
    return this._system;
  }

  get actor() {
    return super.actor ?? this.document ?? this.object;
  }

  get title() {
    return this.actor?.name ?? super.title;
  }

  _getThemeDictionary(clock) {
    const themes = clock._themes ?? [];
    const paths = clock._themePaths ?? [];
    const themeDict = {};
    themes.forEach((themeItem, index) => {
      themeDict[themeItem] = paths[index];
    });
    if (!themeDict[clock.theme]) {
      themeDict[clock.theme] = "modules/lancer-clock-14/themes/lancer_wallflower_green";
    }
    return { themes, themeDict };
  }

  async _getClockContext(baseContext = {}) {
    const clock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
	await clock.themesPromise;
	//await clock.extraThemesGetter();
	//console.log(clock);
	//console.log(clock._themes)
	
	const { themes: compiledThemes, themeDict } = this._getThemeDictionary(clock);
	//console.log(themeDict);
	
	//console.log(`/${themeDict[compiledThemes[clock.theme]]}/${clock.size}clock_${clock.progress}.png`)
	let sizeDict = {}
	Clock.sizes.forEach((sizeItem) =>{
		sizeDict[sizeItem] = sizeItem
	});
	let themeSelectDict = {}
	compiledThemes.forEach((themeItem) =>{
		themeSelectDict[themeItem] = themeItem
	});
	
	//console.log(sizeDict)
	//console.log(themeSelectDict)
	//console.log(clock.size)
	
    return mergeData(baseContext, {
      actor: this.actor,
      editable: this.isEditable,
      cssClass: this.isEditable ? "editable" : "locked",
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
          sizes: sizeDict,
          themes: themeSelectDict
        }
      }
    }, { inplace: false });
  }

  async getData () {
    return this._getClockContext(super.getData());
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return this._getClockContext(context);
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

  async _onRender(context, options) {
    await super._onRender(context, options);

    const element = this.element?.querySelector ? this.element : this.element?.[0];
    const form = element?.querySelector("form.clock-form");
    if (!form) return;
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      await this._updateFromForm(new FormData(form));
    });

    form.querySelector("button[name=minus]")?.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
      await this.updateClock(oldClock.decrement());
    });

    form.querySelector("button[name=plus]")?.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
      await this.updateClock(oldClock.increment());
    });

    form.querySelector("button[name=reset]")?.addEventListener("click", async (ev) => {
      ev.preventDefault();
      const oldClock = new Clock(this.system.loadClockFromActor({ actor: this.actor }));
      await this.updateClock(new Clock({
        theme: oldClock.theme,
        progress: 0,
        size: oldClock.size
      }));
    });

    form.querySelector("input[name=name]")?.addEventListener("change", async () => this._updateFromForm(new FormData(form)));
    form.querySelector("select[name=size]")?.addEventListener("change", async () => this._updateFromForm(new FormData(form)));
    form.querySelector("select[name=theme]")?.addEventListener("change", async () => this._updateFromForm(new FormData(form)));
  }

  async _updateFromForm(form) {
    const data = form instanceof FormData ? Object.fromEntries(form.entries()) : form;
    const actor = this.actor;
    await actor.update({
      name: data.name
    });

    const oldClock = new Clock(this.system.loadClockFromActor({ actor }));
    let newClock = new Clock({
      progress: oldClock.progress,
      size: data.size,
      theme: data.theme
    });
    await this.updateClock(newClock);
  }

  async _updateObject(_event, form) {
    await this._updateFromForm(form);
  }

  async updateClock(clock) {
    const actor = this.actor;
	
	await clock.themesPromise;
	//await clock.extraThemesPromise;
	
	const { themeDict } = this._getThemeDictionary(clock);
	
    const tokens = actor.getActiveTokens(false, true);
	//console.log(tokens)
	//console.log(clock.theme)
	let isLegacyTokenData = foundryGeneration() <= 11;
    const imagePath = `${themeDict[clock.theme]}/${clock.size}clock_${clock.progress}.png`;
	//console.log(verMajor)
    for (const t of tokens) {
        const tokenDocument = t.document ?? t;
		if (isLegacyTokenData) {
			await tokenDocument.update({
				img: imagePath,
				actorLink: true
			});
		} else {
			await tokenDocument.update({
				"texture.src": imagePath,
				actorLink: true
			});
		}
    }

    // update the Actor
	//console.log("Updating Actor")
	//console.log(verMajor)
	let visualObj = {}
    const persistObj = await this.system.persistClockToActor({ actor, clock });
	if (isLegacyTokenData){
		visualObj = {
			img: imagePath,
			token: {
				img: imagePath,
				...DEFAULT_TOKEN
			}
		};
	} else {
		visualObj = {
			img: imagePath,
			prototypeToken:{
				texture: {
					src: imagePath
				},
				...DEFAULT_TOKEN
			}
		};
	}
	//console.log("Await.")
    await actor.update(mergeData(visualObj, persistObj));
  }
}
