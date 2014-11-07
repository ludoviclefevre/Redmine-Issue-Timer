var redmineIssueTimer = (function ($, undefined) {
    "use strict";

    var cssPrefix = 'redmine_time_entry_autofill_';
    var roundInputValueTo = 3;
    var elapsedSeconds = 0;
    var input;
    var playButton;
    var pauseButton;
    var clockLabel;
    var timerId;

    var init = function () {
        input = $('#time_entry_hours');
        if (input.length === 0) {
            return;
        }

        createContainer();

        loadValueFromInput();

        setClockValue();
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

        var formattedValue = leftPadding(h.toString(), '0', 2) + ":" + leftPadding(m.toString(), '0', 2) + ":" + leftPadding(ss.toString(), '0', 2);
        return formattedValue;
    };

    var leftPadding = function (str, padString, length) {
        while (str.length < length) {
            str = padString + str;
        }
        return str;
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
        input.val(numericValue.toFixed(roundInputValueTo));
    };

    var secondsToHours = function (t) {
        return (t / 3600);
    };

    init();
}(jQuery));
