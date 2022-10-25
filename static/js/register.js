// image upload

function readImage(input) {
    if (input.files && input.files[0]) {
        // 이미지 파일인지 검사 (생략)
        // FileReader 인스턴스 생성
        const reader = new FileReader();
        // 이미지가 로드가 된 경우
        reader.onload = (e) => {
            const previewImage = document.getElementById("img");
            previewImage.src = e.target.result;
        };
        // reader가 이미지 읽도록 하기
        reader.readAsDataURL(input.files[0]);
    }
}

function imgChange() {
    // input file에 change 이벤트 부여
    const imgUpload = document.getElementById("chooseFile");
    imgUpload.addEventListener("change", (e) => {
        readImage(e.target);
        $("#img").show();
        $(".image").hide();
    });
}

var stuff_count = 0;
var maxAppend = 0;


$(".add").on("click", function() {

    $("#append1").append(`

    <ul id="stuff">
        <div class="stuffItem">
            <li class="stuff_item">
                <input id="stuff_item${stuff_count}" name="stuff" type="text" placeholder="ex : 소금 ">
            </li>
        </div>
        <div class="met">
            <li class="meterage">
                <input id="meterage${stuff_count}" name="meterage" type="text" placeholder="ex : 39g">
            </li>
        </div>
        <div class="meterageInfor">
            <select name="meterageInfor" id="unit${stuff_count}">
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="oz">oz</option>
            </select>
        </div>
    </ul><br>
`);

    stuff_count += 1;
});


function remote_stuff() {
    $("#append1:last-child ").empty();
}
var order_count = 0;

$(function() {
    $("#orderadd").on("click", function() {
        $("#append2").append(`
    <ul id="order_item">
        <div class="order_list container">
            <li class="order_infor">
                <textarea name="orderInfor" id="order_infor${order_count}" rows="3" cols="30"></textarea>
            </li>
            <li class="order_img">
                <img id="orderImg${order_count}" src="" alt="orderImg" name="steps" accept="image/*" />
                <input class="file" id="orderFile${order_count}" type="file" name="recipeImg"  multiple>
                </li>
                <label id="File" for="orderFile${order_count}">poto</label>
        </div>
    </ul>
    `);
        order_count += 1;
    });
    $("#orderRemove").on("click", function() {
        $("#append2 *").remove();
    });
});
// function count_order() {}


function readOrderImage(input) {
    if (input.files && input.files[0]) {
        // 이미지 파일인지 검사 (생략)
        // FileReader 인스턴스 생성
        const reader = new FileReader();
        // 이미지가 로드가 된 경우
        reader.onload = (e) => {
            const previewImage = document.getElementById("orderImg");
            previewImage.src = e.target.result;
        };
        // reader가 이미지 읽도록 하기
        reader.readAsDataURL(input.files[0]);
    }
}

function imginput() {
    const imgUpload = document.getElementById("orderFile");
    imgUpload.addEventListener("change", (e) => {
        readOrderImage(e.target);
    });

}  

function readOrderImage2(input) {
    if (input.files && input.files[0]) {
        // 이미지 파일인지 검사 (생략)
        // FileReader 인스턴스 생성
        const reader = new FileReader();
        // 이미지가 로드가 된 경우
        reader.onload = (e) => {
            const previewImage = document.getElementById(`orderImg${order_count}`);
            previewImage.src = e.target.result;
        };
        // reader가 이미지 읽도록 하기
        reader.readAsDataURL(input.files[0]);
    }
}



function imginput() {
    const imgUpload = document.getElementById(`orderImg${order_count}`);
    imgUpload.addEventListener("change",   e => {
        readOrderImage2(e.target);
    });

}  
/* 재료 부분:

.stuff_item > input → 재료명

.meterage > input → 계량

.meterageInfor > select → unit.

steps 부분:

.order_infor > textarea → 요리 과정을 담는 부분

.order_img > input → 이미지들을 담는 부분*/
function newRecipe_add() {
    let form = document.getElementById("form");
    //재료 내용 담는 부분
    const stuff_item = document.querySelectorAll(".stuffItem li input");
    const meterage = document.querySelectorAll(".meterage > input");
    const meterageInfor = document.querySelectorAll(".meterageInfor > select");

    let ingredient = [];

    for (let i = 0; i < stuff_item.length; i++) {
        const obj = new Object();
        obj.ingredient = stuff_item[i].value;
        obj.amount = meterage[i].value;
        obj.unit = meterageInfor[i].value;

        ingredient.push(obj);
    }
    //요리 과정 담는 부분
    const order_infor = document.querySelectorAll(".order_infor > textarea");
    let steps = [];
    for (const element of order_infor) {
        steps.push(element.value);
    }
    //  const form = $('form').serializeArray();
    const formData = new FormData();
    const recipefile = document.getElementById("chooseFile");
    const orderfile = document.querySelectorAll(".order_img > input");

    const data = {
        recipe_title: form.recipeName.value,
        recipe_intro: form.recipeInfor.value,
        category_list: form.category.value,
        cookTime: form.time.value,
        level_list: form.level.value,
        ingredient,
        steps,
    };
    // json = JSON.stringify(data);
    //  const json = JSON.serializeObject({ formData });
    //  const blob = new Blob([json], {
    //      type: 'application/json'
    //  });
    // for (let i = 0; i < Object.values(orderfile.files).length; i++) {
    // 	formData.append("steps", orderfile.files[i]);
    // }

    formData.append("recipe", recipefile.files[0]);
    console.log("오더 파일:", orderfile);
    for (const element of orderfile) {
        formData.append("steps", element.files[0]);
    }
    formData.append("data", JSON.stringify(data));

    axios({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `/recipe/register`,
            data: formData,
        })
        .then((rep) => {
            console.log("axios result in register.js:", rep);
            return rep.data;
        })
        .then((data) => {
            Swal.fire("New Recipe 작성 완료 :)", "success");
            document.location.href = `/recipe`;
        })
        .catch((error) => {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "레시피 작성이 실패하였습니다.",
                text: "다시 작성해 주시기 바랍니다. :(",
            });
        });
}