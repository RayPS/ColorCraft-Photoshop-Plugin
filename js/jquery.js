



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

        $("main").moveTo(3)
        $(".onepage-pagination").remove()
        $(".trial p").html("Trial Expired")

    } else {
        $(".trial p").html(daysLeft + " days of trial remaining.")
    }

}());




// How dare you!!!