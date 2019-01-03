/* Magic Mirror
 * Module: MMM-Fracing
 *
 * By cowboysdude
 * 
 */
Module.register("MMM-Fracing", {

    requiresVersion: "2.1.0",

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 4950, // 0 seconds delay
        retryDelay: 1500,
        maxWidth: "100%",
        fadeSpeed: 11,
        rotateInterval: 20 * 1000, //20 seconds
        header: false,
        headerText: "Your text here",
        showStandings: true,
        showLastRace: true,
        showSchedule: true,
        colorBox: true,
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    getStyles: function() {
        return ["MMM-Fracing.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.2",

            // Set locale.
            Rankyear = moment().format('YYYY');
        this.url = "http://ergast.com/api/f1/" + Rankyear + "/driverStandings.json";
        this.racing = {};
        this.today = "";
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    processFracing: function(data) {
        this.racing = data.DriverStandings;
        this.loaded = true;
    },

    processSchedule: function(data) {
        this.schedule = data.Races;
    },

    processLast: function(data) {
        this.last = data.Races[0].Results;
        this.place = data.Races[0].raceName;
        console.log(this.last);
    },

    scheduleCarousel: function() {
        console.log("Scheduling F1 items");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getFracing();
        }, this.config.updateInterval);
        this.getFracing(this.config.initialLoadDelay);
        var self = this;
    },

    getFracing: function() {
        this.sendSocketNotification('GET_FRACING', this.url);
    },

    getOrdinal: function(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FRACING_RESULT") {
            this.processFracing(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
        if (notification === "SCHEDULE_RESULT") {
            this.processSchedule(payload);
        }
        if (notification === "LAST_RESULT") {
            this.processLast(payload);
        }
    },

    getDom: function() {

        var humordiv = document.createElement("div");
        humordiv.classList.add("light", "xsmall");
        humordiv.style.maxWidth = this.config.maxWidth;

        var today = moment().format('M-D-YYYY');
        var wrapper = document.createElement("div");
        wrapper.classList.add("open");
        if (this.config.header == true) {
            var header = document.createElement("header");
            header.classList.add("img");
            header.innerHTML = "<img class=img src=modules/MMM-Fracing/images/f1.png> &nbsp;" + this.config.headerText;
            wrapper.appendChild(header);
        }

        if (!this.loaded) {
            wrapper.classList.add("wrapper", "small");
            wrapper.innerHTML = "<b>Formula 1</b> <BR>Gathering Data...<br> Please be patient..<br><center><img src=modules/MMM-Fracing/images/loading.gif></center>";
            wrapper.className = "bright light small";
            return wrapper;
        }

        if (this.config.showStandings != false) {

            var keys = Object.keys(this.racing);
            if (keys.length > 0) {
                if (this.activeItem >= keys.length) {
                    this.activeItem = 0;
                }
                var racing = this.racing[keys[this.activeItem]];

                var driverRank = document.createElement("div");
                if (this.config.colorBox != false) {
                    driverRank.classList.add("xsmall", "bright", "border");
                } else {
                    driverRank.classList.add("xsmall", "bright", "box");
                }
                driverRank.innerHTML = "F1 Driver Ranking";
                wrapper.appendChild(driverRank);


                var driver = document.createElement("div");
                driver.classList.add("xsmall", "bright");
                driver.innerHTML = "Driver:  " + racing.Driver.givenName + " " + racing.Driver.familyName;;
                wrapper.appendChild(driver);

                var dposition = document.createElement("div");
                dposition.classList.add("xsmall", "bright");
                dposition.innerHTML = "Position [Rank]:  " + racing.position;;
                wrapper.appendChild(dposition);

                var Tpoints = document.createElement("div");
                Tpoints.classList.add("xsmall", "bright");
                Tpoints.innerHTML = "Points:  " + racing.points;
                wrapper.appendChild(Tpoints);

                var playpoints = document.createElement("div");
                playpoints.classList.add("xsmall", "bright");
                playpoints.innerHTML = "Wins:  " + racing.wins;
                wrapper.appendChild(playpoints);

                var playrank = document.createElement("div");
                playrank.classList.add("xsmall", "bright");
                playrank.innerHTML = "Nationality:  " + racing.Driver.nationality;
                wrapper.appendChild(playrank);

                var bonusPTS = document.createElement("div");
                bonusPTS.classList.add("xsmall", "bright");
                bonusPTS.innerHTML = "Car Type " + racing.Constructors.name;
                wrapper.appendChild(bonusPTS);
            }
        }

        if (this.config.showSchedule != false) {

            var keys = Object.keys(this.schedule);
            if (keys.length > 0) {
                if (this.activeItem >= keys.length) {
                    this.activeItem = 0;
                }

                var schedule = this.schedule[keys[this.activeItem]];

                var raceDate = moment().format('YYYY-MM-DD');
                var startdate = moment(schedule.date).format('dddd, M-D-YYYY');
                var year = moment().format('YYYY');

                var dstarts = document.createElement("div");
                if (this.config.colorBox != false) {
                    dstarts.classList.add("xsmall", "bright", "border");
                } else {
                    dstarts.classList.add("xsmall", "bright", "box");
                }
                dstarts.innerHTML = year + " F1 Schedule";
                wrapper.appendChild(dstarts);


                var dwins = document.createElement("div");
                dwins.classList.add("xsmall", "bright");
                dwins.innerHTML = "Round: " + schedule.round;
                wrapper.appendChild(dwins);

                var dtop5 = document.createElement("div");
                dtop5.classList.add("xsmall", "bright");
                if (schedule.date < raceDate) {
                    dtop5.innerHTML = "Start time: " + startdate + "<b><font color=#1ad7e6> FINISHED";
                } else {
                    dtop5.innerHTML = "Start time: " + startdate;
                }
                wrapper.appendChild(dtop5);

                var dtop10 = document.createElement("div");
                dtop10.classList.add("xsmall", "bright");
                dtop10.innerHTML = "Circuit: " + schedule.Circuit.circuitName;
                wrapper.appendChild(dtop10);

                var location = document.createElement("div");
                location.classList.add("xsmall", "bright");
                location.innerHTML = "City: " + schedule.Circuit.Location.locality;
                wrapper.appendChild(location);

                var country = document.createElement("div");
                country.classList.add("xsmall", "bright");
                country.innerHTML = "Country: " + schedule.Circuit.Location.country;
                wrapper.appendChild(country);
            }
        }


        if (this.config.showLastRace != false) {

            var place = this.place;
            var Lastresults = this.last;
            var keys = Object.keys(this.last);
            if (keys.length > 0) {
                if (this.activeItem >= keys.length) {
                    this.activeItem = 0;
                }

                var Lastresults = this.last[keys[this.activeItem]];


                if (Lastresults != null || undefined || " ") {
                    var lastRace = document.createElement("div");
                    if (this.config.colorBox != false) {
                        lastRace.classList.add("xsmall", "bright", "border");
                    } else {
                        lastRace.classList.add("xsmall", "bright", "box");
                    }
                    lastRace.innerHTML = "Last Race Results";
                    wrapper.appendChild(lastRace);

                    var raceLocation = document.createElement("div");
                    raceLocation.classList.add("xsmall", "bright");
                    raceLocation.innerHTML = place;
                    wrapper.appendChild(raceLocation);

                    var raceWinner = document.createElement("div");
                    raceWinner.classList.add("xsmall", "bright");
                    raceWinner.innerHTML = "Driver: " + Lastresults.Driver.givenName + "  " + Lastresults.Driver.familyName;
                    wrapper.appendChild(raceWinner);

                    var raceplace = document.createElement("div");
                    raceplace.classList.add("xsmall", "bright");
                    raceplace.innerHTML = "Finish: " + (this.getOrdinal(Lastresults.position));
                    wrapper.appendChild(raceplace);

                    var Laps = document.createElement("div");
                    Laps.classList.add("xsmall", "bright");
                    Laps.innerHTML = "Laps Completed: " + Lastresults.laps;
                    wrapper.appendChild(Laps);

                    var avgSpeed = document.createElement("div");
                    avgSpeed.classList.add("xsmall", "bright");
                    avgSpeed.innerHTML = "Avg Speed: " + Lastresults.FastestLap.AverageSpeed.speed + " " + Lastresults.FastestLap.AverageSpeed.units;
                    wrapper.appendChild(avgSpeed);

                    var points = document.createElement("div");
                    points.classList.add("xsmall", "bright");
                    points.innerHTML = "Points Gained: " + Lastresults.points;
                    wrapper.appendChild(points);
                }
            }
        }
        return wrapper;
    },

});
