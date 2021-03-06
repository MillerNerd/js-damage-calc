$(function() {

    // Submit post on submit
    $('#rangedForm').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        $('#roll-div').empty();
        getStatVars();
        calc_hit();
    });

    $('#saveForm').on('submit', function(event){
        event.preventDefault();
        var saveName = $("#saveNameField").val();
        getStatVars();
        writeSaveData(saveName);
    });

    $('#loadForm').on('submit', function(event){
        event.preventDefault();
        var loadName = $("#loadSelector").val();
        loadSaveData(loadName);
    });

    function aceableRoll(skillLevel) {
        var result = 0,
            roll = skillLevel;
        $('#roll-div').show();
        while (roll == skillLevel) {
            roll = 1 + Math.floor(Math.random() * skillLevel);
            result = result + roll;
            if (roll == skillLevel) {
                $("#roll-div").append("<p>You aced it with a " + roll + "!</p>");
            } else {
                $("#roll-div").append("<p>You rolled a " + roll + ".</p>");
            }
        }
        return result;
    }

    function standardRoll(skillLevel) {
        var result = 1 + Math.floor(Math.random() * skillLevel);
        $("#roll-div").append("<p>You rolled a " + roll + ".</p>");
        return result;
    }

    function getStatVars() {
        shootingSkill = parseInt($('#shootingSkill').val());
        shootingRange = parseInt($('#shootingRange').val());
        cover = parseInt($('#cover').val());
        specialized = parseInt($("input[name=specialized]:checked").val());
        mods = parseInt($('#mods').val());
    }

    function calc_hit() {
        console.log("submit is working!") // sanity check
        var rollResult = aceableRoll(shootingSkill);
        console.log("rollResult is " + rollResult) // sanity check

        var result = rollResult - shootingRange - cover - specialized + mods
        console.log("result is " + result) // sanity check

        $('#rollResult').text(rollResult);
        $('#result').text(result);
        if (result < 4) {
            $('#statement').text("Failure!!")
            $('#statement').css('color', 'red');
        } else {
            $('#statement').text("Success!!")
            $('#statement').css('color', 'green');
        }
        $('#result-div').show();
        console.log("success"); // another sanity check
    };


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
