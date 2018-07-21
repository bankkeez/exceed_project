let lineY = 0;
let lineX = 1;
let adver = 0;
let count = 1;
let countBuzzer = 0;
let startTime = 0;
let timer = false;
let startBuzzer = [];
let responseBuzzer = '0';
var recognition = new webkitSpeechRecognition()
let speech = ""
var forcestop = false
var chart;
var i;


window.onload = function () {

    var seconds = 00;
    var tens = 00;
    var mins = 00;
    var appendMins = document.getElementById("mins");
    var appendTens = document.getElementById("tens");
    var appendSeconds = document.getElementById("seconds");
    var buttonStart = document.getElementById('button-start');
    var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');
    var Interval;
    createChart();

    buttonStart.onclick = function () {

        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
        timer = true;

        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.lang = "en-US";
            recognition.lang = "th-TH"
            recognition.start();

            recognition.onresult = function (e) {
                // console.log("onresult")
                // console.log(e)
                speech = speech + e.results[0][0].transcript
                // console.log(speech)

            };

            recognition.onend = function (e) {
                // console.log("onend")
                // console.log(e)
                if (forcestop) {
                    forcestop = false
                    $("#transcript").val(speech);
                } else {
                    recognition.start();
                }
            }

            recognition.onerror = function (e) {
                // console.log("on error")
                // console.log(e)
            }

        } else {
            alert("Must upgrade browser.")
        }

    }

    buttonStop.onclick = function () {

        clearInterval(Interval);
        timer = false;

        // console.log("stop")
        forcestop = true
        recognition.stop();
    }


    buttonReset.onclick = function () {
        clearInterval(Interval);
        speech = ""
        tens = "00";
        seconds = "00";
        mins = "00";
        appendTens.innerHTML = tens;
        appendSeconds.innerHTML = seconds;
        appendMins.innerHTML = mins;
        startBuzzer = [];
        countBuzzer = 0;
        createChart();
        timer = false;
    }



    function startTimer() {
        tens++;

        if (tens < 9) {
            appendTens.innerHTML = "0" + tens;
        }

        if (tens > 9) {
            appendTens.innerHTML = tens;

        }

        if (seconds > 59) {
            // countMins++;
            mins++;
            appendMins.innerHTML = "0" + mins;
            seconds = 0;
            appendSeconds.innerHTML = "0" + seconds;
        }

        if (mins > 9) {
            appendMins.innerHTML = mins;

        }

        if (tens > 99) {
            countBuzzer += 1;
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }

    }


}

//FinishingPopup
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    console.log(speech)
    $("#speechid").html(`${speech}`)
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function createChart() {
    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        axisY: {
            title: "Units Sound",
            valueFormatString: "#,,.",
        },
        data: [{
            yValueFormatString: "#,###",
            xValueFormatString: "YYYY",
            type: "spline",
            dataPoints: []
        }]
    });
}

setInterval(function () {
    // count += 1
    $.ajax({
        type: "GET",
        url: "http://ecourse.cpe.ku.ac.th/exceed/api/wongpalm-Sound_level/view",
        data: "data",
        dataType: "text",
        success: function (response) {

            let a = parseInt(response)
            // console.log(response);
            if (response !== '0' && countBuzzer !== 0) {
                chart.options.data[0].dataPoints.push({ x: countBuzzer, y: a });
                chart.render();
            }
        },
        fall: function (response) {
            console.log(response)
        }
    });




    $.ajax({
        type: "GET",
        url: "http://ecourse.cpe.ku.ac.th/exceed/api/wongpalm-Sound_status/view",
        data: "data",
        dataType: "text",
        success: function (response) {

            if (response !== responseBuzzer && timer === true) {
                startBuzzer.push({ x: startTime, y: countBuzzer + 2 });
                startTime = countBuzzer + 2;
                console.log(startBuzzer);
                responseBuzzer = response;
            }

        }
    });

}, 1000);

