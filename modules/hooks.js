import { ClockSheet } from "./sheet.js";
//import Tiles from "./tiles.js";
import { log } from "./util.js";

Hooks.once("init", () => {
	log(`Init ${game.data.system.id}`);
	ClockSheet.register();
	let tradePath = "";
	if (localStorage.getItem("lancer-clocks.extraPaths") == null) {
		tradePath = "lancer-clocks"
		log("No old settings.")
	}  else {
	    	log("Old settings found.")
	    	tradePath = localStorage.getItem("lancer-clocks.extraPaths")	
	}
  
	game.settings.register("lancer-clocks","extraPaths",{
		name: 'Extra Lancer Clocks Path',
		hint: 'This is the directory within the data path for custom clocks. This gets created automatically should it not already exist. This is stored on a per-world basis for more reliability.',
		scope: 'world',
		config: true,
		type: String,
		default: tradePath,
	});
  
	game.settings.register("lancer-clocks","baseThemeToggle",{
		name: 'Disable Base Theme Check',
		hint: 'Disable the checking of base themes for faster performance.',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
	});
  
	game.settings.register("lancer-clocks","extraThemeToggle",{
		name: 'Disable Extra Theme Check',
		hint: 'Disable the checking of extra themes for faster performance. Do not have both this and Disable Base Theme Check enabled at the same time.',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
	});
  
	let extraPath = game.settings.get("lancer-clocks","extraPaths");
	if (!(extraPath.endsWith("/"))) {
			extraPath = extraPath+"/"
	};
	let pathPromise = FilePicker.browse("data",extraPath).then(Bep => {
		console.log("Foundry VTT | Lancer Clocks | Found custom user directory.")}
	).catch(err => {
		FilePicker.createDirectory("data",extraPath)
		console.log("Foundry VTT | Lancer Clocks | Created custom user directory.")})
		
});

Hooks.once("ready", () => {
    // Module title
    const MODULE_TITLE = game.modules.get("lancer-clocks").title;
  
    const FALLBACK_MESSAGE_TITLE = "Welcome to Lancer Clocks";
    const FALLBACK_MESSAGE = `<large>
    <p><strong>Welcome to Lancer Clocks! The Lancer themed, but system agnostic, Clocks Module!</strong></p>
	<p>For a full tutorial and known issues, please see the <a href="https://github.com/Argonius-Angelus/lancer-clocks">GitHub</a> for this module.</p>
	</br>
	<p><strong>Quick Tutorial</strong></p>
	<p>In order to create a clock with this module. You must create an <b><u>NPC</u></b> actor and set the sheet type to <b><u>${game.data.system.id}.ClockSheet</u></b>. This should allow you to play around with the clock as intended.</p>
	<p>Do note that in order to use this module, you must have the "Use File Browser" permissions to even open the ClockSheet. This is something to be aware of if you plan to give players control over ClockSheets.</p>`;
  
    // Settings key used for the "Don't remind me again" setting
    const DONT_REMIND_AGAIN_KEY = "popup-dont-remind-again";
  
    // Dialog code
    game.settings.register("lancer-clocks", DONT_REMIND_AGAIN_KEY, {
      name: "",
      default: false,
      type: Boolean,
      scope: "world",
      config: false,
    });
    if (game.user.isGM && !game.settings.get("lancer-clocks", DONT_REMIND_AGAIN_KEY)) {
      new Dialog({
          title: FALLBACK_MESSAGE_TITLE,
          content: FALLBACK_MESSAGE,
          buttons: {
              dont_remind: {
                  icon: '<i class="fas fa-times"></i>',
                  label: "Don't remind me again",
                  callback: () => game.settings.set("lancer-clocks", DONT_REMIND_AGAIN_KEY, true),
              },
          },
          default: "dont_remind",
      }).render(true);
    }
  });
