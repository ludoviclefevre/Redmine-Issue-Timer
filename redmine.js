var redmineExtended = (function ($, undefined) {
    "use strict"

    var s = 0;
    var input;
    var on = false;
    var timerPlayButton;
    var timerPauseButton;
    var timerClock;
    var input;

    var lpad = function (str, padString, length) {
        while (str.length < length)
            str = padString + str;
        return str;
    };

    var init = function () {
        input = $('#time_entry_hours');
        if (input.length === 0) {
            return;
        }

        var inputValue = input.val();
        if (jQuery.isNumeric(inputValue)) {
            s = parseFloat(inputValue);
            setClockValue();
        }

        timerClock = $('<span id="timer_clock">00:00:00</span>');
        timerPlayButton = $('<a href="javascript:void(0);" id="timer_play_button" class="btn play">Play</a>');
        timerPauseButton = $('<a href="javascript:void(0);" id="timer_pause_button" class="btn pause">Pause</a>');

        var timerContainer = $('<div id="timer_container"/>');
        timerContainer.append(timerClock);
        timerContainer.append(timerPlayButton);
        timerContainer.append(timerPauseButton);

        input.parent().append(timerContainer);

        timerPlayButton.click(timer_play);
        timerPauseButton.click(timer_pause);
    };

    var timer_tic = function () {
        if (on) {
            var t = setTimeout(timer_tac, 1000);
        }
    };

    var setInputValue = function () {
        //decimal
        var numericValue = to_hours(s);
        input.val(numericValue);
    };

    var setClockValue = function () {
        //clock
        var t = s;

        var h = Math.floor(t / 3600).toString();
        t -= (h * 3600);

        var m = Math.floor(t / 60).toString();
        t -= (m * 60);

        var ss = t.toString();

        timerClock.html(lpad(h, '0', 2) + ":" + lpad(m, '0', 2) + ":" + lpad(ss, '0', 2));
    };

    function timer_tac() {
        if (!on) {
            return;
        }

        s += 1;

        setInputValue();

        setClockValue();

        timer_tic();
    }

    function timer_play() {
        if (on) {
            return;
        }
        on = true;
        timer_tic();
    }

    function timer_pause() {
        on = false;
    }

    function to_hours(t) {
        return (t / 3600);
    }

    init();
}(jQuery));
