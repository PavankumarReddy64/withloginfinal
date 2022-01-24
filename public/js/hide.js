const showHideContent = function () {
    document.querySelector("#payment1").addEventListener('click', function () {
        document.querySelector("#card").style.display = "block";
        document.querySelector("#cod").style.display = "none";
    });

    document.querySelector("#payment2").addEventListener('click', function () {
        document.querySelector("#card").style.display = "none";
        document.querySelector("#cod").style.display = "block";
    });
}
showHideContent();
