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
            window.location = '/canvas';
        } else {
            alert('Invalid inputs! "Name" and "Collaboration Room" should not be empty')
        }
    })
})