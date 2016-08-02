var redmineIssueTimer = (function ($, undefined) {
    "use strict";

    var cssPrefix = 'redmine_issue_timer_';
    var roundInputValueTo = 3;
    var elapsedSeconds = 0;
    var input;
    var playButton;
    var pauseButton;
    var clockLabel;
    var timerId;
    var url = window.location.host + window.location.pathname;
    var issueUrlId = url.replace(/(\/|\.|\W)/g, ''); //redmineruissues223
    var storageCounter = 0;//dont want to save every second, only every 15 seconds
    var commitButton;


    var init = function () {
        input = $('#time_entry_hours');
        if (input.length === 0) {
            return;
        }

        commitButton = $('input[name="commit"]');

        createContainer();

        loadValueFromStorage();

        loadValueFromInput();

        setClockValue();

        inputOnchangeAutoSave();

        commitButtonHandler();

        input.attr('autocomplete', 'off');

    };


    var createContainer = function() {
        clockLabel = $('<span id="' + cssPrefix + 'clock">00:00:00</span>');
        playButton = $('<a href="javascript:void(0);" id="' + cssPrefix + 'play_button" class="' + cssPrefix + 'btn play">Play</a>');
        pauseButton = $('<a href="javascript:void(0);" id="' + cssPrefix + 'pause_button" class="' + cssPrefix + 'btn pause">Pause</a>');

        var timerContainer = $('<div id="' + cssPrefix + 'container"/>');
        timerContainer.append(clockLabel);
        timerContainer.append(playButton);
        timerContainer.append(pauseButton);

        input.parent().append(timerContainer);

        bindEvents();
    };

    var bindEvents = function() {
        playButton.click(onPlayButtonClick);
        pauseButton.click(onPauseButtonClick);
    };

    var onPlayButtonClick = function () {
        if (timerId) {
            return;
        }
        startTimer();
    };

    var onPauseButtonClick = function () {
        stopTimer();
    };

    var loadValueFromStorage = function () {
    	if (localStorage[issueUrlId]) {
    		input.val(localStorage[issueUrlId]);
    	}
    };

    var loadValueFromInput = function () {
        var inputValue = input.val();
        if (!$.isNumeric(inputValue)) {
            return;
        }
        var newValue = parseInt(parseFloat(inputValue) * 3600, 10);
        if (elapsedSeconds === newValue) {
            return;
        }
        elapsedSeconds = newValue;
    };

    var setClockValue = function () {
        var formattedValue = secondsToFormattedClockValue(elapsedSeconds);
        clockLabel.html(formattedValue);
    };

    var secondsToFormattedClockValue = function (seconds) {
        var t = parseInt(seconds, 10);

        var h = Math.floor(t / 3600);
        var m = Math.floor((t - (h * 3600)) / 60);
        var ss = t - (h * 3600) - (m * 60);

        return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + ss).slice(-2);
    };

    var startTimer = function () {
        timerId = setInterval(refreshElapsedTimeValue, 1000);
    };

    var stopTimer = function() {
        clearInterval(timerId);
        timerId = null;
    };

    var refreshElapsedTimeValue = function () {
        if (!timerId) {
            return;
        }
        elapsedSeconds += 1;
        setInputValue();
        setClockValue();
    };

    var setInputValue = function () {
        //decimal
        var numericValue = secondsToHours(elapsedSeconds);
        var newVal = numericValue.toFixed(roundInputValueTo);
        input.val(newVal);
        //save to storage every 15 second
        if (storageCounter == 15) {
            localStorage[issueUrlId] = newVal;
            storageCounter = 0;
        }
        storageCounter++;
    };

    var secondsToHours = function (t) {
        return (t / 3600);
    };

    var inputOnchangeAutoSave = function () {
    	input.on('input', function(){
	    	localStorage[issueUrlId] = input.val().replace(',', '.');
	    	loadValueFromInput();
	    	setClockValue();
	    });
    };

    var commitButtonHandler = function () {
        //when commit time value we want to reset time value in input, otherwise
        //we need to manual erase this value
        commitButton.click(function () {
            localStorage[issueUrlId + 'onSave'] = localStorage[issueUrlId];
            //after form submit we must check if value stored in input equal this
            //value we must reset
        });

        if (localStorage[issueUrlId] == localStorage[issueUrlId + 'onSave']) {
            input.val('');
            elapsedSeconds = 0;
            setClockValue();
            localStorage[issueUrlId] = localStorage[issueUrlId + 'onSave'] = 0;
        }
    };
    

    init();
}(jQuery));
