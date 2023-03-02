# Preface
This is a fork of the original [Blades in the Dark Clocks Module](https://github.com/troygoode/fvtt-clocks) to handle Lancer-focused progress/resource tracking clocks. This allows for any number of themes, so long as the guidelines in "Adding More Themes" are followed.

While it was initially designed to be used for the Lancer system specifically (hence the name and clock styles that come by default), it is actually compatible with every system that has actor sheets due to some modifications to the original code.

If you encounter a bug or want more prompt responses to feature requests, I would personally recommend you try to contact me on either the \#lancer-vtt channel of the Pilot NET discord (Lancer system) or in a relevant channel of the Foundry VTT discord server. "Lancer Clocks" will be in my nickname on both servers.


# Foundry VTT: Clocks

Create [Blades in the Dark](https://bladesinthedark.com/)-esque [progress clocks](https://bladesinthedark.com/progress-clocks) within [Foundry VTT](https://foundryvtt.com/). Supports long-lasting Actor Clocks.

## Installation

Install manually with [this Manifest URL](https://raw.githubusercontent.com/Argonius-Angelus/fvtt-clocks/main/module.json):

```
https://raw.githubusercontent.com/Argonius-Angelus/fvtt-clocks/main/module.json
```
It is also now available in the official Foundry add-on repository.


## Creating Clock NPC Actors
1) Create a new NPC Actor.
2) Open the Actor's sheet.
3) Click the button labelled "Sheet" with a cog next to it.
4) Change the NPC Sheet Type to \<system type\>.ClockSheet.

## Adding More Themes

With update L1.0.8, there is now support for user created themes. To add a theme, you must follow the following guidelines:
1) A config option to select where a user's custom themes are stored can now be found in the module settings under "Lancer Clocks". The default location is "lancer-clocks". This location is in the root layer of the Data directory (at the same level as the "worlds" and "modules" folders). It is within this designated folder that you would put your theme folders.
2) Any spaces or special punctuation in a theme folder needs to be changed to an underscore (\_). While it is possible that a theme with spaces or punctuation could work, replacing them with underscores is the most reliable method. These theme folders must have unique names as well. "lancer_gms_red", "lancer_gms_red_grey", "lancer_wallflower_green" and "lancer_wallflower_green_grey" are reserved for the module itself and cannot be used as custom names.
3) Clocks inside the folder must be labeled as "\[size]clock\_\[progress].png". For example, "12clock_3.png".
4) Should a given clock theme not have sizes 2, 3, 4, 5, 6, 8, 10, or 12, then you must be willing to either use placeholder assets, create more to cover the missing size values (and appropriate progress for each), or be willing to handle the fact that said clock will be a broken image file.

## Known Issues
1) Due to how the module handles custom themes, users require "Use File Browser" permissions to even open the ClockSheet. This is deemed an edge-case scenario as this module is mainly GM-facing in its functions.
2) Custom themes support on Forge is unknown. I cannot confirm nor deny as I do not have the ability to reliably test it. I have heard reports stating it both works and does not work, so Your Mileage May Vary.

## License

This module is available as open source under the terms of the MIT License.

[MIT License](http://www.opensource.org/licenses/mit-license.php)
