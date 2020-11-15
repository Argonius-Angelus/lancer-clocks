import { Clock } from "./clock.js";
import { getSystemMapping } from "./config.js";

export class ClockSheet extends ActorSheet {
  static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["clocks", "sheet", `clocks-system-${game.data.system.id}`, "actor", "npc"],
  	  template: "/modules/clocks/templates/sheet.html",
      width: 350,
      height: 525,
    });
  }

  async _updateObject(event, form) {
    const supportedSystem = getSystemMapping(game.data.system.id);
    if (!supportedSystem) return;

    const sheet = this.object;
    const oldClock = supportedSystem.loadClockFromActor(sheet);

    let newClock = oldClock;
    switch (event.submitter ? event.submitter.name : undefined) {
      case 'minus':
        newClock = newClock.decrement();
        break;
      case 'plus':
        newClock = newClock.increment();
        break;
      case 'reset':
        newClock = new Clock({
          progress: 0,
          size: newClock.size,
          theme: newClock.theme
        });
        break;
    }
    newClock = new Clock({
      progress: newClock.progress,
      size: form.size,
      theme: form.theme
    });

    // update associated tokens
    const tokens = this.actor.getActiveTokens();
    for (const t of tokens) {
      await t.update({
        name: form.name,
        img: newClock.image.img,
        scale: t.data.scale || 1
      });
    }

    // update the Actor
    await supportedSystem.persistClockToActor(sheet, form.name, newClock);
  }
}
