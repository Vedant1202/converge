function openDropdown(id) {
    var dropdown = document.getElementById(id);
    dropdown.style.display = 'block';
}
function closeDropdown(id) {
    var dropdown = document.getElementById(id);
    var menu = document.querySelector('.menu-item.with-dropdown');
    menu.addEventListener('mouseout', function (event) {
        if (!menu.contains(event.relatedTarget)) {
            dropdown.style.display = 'none';
        }
    });
}