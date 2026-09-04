/*
    ================================
    DOM 요소
    ================================
*/

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
    템플릿 요소
*/

const templateName =
    document.getElementById(
        "templateName"
    );

const saveTemplateButton =
    document.getElementById(
        "saveTemplateButton"
    );

const templateMessage =
    document.getElementById(
        "templateMessage"
    );

const templateList =
    document.getElementById(
        "templateList"
    );


/*
    ================================
    현재 편집 상태
    ================================
*/

let currentPosition =
    "bottom";

let currentRatio =
    "1:1";

let currentImage =
    null;


/*
    현재 수정 중인 템플릿 ID
*/

let editingTemplateId =
    null;


/*
    localStorage 저장 이름
*/

const TEMPLATE_STORAGE_KEY =
    "miniCardStudioTemplates";


/*
    ================================
    초기 설정
    ================================
*/

previewText.textContent =
    textInput.value;

previewText.style.fontSize =
    fontSize.value + "px";

previewText.style.color =
    textColor.value;

setPosition("bottom");

setRatio("1:1");

renderTemplates();


/*
    ================================
    이미지 업로드
    ================================
*/

imageInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/png",
            "image/jpeg"
        ];


        /*
            잘못된 파일을 선택해도
            기존 이미지와 편집 상태는 유지한다.
        */

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            fileMessage.textContent =
                "지원하지 않는 파일입니다. PNG 또는 JPEG만 사용할 수 있습니다.";

            this.value = "";

            return;
        }


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


                image.onerror =
                    function () {

                        fileMessage.textContent =
                            "이미지를 불러올 수 없습니다.";

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
    ================================
    문구 변경
    ================================
*/

textInput.addEventListener(
    "input",
    function () {

        previewText.textContent =
            this.value;

    }
);


/*
    ================================
    글자 크기 변경
    ================================
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
    ================================
    글자 색상 변경
    ================================
*/

textColor.addEventListener(
    "input",
    function () {

        previewText.style.color =
            this.value;

    }
);


/*
    ================================
    위치 버튼
    ================================
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
    ================================
    화면비 버튼
    ================================
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
    ================================
    위치 변경
    ================================
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
    ================================
    화면비 변경
    ================================
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
    ================================
    템플릿 데이터 가져오기
    ================================
*/

function getTemplates() {

    const saved =
        localStorage.getItem(
            TEMPLATE_STORAGE_KEY
        );


    if (!saved) {

        return [];

    }


    try {

        const templates =
            JSON.parse(saved);


        if (
            !Array.isArray(
                templates
            )
        ) {

            return [];

        }


        return templates;

    } catch (error) {

        console.error(
            "템플릿 데이터를 읽을 수 없습니다.",
            error
        );

        return [];

    }

}


/*
    ================================
    템플릿 저장
    ================================
*/

function saveTemplates(
    templates
) {

    localStorage.setItem(
        TEMPLATE_STORAGE_KEY,
        JSON.stringify(templates)
    );

}


/*
    ================================
    안정적인 ID 생성
    ================================
*/

function createTemplateId() {

    return (
        "template-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


/*
    ================================
    현재 편집값 가져오기
    ================================
*/

function getCurrentTemplateData(
    name,
    id
) {

    return {

        id:
            id || createTemplateId(),

        name:
            name,

        text:
            textInput.value,

        fontSize:
            Number(
                fontSize.value
            ),

        textColor:
            textColor.value,

        position:
            currentPosition,

        ratio:
            currentRatio

    };

}


/*
    ================================
    새 템플릿 저장 / 수정
    ================================
*/

saveTemplateButton.addEventListener(
    "click",
    function () {

        const name =
            templateName.value.trim();


        /*
            이름 검사
        */

        if (!name) {

            templateMessage.textContent =
                "템플릿 이름을 입력해주세요.";

            templateName.focus();

            return;

        }


        const templates =
            getTemplates();


        /*
            수정 모드
        */

        if (editingTemplateId) {

            const index =
                templates.findIndex(
                    function (template) {

                        return (
                            template.id ===
                            editingTemplateId
                        );

                    }
                );


            /*
                ID가 실제로 존재할 때만 수정
            */

            if (index !== -1) {

                const existingTemplate =
                    templates[index];


                templates[index] =
                    getCurrentTemplateData(
                        name,
                        existingTemplate.id
                    );


                saveTemplates(
                    templates
                );


                templateMessage.textContent =
                    "템플릿을 수정했습니다.";


                editingTemplateId =
                    null;


                templateName.value =
                    "";


                saveTemplateButton.textContent =
                    "💾 새 템플릿 저장";


                renderTemplates();

                return;

            }


            /*
                ID가 없어졌다면
                안전하게 새 템플릿으로 저장
            */

            editingTemplateId =
                null;

        }


        /*
            새 템플릿 생성
        */

        const newTemplate =
            getCurrentTemplateData(
                name
            );


        templates.push(
            newTemplate
        );


        saveTemplates(
            templates
        );


        templateMessage.textContent =
            "새 템플릿을 저장했습니다.";


        templateName.value =
            "";


        renderTemplates();

    }
);


/*
    ================================
    템플릿 목록 다시 그리기
    ================================
*/

function renderTemplates() {

    const templates =
        getTemplates();


    templateList.innerHTML =
        "";


    /*
        저장된 템플릿이 없는 경우
    */

    if (
        templates.length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "template-empty";


        empty.textContent =
            "저장된 템플릿이 없습니다.";


        templateList.appendChild(
            empty
        );


        return;

    }


    /*
        저장된 템플릿을
        ID 기준으로 다시 그린다.
    */

    templates.forEach(
        function (template) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "template-item";


            /*
                템플릿 이름
            */

            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "template-item-name";


            name.textContent =
                template.name;


            /*
                버튼 영역
            */

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "template-item-actions";


            /*
                불러오기
            */

            const loadButton =
                document.createElement(
                    "button"
                );


            loadButton.type =
                "button";


            loadButton.className =
                "template-load-button";


            loadButton.textContent =
                "불러오기";


            loadButton.addEventListener(
                "click",
                function () {

                    loadTemplate(
                        template.id
                    );

                }
            );


            /*
                수정
            */

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.className =
                "template-edit-button";


            editButton.textContent =
                "수정";


            editButton.addEventListener(
                "click",
                function () {

                    editTemplate(
                        template.id
                    );

                }
            );


            /*
                삭제
            */

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "template-delete-button";


            deleteButton.textContent =
                "삭제";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTemplate(
                        template.id
                    );

                }
            );


            actions.appendChild(
                loadButton
            );


            actions.appendChild(
                editButton
            );


            actions.appendChild(
                deleteButton
            );


            item.appendChild(
                name
            );


            item.appendChild(
                actions
            );


            templateList.appendChild(
                item
            );

        }
    );

}


/*
    ================================
    템플릿 불러오기
    ================================
*/

function loadTemplate(
    templateId
) {

    const templates =
        getTemplates();


    /*
        배열 위치가 아니라
        고유 ID로 찾는다.
    */

    const template =
        templates.find(
            function (item) {

                return (
                    item.id ===
                    templateId
                );

            }
        );


    if (!template) {

        templateMessage.textContent =
            "템플릿을 찾을 수 없습니다.";

        return;

    }


    /*
        저장된 값을
        편집 화면에 적용
    */

    textInput.value =
        template.text;


    previewText.textContent =
        template.text;


    fontSize.value =
        template.fontSize;


    fontSizeValue.textContent =
        template.fontSize +
        "px";


    previewText.style.fontSize =
        template.fontSize +
        "px";


    textColor.value =
        template.textColor;


    previewText.style.color =
        template.textColor;


    setPosition(
        template.position
    );


    setRatio(
        template.ratio
    );


    templateMessage.textContent =
        `"${template.name}" 템플릿을 불러왔습니다.`;

}


/*
    ================================
    템플릿 수정 모드
    ================================
*/

function editTemplate(
    templateId
) {

    const templates =
        getTemplates();


    /*
        ID로 수정할 템플릿 검색
    */

    const template =
        templates.find(
            function (item) {

                return (
                    item.id ===
                    templateId
                );

            }
        );


    if (!template) {

        templateMessage.textContent =
            "수정할 템플릿을 찾을 수 없습니다.";

        return;

    }


    /*
        먼저 템플릿을 편집 화면으로 불러온다.
    */

    loadTemplate(
        templateId
    );


    /*
        수정할 ID를 기억한다.
    */

    editingTemplateId =
        templateId;


    /*
        이름도 수정할 수 있도록
        이름 입력창에 기존 이름을 넣는다.
    */

    templateName.value =
        template.name;


    saveTemplateButton.textContent =
        "✏️ 템플릿 수정 저장";


    templateMessage.textContent =
        `"${template.name}" 템플릿 수정 중입니다.`;



    /*
        이름 입력창으로 이동
    */

    templateName.focus();

}


/*
    ================================
    템플릿 삭제
    ================================
*/

function deleteTemplate(
    templateId
) {

    const templates =
        getTemplates();


    /*
        삭제 대상 확인
    */

    const target =
        templates.find(
            function (template) {

                return (
                    template.id ===
                    templateId
                );

            }
        );


    if (!target) {

        templateMessage.textContent =
            "삭제할 템플릿을 찾을 수 없습니다.";

        return;

    }


    const confirmed =
        confirm(
            `"${target.name}" 템플릿을 삭제하시겠습니까?`
        );


    if (!confirmed) {

        return;

    }


    /*
        ID가 같은 템플릿만 제거한다.
    */

    const updatedTemplates =
        templates.filter(
            function (template) {

                return (
                    template.id !==
                    templateId
                );

            }
        );


    saveTemplates(
        updatedTemplates
    );


    /*
        삭제하려던 템플릿을
        현재 수정 중이었다면
        수정 모드도 종료한다.
    */

    if (
        editingTemplateId ===
        templateId
    ) {

        editingTemplateId =
            null;


        templateName.value =
            "";


        saveTemplateButton.textContent =
            "💾 새 템플릿 저장";

    }


    templateMessage.textContent =
        `"${target.name}" 템플릿을 삭제했습니다.`;


    /*
        저장된 데이터 기준으로
        화면을 다시 그린다.
    */

    renderTemplates();

}


/*
    ================================
    PNG 다운로드
    ================================
*/

downloadButton.addEventListener(
    "click",
    function () {

        if (!currentImage) {

            fileMessage.textContent =
                "먼저 이미지를 선택해주세요.";

            return;

        }


        let canvasWidth;
        let canvasHeight;


        if (
            currentRatio ===
            "1:1"
        ) {

            canvasWidth = 1080;
            canvasHeight = 1080;

        } else if (
            currentRatio ===
            "4:5"
        ) {

            canvasWidth = 1080;
            canvasHeight = 1350;

        } else {

            canvasWidth = 1080;
            canvasHeight = 1920;

        }


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            canvasWidth;


        canvas.height =
            canvasHeight;


        const ctx =
            canvas.getContext(
                "2d"
            );


        drawCoverImage(
            ctx,
            currentImage,
            canvasWidth,
            canvasHeight
        );


        const previewWidth =
            previewArea.clientWidth;


        const previewFontSize =
            Number(
                getComputedStyle(
                    previewText
                )
                    .fontSize
                    .replace(
                        "px",
                        ""
                    )
            );


        const scale =
            previewWidth > 0
                ? canvasWidth /
                    previewWidth
                : 1;


        const canvasFontSize =
            previewFontSize *
            scale;


        ctx.font =
            `bold ${canvasFontSize}px Arial, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif`;


        ctx.fillStyle =
            textColor.value;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.shadowColor =
            "rgba(0, 0, 0, 0.8)";


        ctx.shadowBlur =
            4;


        ctx.shadowOffsetX =
            2;


        ctx.shadowOffsetY =
            2;


        const text =
            textInput.value;


        /*
            빈 문구면
            이미지 자체만 저장
        */

        if (
            text.trim() ===
            ""
        ) {

            saveCanvasAsPNG(
                canvas
            );

            return;

        }


        const maxWidth =
            canvasWidth * 0.9;


        const lines =
            wrapText(
                ctx,
                text,
                maxWidth
            );


        const lineHeight =
            canvasFontSize *
            1.2;


        const totalHeight =
            lines.length *
            lineHeight;


        let startY;


        if (
            currentPosition ===
            "top"
        ) {

            startY =
                canvasHeight *
                0.08;

        } else if (
            currentPosition ===
            "center"
        ) {

            startY =
                canvasHeight /
                    2 -
                totalHeight /
                    2;

        } else {

            startY =
                canvasHeight *
                    0.92 -
                totalHeight;

        }


        lines.forEach(
            function (
                line,
                index
            ) {

                const y =
                    startY +
                    index *
                        lineHeight +
                    lineHeight /
                        2;


                ctx.fillText(
                    line,
                    canvasWidth / 2,
                    y
                );

            }
        );


        saveCanvasAsPNG(
            canvas
        );

    }
);


/*
    ================================
    Canvas PNG 저장
    ================================
*/

function saveCanvasAsPNG(
    canvas
) {

    canvas.toBlob(
        function (blob) {

            if (!blob) {

                fileMessage.textContent =
                    "파일 저장에 실패했습니다.";

                return;

            }


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                `card-${currentRatio.replace(
                    ":",
                    "x"
                )}.png`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            setTimeout(
                function () {

                    URL.revokeObjectURL(
                        url
                    );

                },
                100
            );


            fileMessage.textContent =
                `${currentRatio} PNG 파일을 저장했습니다.`;

        },
        "image/png"
    );

}


/*
    ================================
    이미지 Cover
    ================================
*/

function drawCoverImage(
    ctx,
    image,
    canvasWidth,
    canvasHeight
) {

    const imageRatio =
        image.width /
        image.height;


    const canvasRatio =
        canvasWidth /
        canvasHeight;


    let drawWidth;
    let drawHeight;

    let offsetX;
    let offsetY;


    if (
        imageRatio >
        canvasRatio
    ) {

        drawHeight =
            canvasHeight;


        drawWidth =
            drawHeight *
            imageRatio;


        offsetX =
            (
                canvasWidth -
                drawWidth
            ) / 2;


        offsetY =
            0;

    } else {

        drawWidth =
            canvasWidth;


        drawHeight =
            drawWidth /
            imageRatio;


        offsetX =
            0;


        offsetY =
            (
                canvasHeight -
                drawHeight
            ) / 2;

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
    ================================
    문구 줄바꿈
    ================================
*/

function wrapText(
    ctx,
    text,
    maxWidth
) {

    if (!text) {

        return [""];

    }


    /*
        사용자가 입력한 줄바꿈 유지
    */

    const paragraphs =
        text.split(
            /\r?\n/
        );


    const lines = [];


    paragraphs.forEach(
        function (
            paragraph
        ) {

            /*
                빈 줄도 유지
            */

            if (
                paragraph ===
                ""
            ) {

                lines.push(
                    ""
                );

                return;

            }


            const words =
                paragraph.split(
                    /\s+/
                );


            let currentLine =
                "";


            words.forEach(
                function (
                    word
                ) {

                    if (!word) {
                        return;
                    }


                    const testLine =
                        currentLine
                            ? currentLine +
                                " " +
                                word
                            : word;


                    if (
                        ctx.measureText(
                            testLine
                        ).width >
                            maxWidth
                    ) {

                        if (
                            currentLine
                        ) {

                            lines.push(
                                currentLine
                            );

                            currentLine =
                                "";

                        }


                        /*
                            단어 하나가
                            너무 긴 경우
                        */

                        if (
                            ctx.measureText(
                                word
                            ).width >
                                maxWidth
                        ) {

                            const splitLines =
                                splitLongText(
                                    ctx,
                                    word,
                                    maxWidth
                                );


                            for (
                                let i = 0;
                                i <
                                splitLines.length -
                                    1;
                                i++
                            ) {

                                lines.push(
                                    splitLines[i]
                                );

                            }


                            currentLine =
                                splitLines[
                                    splitLines.length -
                                        1
                                ];

                        } else {

                            currentLine =
                                word;

                        }

                    } else {

                        currentLine =
                            testLine;

                    }

                }
            );


            if (
                currentLine
            ) {

                lines.push(
                    currentLine
                );

            }

        }
    );


    return lines.length
        ? lines
        : [""];
}


/*
    ================================
    긴 문자열 분리
    ================================
*/

function splitLongText(
    ctx,
    text,
    maxWidth
) {

    const lines = [];

    let currentLine =
        "";


    const characters =
        Array.from(
            text
        );


    characters.forEach(
        function (
            character
        ) {

            const testLine =
                currentLine +
                character;


            if (
                ctx.measureText(
                    testLine
                ).width >
                    maxWidth &&
                currentLine
            ) {

                lines.push(
                    currentLine
                );


                currentLine =
                    character;

            } else {

                currentLine =
                    testLine;

            }

        }
    );


    if (
        currentLine
    ) {

        lines.push(
            currentLine
        );

    }


    return lines.length
        ? lines
        : [""];
}


/*
    ================================
    초기화
    ================================
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


        setPosition(
            "bottom"
        );


        setRatio(
            "1:1"
        );


        fileMessage.textContent =
            "편집 설정을 초기화했습니다.";

    }
);
