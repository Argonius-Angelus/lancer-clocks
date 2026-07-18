import { ClockSheet } from "./sheet.js";
//import Tiles from "./tiles.js";
import { getFilePicker, getSystemId, log } from "./util.js";

Hooks.once("init", () => {
	const systemId = getSystemId();
	log(`Init ${systemId}`);
	ClockSheet.register();
	let tradePath = "";
	if (localStorage.getItem("lancer-clock-14.extraPaths") == null) {
		tradePath = "lancer-clock-14"
		log("No old settings.")
	}  else {
	    	log("Old settings found.")
	    	tradePath = localStorage.getItem("lancer-clock-14.extraPaths")	
	}
  
	game.settings.register("lancer-clock-14","extraPaths",{
		name: 'Extra Lancer Clock v14 Path',
		hint: 'This is the directory within the data path for custom clocks. This gets created automatically should it not already exist. This is stored on a per-world basis for more reliability.',
		scope: 'world',
		config: true,
		type: String,
		default: tradePath,
	});
  
	game.settings.register("lancer-clock-14","baseThemeToggle",{
		name: 'Disable Base Theme Check',
		hint: 'Disable the checking of base themes for faster performance.',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
	});
  
	game.settings.register("lancer-clock-14","extraThemeToggle",{
		name: 'Disable Extra Theme Check',
		hint: 'Disable the checking of extra themes for faster performance. Do not have both this and Disable Base Theme Check enabled at the same time.',
		scope: 'world',
		config: true,
		type: Boolean,
		default: false,
	});
  
	let extraPath = game.settings.get("lancer-clock-14","extraPaths");
	if (!(extraPath.endsWith("/"))) {
			extraPath = extraPath+"/"
	};
	const FilePickerClass = getFilePicker();
	FilePickerClass.browse("data",extraPath).then(Bep => {
		console.log("Foundry VTT | Lancer Clock v14 | Found custom user directory.")}
	).catch(err => {
		FilePickerClass.createDirectory("data",extraPath)
		console.log("Foundry VTT | Lancer Clock v14 | Created custom user directory.")})
		
});

Hooks.once("ready", () => {
    // Module title
    const MODULE_TITLE = game.modules.get("lancer-clock-14").title;
  
    const FALLBACK_MESSAGE_TITLE = "Welcome to Lancer Clock v14";
    const FALLBACK_MESSAGE = `<large>
    <p><strong>Welcome to Lancer Clock v14! The Lancer themed, but system agnostic, Clocks Module!</strong></p>
	<p>For a full tutorial and known issues, please see the <a href="https://github.com/Argonius-Angelus/lancer-clock-14">GitHub</a> for this module.</p>
	</br>
	<p><strong>Quick Tutorial</strong></p>
	<p>In order to create a clock with this module. You must create an <b><u>NPC</u></b> actor and set the sheet type to <b><u>${getSystemId()}.ClockSheet</u></b>. This should allow you to play around with the clock as intended.</p>
	<p>Do note that in order to use this module, you must have the "Use File Browser" permissions to even open the ClockSheet. This is something to be aware of if you plan to give players control over ClockSheets.</p>
	</br>
	<p>New options have been added to the module to improve performance for those hosting games on The Forge or other external hosts. These two options allow you to disable checking for base themes and extra themes.</p>`;
  
    // Settings key used for the "Don't remind me again" setting
    const DONT_REMIND_AGAIN_KEY = "popup-dont-remind-again";
  
    // Dialog code
    game.settings.register("lancer-clock-14", DONT_REMIND_AGAIN_KEY, {
      name: "",
      default: false,
      type: Boolean,
      scope: "world",
      config: false,
    });
    if (game.user.isGM && !game.settings.get("lancer-clock-14", DONT_REMIND_AGAIN_KEY)) {
      const DialogV2 = foundry.applications?.api?.DialogV2;
      if (DialogV2) {
        new DialogV2({
          window: { title: FALLBACK_MESSAGE_TITLE },
          content: FALLBACK_MESSAGE,
          buttons: [{
            action: "dont_remind",
            icon: "fa-solid fa-times",
            label: "Don't remind me again",
            callback: () => game.settings.set("lancer-clock-14", DONT_REMIND_AGAIN_KEY, true),
            default: true
          }]
        }).render({ force: true });
      } else {
        new Dialog({
          title: FALLBACK_MESSAGE_TITLE,
          content: FALLBACK_MESSAGE,
          buttons: {
              dont_remind: {
                  icon: '<i class="fas fa-times"></i>',
                  label: "Don't remind me again",
                  callback: () => game.settings.set("lancer-clock-14", DONT_REMIND_AGAIN_KEY, true),
              },
          },
          default: "dont_remind",
        }).render(true);
      }
    }
  });
