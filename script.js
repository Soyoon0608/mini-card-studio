/*
    ================================
    카드 5
    JSON 내보내기 / 가져오기
    ================================
*/


const exportTemplateButton =
    document.getElementById(
        "exportTemplateButton"
    );


const importTemplateInput =
    document.getElementById(
        "importTemplateInput"
    );


/*
    ================================
    JSON 내보내기
    ================================
*/

exportTemplateButton.addEventListener(
    "click",
    function () {

        const templates =
            getTemplates();


        /*
            내보낼 데이터 구조
        */

        const exportData = {

            version: 1,

            exportedAt:
                new Date().toISOString(),

            templates:
                templates

        };


        const json =
            JSON.stringify(
                exportData,
                null,
                2
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


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
            "mini-card-studio-templates.json";


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


        templateMessage.textContent =
            `${templates.length}개의 템플릿을 JSON으로 내보냈습니다.`;

    }
);


/*
    ================================
    JSON 가져오기
    ================================
*/

importTemplateInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const jsonText =
                    event.target.result;


                /*
                    중요:
                    여기서는 아직 localStorage를
                    변경하지 않는다.
                */

                let importedData;


                /*
                    1단계
                    JSON 문법 검사
                */

                try {

                    importedData =
                        JSON.parse(
                            jsonText
                        );

                } catch (error) {

                    templateMessage.textContent =
                        "JSON 문법이 올바르지 않습니다. 기존 템플릿은 유지됩니다.";

                    importTemplateInput.value =
                        "";

                    return;

                }


                /*
                    2단계
                    전체 데이터 검증
                */

                const validation =
                    validateImportedData(
                        importedData
                    );


                /*
                    검증 실패
                    → 저장하지 않는다.
                */

                if (
                    !validation.valid
                ) {

                    templateMessage.textContent =
                        validation.message +
                        " 기존 템플릿은 유지됩니다.";

                    importTemplateInput.value =
                        "";

                    return;

                }


                /*
                    3단계
                    여기까지 통과했을 때만
                    기존 데이터와 합친다.
                */

                const existingTemplates =
                    getTemplates();


                const importedTemplates =
                    validation.templates;


                /*
                    ID 충돌 방지
                */

                const existingIds =
                    new Set(
                        existingTemplates.map(
                            function (
                                template
                            ) {

                                return template.id;

                            }
                        )
                    );


                const safeImportedTemplates =
                    importedTemplates.map(
                        function (
                            template
                        ) {

                            let id =
                                template.id;


                            /*
                                기존 ID와 충돌하면
                                새로운 ID 생성
                            */

                            if (
                                existingIds.has(
                                    id
                                )
                            ) {

                                id =
                                    createTemplateId();

                            }


                            existingIds.add(
                                id
                            );


                            return {

                                id:
                                    id,

                                name:
                                    template.name,

                                text:
                                    template.text,

                                fontSize:
                                    template.fontSize,

                                textColor:
                                    template.textColor,

                                position:
                                    template.position,

                                ratio:
                                    template.ratio

                            };

                        }
                    );


                /*
                    4단계
                    모든 검증이 끝난 후
                    localStorage에 저장한다.
                */

                const mergedTemplates =
                    existingTemplates.concat(
                        safeImportedTemplates
                    );


                saveTemplates(
                    mergedTemplates
                );


                /*
                    5단계
                    저장 성공 후에만
                    화면을 다시 그린다.
                */

                renderTemplates();


                templateMessage.textContent =
                    `${safeImportedTemplates.length}개의 템플릿을 가져왔습니다.`;

            };


        reader.onerror =
            function () {

                templateMessage.textContent =
                    "JSON 파일을 읽을 수 없습니다. 기존 템플릿은 유지됩니다.";

                importTemplateInput.value =
                    "";

            };


        reader.readAsText(
            file,
            "UTF-8"
        );

    }
);


/*
    ================================
    가져온 JSON 전체 검증
    ================================
*/

function validateImportedData(
    data
) {

    /*
        JSON 구조 검사
    */

    if (
        !data ||
        typeof data !== "object"
    ) {

        return {

            valid: false,

            message:
                "JSON 데이터 형식이 올바르지 않습니다."

        };

    }


    /*
        templates 배열 검사
    */

    if (
        !Array.isArray(
            data.templates
        )
    ) {

        return {

            valid: false,

            message:
                "templates 항목이 없거나 배열이 아닙니다."

        };

    }


    /*
        빈 배열도 정상적인 JSON으로 인정
    */

    if (
        data.templates.length === 0
    ) {

        return {

            valid: true,

            templates: []

        };

    }


    /*
        모든 템플릿을
        저장하기 전에 전부 검사한다.
    */

    for (
        let i = 0;
        i < data.templates.length;
        i++
    ) {

        const template =
            data.templates[i];


        const result =
            validateTemplate(
                template,
                i
            );


        if (
            !result.valid
        ) {

            return result;

        }

    }


    /*
        ID 중복 검사
    */

    const ids =
        new Set();


    for (
        let i = 0;
        i < data.templates.length;
        i++
    ) {

        const id =
            data.templates[i].id;


        if (
            ids.has(id)
        ) {

            return {

                valid: false,

                message:
                    `템플릿 ID가 중복되었습니다: ${id}`

            };

        }


        ids.add(id);

    }


    return {

        valid: true,

        templates:
            data.templates

    };

}


/*
    ================================
    개별 템플릿 검증
    ================================
*/

function validateTemplate(
    template,
    index
) {

    const number =
        index + 1;


    /*
        객체인지 확인
    */

    if (
        !template ||
        typeof template !==
            "object" ||
        Array.isArray(template)
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 형식이 올바르지 않습니다.`

        };

    }


    /*
        필수 항목 검사
    */

    const requiredFields = [
        "id",
        "name",
        "text",
        "fontSize",
        "textColor",
        "position",
        "ratio"
    ];


    for (
        let i = 0;
        i < requiredFields.length;
        i++
    ) {

        const field =
            requiredFields[i];


        if (
            !Object.prototype.hasOwnProperty.call(
                template,
                field
            )
        ) {

            return {

                valid: false,

                message:
                    `${number}번째 템플릿에 필수 항목 "${field}"가 없습니다.`

            };

        }

    }


    /*
        ID 검사
    */

    if (
        typeof template.id !==
        "string" ||
        template.id.trim() === ""
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 ID가 올바르지 않습니다.`

        };

    }


    /*
        이름 검사
    */

    if (
        typeof template.name !==
            "string" ||
        template.name.trim() === "" ||
        template.name.length > 30
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 이름이 올바르지 않습니다.`

        };

    }


    /*
        문구 검사
    */

    if (
        typeof template.text !==
        "string"
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 문구가 올바르지 않습니다.`

        };

    }


    /*
        현재 입력창과 동일하게
        최대 100자 제한
    */

    if (
        template.text.length >
        100
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 문구가 100자를 초과합니다.`

        };

    }


    /*
        글자 크기
    */

    if (
        typeof template.fontSize !==
            "number" ||
        !Number.isFinite(
            template.fontSize
        ) ||
        template.fontSize < 12 ||
        template.fontSize > 100
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 글자 크기가 올바르지 않습니다.`

        };

    }


    /*
        색상
    */

    if (
        typeof template.textColor !==
        "string" ||
        !/^#[0-9a-fA-F]{6}$/.test(
            template.textColor
        )
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 색상이 올바르지 않습니다.`

        };

    }


    /*
        위치
    */

    const allowedPositions = [
        "top",
        "center",
        "bottom"
    ];


    if (
        !allowedPositions.includes(
            template.position
        )
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 위치 값이 올바르지 않습니다.`

        };

    }


    /*
        화면비
    */

    const allowedRatios = [
        "1:1",
        "4:5",
        "9:16"
    ];


    if (
        !allowedRatios.includes(
            template.ratio
        )
    ) {

        return {

            valid: false,

            message:
                `${number}번째 템플릿의 화면비 값이 올바르지 않습니다.`

        };

    }


    /*
        모든 검사 통과
    */

    return {

        valid: true

    };

}
