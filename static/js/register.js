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

 function count_stuff() {

     $(".stuff_button").before(`
    <ul id="stuff">
    <div class="stuffItem">
        <label for="stuff_itme"></label>
        <li class="stuff_itme"><input id="stuff_itme" type="text" placeholder="ex : 소금 "></li>
    </div>
    <div class="met">
        <label for="meterage"></label>
        <li class="meterage"><input id="meterage" type="text" placeholder="ex : 39g"></li><br>
    </div>
    <div class="meterageInfor">
        <select name="meterageInfor" id="">
    <option value="ml">ml</option>
    <option value="g">g</option>
    <option value="oz">oz</option>
    </div>
    </select>
    </ul>
    `)
 }

 function count_order() {
     $(".order_button").before(`
     <ul id="order_itme">
     <div class="order_title">
         <label class="orderInfor" for="">설명</label>
     </div>
     <div class="order_list">
         <li class="order_infor">

             <textarea name="" id="order_infor" rows="3" cols="30"></textarea>
         </li>
         <li class="order_img">
             <img id="orderImg" src="" alt="orderImg" name="orderImg" accept="image/*" />
             <img src="https://img.icons8.com/pastel-glyph/2x/image-file.png" alt="파일 아이콘" class="orderImg" />
             <label id="File" for="orderFile">poto</label>
             <input class="file" id="orderFile" type="file" name="recipeImg" onclick="imginput()">

         </li>
     </div>
 </ul>
    `)

 }
 //   <input type="file" id="inputImage">

 //    <button id="sendButton">보내기</button>

 //    <img src="" class="uploadImage">
 function readImage(input) {


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
         readImage(e.target)
         $(".orderImg").hide();
         $("#orderImg").show();
     });

 }

 function newRecipe_add() {
     var form = document.getElementById("form");
     if (!form.checkValidity()) {
         form.reportValidity();

         return false;
     }

     const formData = new FormData();
     const recipefile = document.getElementById("chooseFile");
     const orderfile = document.getElementById("orderFile");
     formData.append("myImage", recipefile.files[0]);
     formData.append("recipeImg", orderfile.files[0]);
     formData.append("recipeName", form.recipeName.value);
     formData.append("recipeInfor", form.category.value);
     formData.append("time", form.time.value);
     formData.append("level", form.level.value);
     formData.append("recipe", form.time.value);

     axios({
             headers: {
                 "Content-Type": "multipart/form-data",
             },
             method: "post",
             url: `http://localhost:8000/recipe/${id}`,
             data: formData
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