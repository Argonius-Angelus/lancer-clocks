import { error } from "./util.js";

const nextIndexInArray = (arr, el) => {
  const idx = arr.indexOf(el);
  return (idx < 0 || idx >= arr.length) ? 0 : idx + 1;
}

export class Clock {
  static get sizes () {
    return [2, 3, 4, 5, 6, 8, 10, 12];
  }

  static get themes () {
    return this._themes
  }

  constructor ({ theme, size, progress } = {}) {
		this.themesPromise = FilePicker.browse("data", "modules/lancer-clocks/themes").then(data => {
		  let tempDirs = data.dirs;
		  let newDirs = [];
		  let newPaths = [];
		  let baseDirCheck = false;
		  tempDirs.forEach((dirItem) => {
		    let newDirItem = dirItem.replace("modules/lancer-clocks/themes/","");
		    if (dirItem.startsWith("modules/lancer-clocks/themes/")) {
				newDirs.push(newDirItem);
				newPaths.push(dirItem);
				//console.log(dirItem)
				baseDirCheck = true;
			}
		  });
		  if (!(baseDirCheck)) {
			  error("Base directory check failed.")
			//throw "Lancer Clock Direrctory Error: No valid directories for base themes."; //Enabling this Breaks Things. Only enable when debugging or developing this area.
		  };
		  
		this._baseThemes = newDirs;
		this._baseThemePaths = tempDirs;
		
		}).catch(err => {
			error(err)
			//ui.notifications.error("The following error occurred when generating the clock themes: "+err) //It now fails more elegantly.
		});
		let extraPath = game.settings.get("lancer-clocks","extraPaths")
		if (!(extraPath.endsWith("/"))) {
			extraPath = extraPath+"/"
		}
		//console.log(extraPath)
		this.extraThemesPromise = FilePicker.browse("data",extraPath).then(data => {
			//console.log(data)
			let tempExtraDirs = data.dirs;
			let newExtraDirs = [];
			let newExtraPaths = [];
			let extraDirCheck = false;
			tempExtraDirs.forEach((extraDirItem) => {
				let newExtraDirItem = extraDirItem.replace(extraPath,"");
				if (extraDirItem.startsWith(extraPath)) {
					newExtraDirs.push(newExtraDirItem);
					newExtraPaths.push(extraDirItem);
					extraDirCheck = true;
				}
			})
			//console.log(tempDirs);
			if (!(extraDirCheck)) {
				//error("Extra directory check failed."); //Will need to figure out a better way of handling a broken directory or a non-existent directory. Right now it'll throw an error if the directory exists but is empty.
				//throw "Lancer Clock Directory Error: No valid directories for extra themes."; //Enabling this Breaks Things. Only enable when debugging or developing this area.
			};
			this._extraThemePaths = newExtraPaths;
			this._extraThemes = newExtraDirs;
			this._themes = (this._baseThemes ?? []).concat(this._extraThemes)
			this._themePaths = (this._baseThemePaths ?? []).concat(this._extraThemePaths)
			if (this._themes?.length < 1) {
				throw("This user doesn't have access to modules/lancer-clocks/themes and there are no custom clocks installed. Please annoy your GM to add custom themes to "+extraPath+".")
			}
		}).catch(err => {
			error(err)
			ui.notifications.error(err)
		});
    const isSupportedSize = size && Clock.sizes.indexOf(parseInt(size)) >= 0;
    this._size = isSupportedSize ? parseInt(size) : Clock.sizes[0];

    const p = (!progress || progress < 0) ? 0 : progress < this._size ? progress : this._size;
    this._progress = p || 0;

    this._theme = theme || this._themes?.[0] || this._extraThemes?.[0] || "lancer_wallflower_green";
	//let testingThemes = FilePicker.browse("data", "modules/lancer-clocks/themes").then(data => {console.log(data)});
	//console.log(testingThemes);
  }

  get theme () {
    return this._theme;
  }

  get size () {
    return this._size;
  }

  get progress () {
    return this._progress;
  }

  get image () {
    return { 
      width: 350,
      height: 350
    };
  }

  get flags () {
    return {
      clocks: {
        theme: this._theme,
        size: this._size,
        progress: this._progress
      }
    };
  }

  cycleSize () {
    return new Clock({
      theme: this.theme,
      size: Clock.sizes[nextIndexInArray(Clock.sizes, this.size)],
      progress: this.progress
    });
  }

  increment () {
    const old = this;
    return new Clock({
      theme: old.theme,
      size: old.size,
      progress: old.progress + 1
    });
  }

  decrement () {
    const old = this;
    return new Clock({
      theme: old.theme,
      size: old.size,
      progress: old.progress - 1
    });
  }

  isEqual (clock) {
    return clock
      && clock._progress === this._progress
      && clock._size === this._size
      && clock._theme === this._theme;
  }

  toString () {
    return `${this._progress}/${this._size} • ${this._theme}`;
  }
}
