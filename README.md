## MMM-Fracing

* **Formula 1** racing module for MagicMirror2.

* Now you can get 1, 2 or 3 bits of info for the Formula 1 racing circuit!!

## Examples

![](images/Capture.PNG), ![](images/boxborder.png)

![](images/center.png), ![](images/header.png)

## Installation

* `git clone https://github.com/cowboysdude/MMM-Fracing` into the `~/MagicMirror/modules` directory.

## Installation caveat

* Try running it WITHOUT running npm install.

* If it doesn't load run `npm install` in the `~MagicMirror/modules/MMM-Fracing` directory.

## Config.js entry and options

    {
        module: 'MMM-Fracing',
        position: 'top_left',
        config: {
            rotateInterval: 20 * 1000,  // every 20 seconds
            header: false,              // Use header true or false
            headerText: "F1 Racing ",   // header should be true to use this
            showStandings: true,        // Show F1 Points Standings
            showSchedule: true,         // Show F1 Racing Schedule
            showLastRace: true          // Show the last race results
            colorBox: true              // Show titles in green boxes with white text or using colorBox white boxes with black text
        }
    },
	

