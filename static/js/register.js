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
     //  if (!form.checkValidity()) {
     //      form.reportValidity();

     //      return false;
     //  }
     //  let form = document.getElementById("form");
     //  const formData = new FormData();
     const formData = $("#form").serializeObject();
     const recipefile = document.getElementById("chooseFile");
     const orderfile = document.getElementById("orderFile");
     var data = {
         recipeName: form.recipeName.value,
         recipeInfor: form.recipeInfor.value,
         category: form.category.value,
         time: form.time.value,
         level: form.level.value,
         stuff: form.stuff.value,
         meterage: form.meterage.value,
         meterageInfor: form.meterageInfor.value,
         orderInfor: form.order_infor.value
     }

     formData.append("myImage", recipefile.files[0]);
     formData.append("recipeImg", orderfile.files[0]);
     formData.append("title", data.recipeName);
     formData.append("intro", data.recipeInfor);
     formData.append("category_id", data.category);
     formData.append("level_id", data.level);
     formData.append("amount", data.stuff);
     formData.append("ingredient_id", data.meterage);
     formData.append("unit_id", data.meterageInfor);


     axios({
             headers: {
                 "Content-Type": `application/json`,
             },
             method: "post",
             url: `http://localhost:8000/recipe/register`,
             data: JSON.stringify(formData)
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

 }