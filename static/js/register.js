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

var stuff_count = 1;

function count_stuff() {
    stuff_count += 1;
    $("#append1").append(`
  
    <ul id="stuff">
    <div class="stuffItem">
        <li class="stuff_itme"><input id="stuff_itme" name="stuff" type="text" placeholder="ex : 소금 "></li>
    </div>
    <div class="met">
        <li class="meterage"><input id="meterage" name="meterage" type="text" placeholder="ex : 39g"></li>
    </div>
    <div class="meterageInfor">
        <select name="meterageInfor" id="">
    <option value="ml">ml</option>
    <option value="g">g</option>
    <option value="oz">oz</option>
    </div>
    </select>
</ul>
<br>
`)

}

var order_count = 1;

$("#orderadd").on('click', function() {

    order_count += 1;
    $("#append2").append(`
    <ul id="order_itme">
                                        <div class="order_title">
                                            <label class="orderInfor" for=""></label>
                                        </div>
                                        <div class="order_list">
                                            <li class="order_infor">
                                                <textarea name="orderInfor" id="order_infor" rows="3" cols="30"></textarea>
                                            </li>
                                            <li class="order_img">
                                                <img id="orderImg" src="" alt="orderImg" name="steps" accept="image/*" />
                                                <img src="https://img.icons8.com/pastel-glyph/2x/image-file.png" alt="파일 아이콘" class="orderImg" />
                                                <label id="File" for="orderFile">poto</label>
                                                <input class="file" id="orderFile" type="file" name="recipeImg" onclick="imginput()">
                                            </li>
                                        </div>
    
                                    </ul>
    `);
})

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
        $(".orderImg").hide();
        $("#orderImg").show();
    });
}

function newRecipe_add() {
    let form = document.getElementById("form");

    //  const form = $('form').serializeArray();
    const formData = new FormData();
    const recipefile = document.getElementById("chooseFile");
    const orderfile = document.getElementById("orderFile");
    console.log(form.time.value);
    const data = {
        recipe_title: form.recipeName.value,
        recipe_intro: form.recipeInfor.value,
        category_list: form.category.value,
        cookTime: form.time.value,
        level_list: form.level.value,
        ingredient: [{
            ingredient: form.stuff.value,
            amount: form.meterage.value,
            unit: form.meterageInfor.value,
        }, ],
        steps: [form.order_infor.value],
    };
    json = JSON.stringify(data);
    //  const json = JSON.serializeObject({ formData });
    //  const blob = new Blob([json], {
    //      type: 'application/json'
    //  });
    // for (let i = 0; i < Object.values(orderfile.files).length; i++) {
    // 	formData.append("steps", orderfile.files[i]);
    // }
    formData.append("steps", orderfile.files[0]);
    formData.append("recipe", recipefile.files[0]);
    formData.append("data", JSON.stringify(data));

    axios({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `
        http: //localhost:8000/recipe/register`,
            data: formData,
        })
        .then((rep) => {
            return rep.data;
        })
        .then((data) => {
            Swal.fire("New Recipe 작성 완료 :)", "success");
            document.location.href = `http://localhost:8000/recipe/${id}`;
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "레시피 작성이 실패하였습니다.",
                text: "다시 작성해 주시기 바랍니다. :(",
            });
        });
}