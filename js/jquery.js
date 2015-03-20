



// Hey what are you doing!?




(function () {
    var _now = new Date()

    if (localStorage.getItem("_end") == null) {
        var _30 = new Date(_now)
            _30.setDate(_now.getDate() + 31)
        localStorage.setItem("_end", _30)
    }

    var _end = new Date(localStorage.getItem("_end"))
    var _day = 1000 * 60 * 60 * 24;
    var distance = _end - _now;
    var daysLeft = Math.floor(distance / _day)

    if (distance < 0) {
        daysLeft = 'EXPIRED!';


        $("main").moveTo(3)





    } else {
        $(".trial p").html(daysLeft + " days of trial remaining.")
    }

    console.log(daysLeft)
}());




// How dare you!!!