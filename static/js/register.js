 // image upload


 function readImage(input) {


     if (input.files && input.files[0]) {
         // 이미지 파일인지 검사 (생략)
         // FileReader 인스턴스 생성
         const reader = new FileReader()
             // 이미지가 로드가 된 경우
         reader.onload = e => {
                 const previewImage = document.getElementById("img")
                 previewImage.src = e.target.result
             }
             // reader가 이미지 읽도록 하기
         reader.readAsDataURL(input.files[0])
     }
 }

 function imgChange() {
     // input file에 change 이벤트 부여
     const imgUpload = document.getElementById("chooseFile")
     imgUpload.addEventListener("change", e => {
         readImage(e.target)
         $("#img").show();
         $(".image").hide();

     });
 }

 var stuff_count = 1;

 function count_stuff() {
     stuff_count += 1;
     console.log(stuff_count)
 }


 var order_count = 1;

 function count_order() {
     order_count += 1;
 }

 function readOrderImage(input) {


     if (input.files && input.files[0]) {
         // 이미지 파일인지 검사 (생략)
         // FileReader 인스턴스 생성
         const reader = new FileReader()
             // 이미지가 로드가 된 경우
         reader.onload = e => {
                 const previewImage = document.getElementById("orderImg")
                 previewImage.src = e.target.result
             }
             // reader가 이미지 읽도록 하기
         reader.readAsDataURL(input.files[0])
     }
 }

 function imginput() {
     const imgUpload = document.getElementById("orderFile")
     imgUpload.addEventListener("change", e => {
         readOrderImage(e.target)
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
     const data = {

         title: form.recipeName.value,
         intro: form.recipeInfor.value,
         category_id: form.category.value,
         cookTime: form.time.value,
         level_id: form.level.value,
         ingredient: {
             ingredient_id: form.stuff.value,
             amount: form.meterage.value,
             unit_id: form.meterageInfor.value,

         },
         instruction: [form.order_infor.value]
     }
     json = JSON.stringify(data);
     //  const json = JSON.serializeObject({ formData });
     //  const blob = new Blob([json], {
     //      type: 'application/json'
     //  });
     for (let i = 0; i < Object.values(orderfile.files).length; i++) {
         formData.append("steps", orderfile.files[i]);
     }
     formData.append("recipe", recipefile.files[0]);
     formData.append("data", JSON.stringify(data));

     axios({
             headers: {
                 "Content-Type": 'multipart/form-data',
             },
             method: "post",
             url: `http://localhost:8000/recipe/register`,
             data: formData,
         })
         .then((rep) => {
             return rep.data;

         })
         .then((data) => {
             Swal.fire(
                 'New Recipe 작성 완료 :)',
                 'success'
             )
         })
         .catch((error) => {
             Swal.fire({
                 icon: "error",
                 title: "레시피 작성이 실패하였습니다.",
                 text: "다시 작성해 주시기 바랍니다. :("
             });
         });


 };