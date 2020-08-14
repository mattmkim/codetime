class Leetcode {
    checkSubmission(problem) {
        var id;
        var request = `https://leetcode.com/api/submissions/${problem}/`
        $.get(request, function(response, status) {
            for (var i = 1; i < response.submissions_dump.length; i++) {
                if (response.submissions_dump[i].status_display === "Accepted") {
                    return;
                }
            }

            id = response.submissions_dump[0].id;
            var check = `https://leetcode.com/submissions/detail/${id}/check/`
            var currTime = new Date().getTime();

            var interval = setInterval(function() {
                $.get(check, function(response, status) {
                    if (response.state === "SUCCESS" && response.status_msg === "Accepted") {
                        storage.incrTimeToUse();
                        storage.incrNumQuestionsSolved();
                        clearInterval(interval);
                    } else if (response.state === "SUCCESS" && response.status_msg === "Wrong Answer") {
                        clearInterval(interval);
                    }
                })
                if (new Date().getTime() - currTime > 10000) {
                    clearInterval(interval);
                }
            }, 1000)
        })        
    }
}