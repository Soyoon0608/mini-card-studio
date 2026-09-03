const imageInput =
    document.getElementById("imageInput");

const previewImage =
    document.getElementById("previewImage");

const previewText =
    document.getElementById("previewText");

const emptyMessage =
    document.getElementById("emptyMessage");

const fileMessage =
    document.getElementById("fileMessage");

const textInput =
    document.getElementById("textInput");

const fontSize =
    document.getElementById("fontSize");

const fontSizeValue =
    document.getElementById("fontSizeValue");

const textColor =
    document.getElementById("textColor");

const resetButton =
    document.getElementById("resetButton");

const downloadButton =
    document.getElementById("downloadButton");

const previewArea =
    document.getElementById("previewArea");

const ratioLabel =
    document.getElementById("ratioLabel");

const positionButtons =
    document.querySelectorAll(
        ".position-buttons button"
    );

const ratioButtons =
    document.querySelectorAll(
        ".ratio-button"
    );


/*
    현재 편집 상태
*/

let currentPosition = "bottom";

let currentRatio = "1:1";

let currentImage = null;


/*
    초기 설정
*/

previewText.textContent =
    textInput.value;

previewText.style.fontSize =
    fontSize.value + "px";

previewText.style.color =
    textColor.value;

setPosition("bottom");

setRatio("1:1");


/*
    이미지 업로드
*/

imageInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {
            return;
        }


        /*
            PNG / JPEG만 허용
        */

        const allowedTypes = [
            "image/png",
            "image/jpeg"
        ];


        if (!allowedTypes.includes(file.type)) {

            fileMessage.textContent =
                "지원하지 않는 파일입니다. PNG 또는 JPEG만 사용할 수 있습니다.";

            this.value = "";

            return;
        }


        /*
            이미지 읽기
        */

        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const image =
                    new Image();


                image.onload =
                    function () {

                        currentImage =
                            image;

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


                image.src =
                    event.target.result;

            };


        reader.onerror =
            function () {

                fileMessage.textContent =
                    "이미지를 읽을 수 없습니다.";

            };


        reader.readAsDataURL(file);

    }
);


/*
    문구 변경
*/

textInput.addEventListener(
    "input",
    function () {

        previewText.textContent =
            this.value;

    }
);


/*
    글자 크기 변경
*/

fontSize.addEventListener(
    "input",
    function () {

        const size =
            Number(this.value);

        previewText.style.fontSize =
            size + "px";

        fontSizeValue.textContent =
            size + "px";

    }
);


/*
    글자 색상 변경
*/

textColor.addEventListener(
    "input",
    function () {

        previewText.style.color =
            this.value;

    }
);


/*
    위치 버튼
*/

positionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const position =
                    this.dataset.position;

                setPosition(position);

            }
        );

    }
);


/*
    화면비 버튼
*/

ratioButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const ratio =
                    this.dataset.ratio;

                setRatio(ratio);

            }
        );

    }
);


/*
    위치 변경
*/

function setPosition(position) {

    currentPosition =
        position;


    previewText.classList.remove(
        "position-top",
        "position-center",
        "position-bottom"
    );


    previewText.classList.add(
        "position-" + position
    );


    positionButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    const selectedButton =
        document.querySelector(
            `[data-position="${position}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }

}


/*
    화면비 변경
*/

function setRatio(ratio) {

    currentRatio =
        ratio;


    previewArea.classList.remove(
        "ratio-1-1",
        "ratio-4-5",
        "ratio-9-16"
    );


    if (ratio === "1:1") {

        previewArea.classList.add(
            "ratio-1-1"
        );

    }

    if (ratio === "4:5") {

        previewArea.classList.add(
            "ratio-4-5"
        );

    }

    if (ratio === "9:16") {

        previewArea.classList.add(
            "ratio-9-16"
        );

    }


    ratioButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    const selectedButton =
        document.querySelector(
            `[data-ratio="${ratio}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }


    ratioLabel.textContent =
        ratio;

}


/*
    PNG 다운로드
*/

downloadButton.addEventListener(
    "click",
    function () {

        if (!currentImage) {

            fileMessage.textContent =
                "먼저 이미지를 선택해주세요.";

            return;

        }


        /*
            저장할 Canvas 크기
        */

        let canvasWidth;
        let canvasHeight;


        if (currentRatio === "1:1") {

            canvasWidth = 1080;
            canvasHeight = 1080;

        } else if (currentRatio === "4:5") {

            canvasWidth = 1080;
            canvasHeight = 1350;

        } else {

            canvasWidth = 1080;
            canvasHeight = 1920;

        }


        const canvas =
            document.createElement("canvas");


        canvas.width =
            canvasWidth;

        canvas.height =
            canvasHeight;


        const ctx =
            canvas.getContext("2d");


        /*
            이미지 그리기
            미리보기와 동일하게
            화면을 꽉 채우고 가운데를 기준으로 잘라낸다.
        */

        drawCoverImage(
            ctx,
            currentImage,
            canvasWidth,
            canvasHeight
        );


        /*
            문구 설정
        */

        const size =
            Number(fontSize.value);


        /*
            미리보기의 글자 크기는
            화면 크기에 맞춰 비례 계산
        */

        const previewWidth =
            previewArea.clientWidth;


        const previewFontSize =
            Number(
                getComputedStyle(
                    previewText
                ).fontSize.replace("px", "")
            );


        const scale =
            canvasWidth / previewWidth;


        const canvasFontSize =
            previewFontSize * scale;


        ctx.font =
            `bold ${canvasFontSize}px Arial, "Noto Sans KR", sans-serif`;

        ctx.fillStyle =
            textColor.value;

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        /*
            그림자
        */

        ctx.shadowColor =
            "rgba(0, 0, 0, 0.8)";

        ctx.shadowBlur = 4;

        ctx.shadowOffsetX = 2;

        ctx.shadowOffsetY = 2;


        /*
            문구 줄바꿈
        */

        const text =
            textInput.value;

        const maxWidth =
            canvasWidth * 0.9;

        const lines =
            wrapText(
                ctx,
                text,
                maxWidth
            );


        const lineHeight =
            canvasFontSize * 1.2;

        const totalHeight =
            lines.length * lineHeight;


        /*
            문구 Y 위치
        */

        let startY;


        if (currentPosition === "top") {

            startY =
                canvasHeight * 0.08;

        } else if (
            currentPosition === "center"
        ) {

            startY =
                canvasHeight / 2 -
                totalHeight / 2;

        } else {

            startY =
                canvasHeight * 0.92 -
                totalHeight;

        }


        /*
            문구 그리기
        */

        lines.forEach(
            function (line, index) {

                const y =
                    startY +
                    index * lineHeight +
                    lineHeight / 2;


                ctx.fillText(
                    line,
                    canvasWidth / 2,
                    y
                );

            }
        );


        /*
            PNG 저장
        */

        canvas.toBlob(
            function (blob) {

                if (!blob) {

                    fileMessage.textContent =
                        "파일 저장에 실패했습니다.";

                    return;

                }


                const url =
                    URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href =
                    url;

                link.download =
                    `card-${currentRatio.replace(":", "x")}.png`;


                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();


                URL.revokeObjectURL(
                    url
                );


                fileMessage.textContent =
                    `${currentRatio} PNG 파일을 저장했습니다.`;

            },
            "image/png"
        );

    }
);


/*
    이미지 Cover 처리
*/

function drawCoverImage(
    ctx,
    image,
    canvasWidth,
    canvasHeight
) {

    const imageRatio =
        image.width / image.height;

    const canvasRatio =
        canvasWidth / canvasHeight;


    let drawWidth;
    let drawHeight;

    let offsetX;
    let offsetY;


    if (imageRatio > canvasRatio) {

        /*
            이미지가 더 넓음
        */

        drawHeight =
            canvasHeight;

        drawWidth =
            drawHeight * imageRatio;

        offsetX =
            (canvasWidth - drawWidth) / 2;

        offsetY = 0;

    } else {

        /*
            이미지가 더 높음
        */

        drawWidth =
            canvasWidth;

        drawHeight =
            drawWidth / imageRatio;

        offsetX = 0;

        offsetY =
            (canvasHeight - drawHeight) / 2;

    }


    ctx.drawImage(
        image,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
    );

}


/*
    문구 줄바꿈
*/

function wrapText(
    ctx,
    text,
    maxWidth
) {

    const words =
        text.split(" ");

    const lines = [];

    let currentLine = "";


    /*
        공백이 없는 한국어 문장도
        적절히 줄바꿈되도록 처리
    */

    if (
        words.length === 1 &&
        ctx.measureText(text).width > maxWidth
    ) {

        let line = "";


        for (
            let i = 0;
            i < text.length;
            i++
        ) {

            const testLine =
                line + text[i];


            if (
                ctx.measureText(
                    testLine
                ).width > maxWidth
            ) {

                lines.push(line);

                line =
                    text[i];

            } else {

                line =
                    testLine;

            }

        }


        if (line) {

            lines.push(line);

        }


        return lines;

    }


    for (
        let i = 0;
        i < words.length;
        i++
    ) {

        const testLine =
            currentLine
                ? currentLine + " " + words[i]
                : words[i];


        const width =
            ctx.measureText(
                testLine
            ).width;


        if (
            width > maxWidth &&
            currentLine
        ) {

            lines.push(
                currentLine
            );

            currentLine =
                words[i];

        } else {

            currentLine =
                testLine;

        }

    }


    if (currentLine) {

        lines.push(
            currentLine
        );

    }


    return lines;

}


/*
    초기화
*/

resetButton.addEventListener(
    "click",
    function () {

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

        setRatio("1:1");


        fileMessage.textContent =
            "편집 설정을 초기화했습니다.";

    }
);
