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
		localStorage.removeItem("lancer-clocks.extraPaths")
		log("Old settings deleted.")		
  }
  game.settings.register("lancer-clocks","extraPaths",{
		name: 'Extra Lancer Clocks Path',
		hint: 'This is the directory within the data path for custom clocks. This gets created automatically should it not already exist. This is stored on a per-world basis for more reliability.',
		scope: 'world',
		config: true,
		type: String,
		default: tradePath,
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
