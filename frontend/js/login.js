$(function () {
    $('#submit').click(function() {
        var nameField = $('#name').val()
        var roomField = $('#room').val()

        if (nameField && roomField) {
            var loginData = {
                name: nameField,
                room: roomField,
            }
            window.localStorage.setItem('loginData', JSON.stringify(loginData));
            const firstTimeData = window.localStorage.getItem('convergeFirstTimeData');
            if (firstTimeData && JSON.parse(firstTimeData).convergeFirstTimeUser) {
                window.localStorage.setItem('convergeFirstTimeData', JSON.stringify({convergeFirstTimeUser: false}));
            } else if (firstTimeData && JSON.parse(firstTimeData).convergeFirstTimeUser === false) {
                window.localStorage.setItem('convergeFirstTimeData', JSON.stringify({convergeFirstTimeUser: false}));
            } else {
                window.localStorage.setItem('convergeFirstTimeData', JSON.stringify({convergeFirstTimeUser: true}));
            }
            window.location = '/canvas';
        } else {
            alert('Invalid inputs! "Name" and "Collaboration Room" should not be empty')
        }
    })
})