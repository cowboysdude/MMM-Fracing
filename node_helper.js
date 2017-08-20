/* Magic Mirror
 * Module: MMM-Fracing
 *
 * By cowboysdude 
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getF1: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).MRData.StandingsTable.StandingsLists[0];
                this.sendSocketNotification('FRACING_RESULT', result);
                this.getSchedule();
            }
        });
    },

    getSchedule: function(url) {
        request({
            url: "http://ergast.com/api/f1/current.json",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).MRData.RaceTable;
                this.sendSocketNotification('SCHEDULE_RESULT', result);
                this.getResults();
            }
        });
    },

    getResults: function(url) {
        request({
            url: "http://ergast.com/api/f1/current/last/results.json",
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).MRData.RaceTable;
                this.sendSocketNotification('LAST_RESULT', result);
            }
        });
    },


    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_FRACING') {
            this.getF1(payload);
            this.getSchedule(payload);
            this.getResults(payload);
        }

    }
});