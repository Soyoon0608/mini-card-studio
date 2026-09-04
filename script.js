/* =========================================================
   DOM
========================================================= */

const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");
const textColor = document.getElementById("textColor");

const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const previewText = document.getElementById("previewText");
const emptyMessage = document.getElementById("emptyMessage");

const downloadButton = document.getElementById("downloadButton");
const resetButton = document.getElementById("resetButton");

const positionButtons = document.querySelectorAll(
  ".position-buttons button"
);

const ratioButtons = document.querySelectorAll(
  ".ratio-button"
);


/* =========================================================
   템플릿 DOM
========================================================= */

const templateName = document.getElementById("templateName");
const saveTemplateButton = document.getElementById(
  "saveTemplateButton"
);

const templateMessage = document.getElementById(
  "templateMessage"
);

const templateList = document.getElementById(
  "templateList"
);

const exportTemplateButton = document.getElementById(
  "exportTemplateButton"
);

const importTemplateInput = document.getElementById(
  "importTemplateInput"
);


/* =========================================================
   상태값
========================================================= */

let currentPosition = "bottom";
let currentRatio = "1:1";

let uploadedImage = null;

let editingTemplateId = null;


/* =========================================================
   이미지 업로드
========================================================= */

imageInput.addEventListener("change", function () {

  const file = this.files[0];

  if (!file) {
    return;
  }

  if (!["image/png", "image/jpeg"].includes(file.type)) {

    alert("PNG 또는 JPEG 이미지만 업로드할 수 있습니다.");

    this.value = "";

    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {

    uploadedImage = event.target.result;

    previewImage.src = uploadedImage;

    previewImage.style.display = "block";

    emptyMessage.style.display = "none";

    updatePreview();
  };

  reader.readAsDataURL(file);
});


/* =========================================================
   문구
========================================================= */

textInput.addEventListener("input", updatePreview);


/* =========================================================
   글자 크기
========================================================= */

fontSize.addEventListener("input", function () {

  fontSizeValue.textContent = fontSize.value;

  updatePreview();
});


/* =========================================================
   글자 색상
========================================================= */

textColor.addEventListener("input", updatePreview);


/* =========================================================
   위치
========================================================= */

positionButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    currentPosition = this.dataset.position;

    positionButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    this.classList.add("active");

    updatePreview();
  });

});


/* =========================================================
   비율
========================================================= */

ratioButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    currentRatio = this.dataset.ratio;

    ratioButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    this.classList.add("active");

    updatePreview();
  });

});


/* =========================================================
   미리보기
========================================================= */

function updatePreview() {

  previewText.textContent = textInput.value;

  previewText.style.fontSize =
    fontSize.value + "px";

  previewText.style.color =
    textColor.value;

  previewText.classList.remove(
    "position-top",
    "position-center",
    "position-bottom"
  );

  previewText.classList.add(
    "position-" + currentPosition
  );

  preview.classList.remove(
    "ratio-1-1",
    "ratio-4-5",
    "ratio-9-16"
  );

  preview.classList.add(
    "ratio-" + currentRatio.replace(":", "-")
  );
}


/* =========================================================
   초기 버튼 상태
========================================================= */

document
  .querySelector('[data-position="bottom"]')
  .classList.add("active");

document
  .querySelector('[data-ratio="1:1"]')
  .classList.add("active");

updatePreview();


/* =========================================================
   초기화
========================================================= */

resetButton.addEventListener("click", function () {

  textInput.value = "";

  fontSize.value = 40;
  fontSizeValue.textContent = "40";

  textColor.value = "#ffffff";

  currentPosition = "bottom";
  currentRatio = "1:1";

  positionButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  ratioButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  document
    .querySelector('[data-position="bottom"]')
    .classList.add("active");

  document
    .querySelector('[data-ratio="1:1"]')
    .classList.add("active");

  imageInput.value = "";

  uploadedImage = null;

  previewImage.src = "";
  previewImage.style.display = "none";

  emptyMessage.style.display = "flex";

  updatePreview();
});


/* =========================================================
   PNG 저장
========================================================= */

downloadButton.addEventListener("click", function () {

  if (!uploadedImage) {
    alert("먼저 이미지를 업로드하세요.");
    return;
  }

  const image = new Image();

  image.onload = function () {

    const width = 1080;
    let height = 1080;

    if (currentRatio === "4:5") {
      height = 1350;
    }

    if (currentRatio === "9:16") {
      height = 1920;
    }

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    /* 이미지 배경 */

    const imageRatio =
      image.width / image.height;

    const canvasRatio =
      width / height;

    let drawWidth;
    let drawHeight;
    let offsetX;
    let offsetY;

    if (imageRatio > canvasRatio) {

      drawHeight = height;

      drawWidth =
        height * imageRatio;

      offsetX =
        (width - drawWidth) / 2;

      offsetY = 0;

    } else {

      drawWidth = width;

      drawHeight =
        width / imageRatio;

      offsetX = 0;

      offsetY =
        (height - drawHeight) / 2;
    }

    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );


    /* 텍스트 */

    const text =
      textInput.value;

    if (text) {

      ctx.fillStyle =
        textColor.value;

      ctx.font =
        `bold ${fontSize.value}px Arial, "Noto Sans KR", sans-serif`;

      ctx.textAlign = "center";

      ctx.textBaseline = "middle";

      ctx.shadowColor =
        "rgba(0,0,0,0.7)";

      ctx.shadowBlur = 6;

      const lines =
        wrapText(
          ctx,
          text,
          width * 0.9
        );

      let startY;

      const lineHeight =
        Number(fontSize.value) * 1.25;

      const totalHeight =
        lines.length * lineHeight;

      if (currentPosition === "top") {

        startY =
          height * 0.08;

      } else if (currentPosition === "center") {

        startY =
          (height - totalHeight) / 2;

      } else {

        startY =
          height * 0.92 - totalHeight;
      }

      lines.forEach(function (line, index) {

        ctx.fillText(
          line,
          width / 2,
          startY +
          index * lineHeight +
          lineHeight / 2
        );

      });
    }


    canvas.toBlob(function (blob) {

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "mini-card.png";

      link.click();

      URL.revokeObjectURL(url);

    }, "image/png");

  };

  image.src = uploadedImage;

});


/* =========================================================
   텍스트 줄바꿈
========================================================= */

function wrapText(ctx, text, maxWidth) {

  const result = [];

  const paragraphs =
    text.split(/\r?\n/);

  paragraphs.forEach(function (paragraph) {

    if (paragraph === "") {
      result.push("");
      return;
    }

    let line = "";

    const characters =
      Array.from(paragraph);

    characters.forEach(function (character) {

      const testLine =
        line + character;

      const width =
        ctx.measureText(testLine).width;

      if (
        width > maxWidth &&
        line !== ""
      ) {

        result.push(line);

        line = character;

      } else {

        line = testLine;
      }

    });

    if (line !== "") {
      result.push(line);
    }

  });

  return result;
}


/* =========================================================
   템플릿 ID
   배열 index를 ID로 사용하지 않음
========================================================= */

function createTemplateId() {

  return (
    "template-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}


/* =========================================================
   템플릿 가져오기
========================================================= */

function getTemplates() {

  const saved =
    localStorage.getItem(
      "miniCardStudioTemplates"
    );

  if (!saved) {
    return [];
  }

  try {

    const templates =
      JSON.parse(saved);

    if (!Array.isArray(templates)) {
      return [];
    }

    return templates;

  } catch (error) {

    return [];
  }
}


/* =========================================================
   템플릿 저장
========================================================= */

function saveTemplates(templates) {

  localStorage.setItem(
    "miniCardStudioTemplates",
    JSON.stringify(templates)
  );
}


/* =========================================================
   템플릿 목록 출력
========================================================= */

function renderTemplates() {

  const templates =
    getTemplates();

  templateList.innerHTML = "";


  if (templates.length === 0) {

    const empty =
      document.createElement("p");

    empty.className =
      "template-empty";

    empty.textContent =
      "저장된 템플릿이 없습니다.";

    templateList.appendChild(empty);

    return;
  }


  templates.forEach(function (template) {

    const item =
      document.createElement("div");

    item.className =
      "template-item";


    const name =
      document.createElement("div");

    name.className =
      "template-item-name";

    name.textContent =
      template.name;


    const actions =
      document.createElement("div");

    actions.className =
      "template-item-actions";


    const loadButton =
      document.createElement("button");

    loadButton.type = "button";

    loadButton.className =
      "template-load-button";

    loadButton.textContent =
      "불러오기";

    loadButton.addEventListener(
      "click",
      function () {
        loadTemplate(template.id);
      }
    );


    const editButton =
      document.createElement("button");

    editButton.type = "button";

    editButton.className =
      "template-edit-button";

    editButton.textContent =
      "수정";

    editButton.addEventListener(
      "click",
      function () {
        editTemplate(template.id);
      }
    );


    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
      "template-delete-button";

    deleteButton.textContent =
      "삭제";

    deleteButton.addEventListener(
      "click",
      function () {
        deleteTemplate(template.id);
      }
    );


    actions.appendChild(loadButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(name);
    item.appendChild(actions);

    templateList.appendChild(item);

  });
}


/* =========================================================
   템플릿 저장 버튼
========================================================= */

saveTemplateButton.addEventListener(
  "click",
  function () {

    const name =
      templateName.value.trim();


    if (!name) {

      templateMessage.textContent =
        "템플릿 이름을 입력하세요.";

      templateName.focus();

      return;
    }


    const templates =
      getTemplates();


    /* 수정 모드 */

    if (editingTemplateId) {

      const target =
        templates.find(function (template) {

          return template.id ===
            editingTemplateId;

        });


      if (target) {

        target.name = name;

        target.text =
          textInput.value;

        target.fontSize =
          Number(fontSize.value);

        target.textColor =
          textColor.value;

        target.position =
          currentPosition;

        target.ratio =
          currentRatio;

        saveTemplates(templates);

        templateMessage.textContent =
          "템플릿이 수정되었습니다.";

        editingTemplateId = null;

        saveTemplateButton.textContent =
          "💾 새 템플릿 저장";

        templateName.value = "";

        renderTemplates();

        return;
      }

    }


    /* 새 템플릿 */

    const newTemplate = {

      id: createTemplateId(),

      name: name,

      text: textInput.value,

      fontSize: Number(fontSize.value),

      textColor: textColor.value,

      position: currentPosition,

      ratio: currentRatio

    };


    templates.push(newTemplate);

    saveTemplates(templates);

    templateMessage.textContent =
      "템플릿이 저장되었습니다.";

    templateName.value = "";

    renderTemplates();

  }
);


/* =========================================================
   템플릿 불러오기
========================================================= */

function loadTemplate(id) {

  const templates =
    getTemplates();

  const template =
    templates.find(function (item) {

      return item.id === id;

    });


  if (!template) {

    templateMessage.textContent =
      "템플릿을 찾을 수 없습니다.";

    return;
  }


  textInput.value =
    template.text;

  fontSize.value =
    template.fontSize;

  fontSizeValue.textContent =
    template.fontSize;

  textColor.value =
    template.textColor;

  currentPosition =
    template.position;

  currentRatio =
    template.ratio;


  positionButtons.forEach(
    function (button) {

      button.classList.toggle(
        "active",
        button.dataset.position ===
          currentPosition
      );

    }
  );


  ratioButtons.forEach(
    function (button) {

      button.classList.toggle(
        "active",
        button.dataset.ratio ===
          currentRatio
      );

    }
  );


  updatePreview();


  templateMessage.textContent =
    `"${template.name}" 템플릿을 불러왔습니다.`;
}


/* =========================================================
   템플릿 수정
========================================================= */

function editTemplate(id) {

  const templates =
    getTemplates();

  const template =
    templates.find(function (item) {

      return item.id === id;

    });


  if (!template) {
    return;
  }


  loadTemplate(id);


  editingTemplateId =
    template.id;

  templateName.value =
    template.name;

  saveTemplateButton.textContent =
    "💾 템플릿 수정 저장";

  templateMessage.textContent =
    `"${template.name}" 템플릿을 수정할 수 있습니다.`;

  templateName.focus();
}


/* =========================================================
   템플릿 삭제
========================================================= */

function deleteTemplate(id) {

  const templates =
    getTemplates();


  const target =
    templates.find(function (template) {

      return template.id === id;

    });


  if (!target) {
    return;
  }


  const confirmed =
    confirm(
      `"${target.name}" 템플릿을 삭제할까요?`
    );


  if (!confirmed) {
    return;
  }


  const newTemplates =
    templates.filter(function (template) {

      return template.id !== id;

    });


  saveTemplates(newTemplates);

  renderTemplates();

  templateMessage.textContent =
    "템플릿이 삭제되었습니다.";
}


/* =========================================================
   JSON 내보내기
========================================================= */

exportTemplateButton.addEventListener(
  "click",
  function () {

    const templates =
      getTemplates();


    const data = {

      version: 1,

      exportedAt:
        new Date().toISOString(),

      templates: templates

    };


    const json =
      JSON.stringify(
        data,
        null,
        2
      );


    const blob =
      new Blob(
        [json],
        {
          type: "application/json"
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "mini-card-studio-templates.json";

    link.click();


    URL.revokeObjectURL(url);


    templateMessage.textContent =
      "템플릿 JSON을 내보냈습니다.";
  }
);


/* =========================================================
   JSON 가져오기
========================================================= */

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

        const json =
          event.target.result;


        let data;


        /* -------------------------
           1. JSON 문법 검사
        ------------------------- */

        try {

          data =
            JSON.parse(json);

        } catch (error) {

          templateMessage.textContent =
            "JSON 문법이 올바르지 않습니다. 기존 템플릿은 유지됩니다.";

          importTemplateInput.value = "";

          return;
        }


        /* -------------------------
           2. 전체 데이터 검증
        ------------------------- */

        const validation =
          validateImportedData(data);


        if (!validation.valid) {

          templateMessage.textContent =
            validation.message +
            " 기존 템플릿은 유지됩니다.";

          importTemplateInput.value = "";

          return;
        }


        /* -------------------------
           3. 기존 데이터 가져오기
        ------------------------- */

        const existingTemplates =
          getTemplates();


        const existingIds =
          new Set(
            existingTemplates.map(
              function (template) {
                return template.id;
              }
            )
          );


        const importedTemplates =
          data.templates.map(
            function (template) {

              const copied = {
                ...template
              };


              /*
               * ID가 기존 데이터와 겹치면
               * 새로운 안정적인 ID 생성
               */

              if (
                existingIds.has(copied.id)
              ) {

                copied.id =
                  createTemplateId();

              }


              existingIds.add(copied.id);

              return copied;

            }
          );


        const mergedTemplates =
          existingTemplates.concat(
            importedTemplates
          );


        /*
         * 모든 검증이 끝난 뒤에만 저장
         */

        saveTemplates(
          mergedTemplates
        );


        renderTemplates();


        templateMessage.textContent =
          `${importedTemplates.length}개의 템플릿을 가져왔습니다.`;

        importTemplateInput.value = "";

      };


    reader.readAsText(
      file,
      "UTF-8"
    );

  }
);


/* =========================================================
   JSON 데이터 검증
========================================================= */

function validateImportedData(data) {

  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {

    return {
      valid: false,
      message: "JSON 데이터 형식이 올바르지 않습니다."
    };
  }


  if (
    !Array.isArray(data.templates)
  ) {

    return {
      valid: false,
      message: "templates 항목이 필요합니다."
    };
  }


  const ids =
    new Set();


  for (
    let i = 0;
    i < data.templates.length;
    i++
  ) {

    const template =
      data.templates[i];


    const result =
      validateTemplate(template);


    if (!result.valid) {

      return {
        valid: false,
        message:
          `템플릿 ${i + 1}: ${result.message}`
      };
    }


    if (ids.has(template.id)) {

      return {
        valid: false,
        message:
          `템플릿 ${i + 1}: ID가 중복됩니다.`
      };
    }


    ids.add(template.id);

  }


  return {
    valid: true
  };
}


/* =========================================================
   템플릿 하나 검증
========================================================= */

function validateTemplate(template) {

  if (
    typeof template !== "object" ||
    template === null ||
    Array.isArray(template)
  ) {

    return {
      valid: false,
      message: "템플릿 형식이 올바르지 않습니다."
    };
  }


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
          `필수 항목 "${field}"가 없습니다.`
      };
    }
  }


  if (
    typeof template.id !== "string" ||
    template.id.trim() === ""
  ) {

    return {
      valid: false,
      message: "id가 올바르지 않습니다."
    };
  }


  if (
    typeof template.name !== "string" ||
    template.name.trim() === "" ||
    template.name.length > 30
  ) {

    return {
      valid: false,
      message: "name이 올바르지 않습니다."
    };
  }


  if (
    typeof template.text !== "string" ||
    template.text.length > 100
  ) {

    return {
      valid: false,
      message: "text가 올바르지 않습니다."
    };
  }


  if (
    typeof template.fontSize !== "number" ||
    !Number.isFinite(template.fontSize) ||
    template.fontSize < 12 ||
    template.fontSize > 100
  ) {

    return {
      valid: false,
      message: "fontSize가 올바르지 않습니다."
    };
  }


  if (
    typeof template.textColor !== "string" ||
    !/^#[0-9a-fA-F]{6}$/.test(
      template.textColor
    )
  ) {

    return {
      valid: false,
      message: "textColor가 올바르지 않습니다."
    };
  }


  if (
    ![
      "top",
      "center",
      "bottom"
    ].includes(template.position)
  ) {

    return {
      valid: false,
      message: "position이 올바르지 않습니다."
    };
  }


  if (
    ![
      "1:1",
      "4:5",
      "9:16"
    ].includes(template.ratio)
  ) {

    return {
      valid: false,
      message: "ratio가 올바르지 않습니다."
    };
  }


  return {
    valid: true
  };
}


/* =========================================================
   페이지 로드
========================================================= */

renderTemplates();
