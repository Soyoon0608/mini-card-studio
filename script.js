const imageInput = document.getElementById("imageInput");

const previewImage = document.getElementById("previewImage");

const previewText = document.getElementById("previewText");

const emptyMessage = document.getElementById("emptyMessage");

const fileMessage = document.getElementById("fileMessage");

const textInput = document.getElementById("textInput");

const fontSize = document.getElementById("fontSize");

const fontSizeValue = document.getElementById("fontSizeValue");

const textColor = document.getElementById("textColor");

const resetButton = document.getElementById("resetButton");

const positionButtons =
    document.querySelectorAll(".position-buttons button");


/*
    현재 편집 상태
*/

let currentPosition = "bottom";

let currentImageURL = null;


/*
    초기 문구 설정
*/

previewText.textContent = textInput.value;

previewText.style.fontSize =
    fontSize.value + "px";

previewText.style.color =
    textColor.value;

setPosition("bottom");


/*
    이미지 업로드
*/

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }


    /*
        PNG 또는 JPEG만 허용
    */

    const allowedTypes = [
        "image/png",
        "image/jpeg"
    ];


    if (!allowedTypes.includes(file.type)) {

        fileMessage.textContent =
            "지원하지 않는 파일입니다. PNG 또는 JPEG만 사용할 수 있습니다.";

        /*
            기존 작업을 유지해야 하므로
            미리보기 이미지를 건드리지 않는다.
        */

        this.value = "";

        return;
    }


    /*
        정상 파일
    */

    const reader = new FileReader();


    reader.onload = function (event) {

        /*
            기존 Object URL 정리
        */

        if (currentImageURL) {
            URL.revokeObjectURL(currentImageURL);
        }


        currentImageURL =
            URL.createObjectURL(file);


        previewImage.src =
            event.target.result;


        previewImage.style.display =
            "block";

        emptyMessage.style.display =
            "none";

        previewText.style.display =
            "block";


        fileMessage.textContent =
            "이미지를 불러왔습니다.";

    };


    reader.onerror = function () {

        fileMessage.textContent =
            "이미지를 읽을 수 없습니다.";

    };


    reader.readAsDataURL(file);

});


/*
    문구 변경
*/

textInput.addEventListener("input", function () {

    previewText.textContent =
        this.value;

});


/*
    글자 크기 변경
*/

fontSize.addEventListener("input", function () {

    const size = this.value;

    previewText.style.fontSize =
        size + "px";

    fontSizeValue.textContent =
        size + "px";

});


/*
    글자 색상 변경
*/

textColor.addEventListener("input", function () {

    previewText.style.color =
        this.value;

});


/*
    위치 버튼
*/

positionButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const position =
            this.dataset.position;

        setPosition(position);

    });

});


/*
    위치 변경 함수
*/

function setPosition(position) {

    currentPosition = position;


    previewText.classList.remove(
        "position-top",
        "position-center",
        "position-bottom"
    );


    previewText.classList.add(
        "position-" + position
    );


    /*
        선택된 버튼 표시
    */

    positionButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    const selectedButton =
        document.querySelector(
            `[data-position="${position}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("active");

    }

}


/*
    초기화
*/

resetButton.addEventListener("click", function () {

    textInput.value =
        "오늘도 화이팅!";


    fontSize.value =
        32;


    fontSizeValue.textContent =
        "32px";


    textColor.value =
        "#ffffff";


    previewText.textContent =
        "오늘도 화이팅!";


    previewText.style.fontSize =
        "32px";


    previewText.style.color =
        "#ffffff";


    setPosition("bottom");


    fileMessage.textContent =
        "편집 설정을 초기화했습니다.";

});
