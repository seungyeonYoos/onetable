 // // // drag file (보류)
 // function preventDefaults(e) {
 //     e.preventDefault();
 //     e.stopPropagation();
 // }

 // const dropArea = document.getElementById("drop-file");

 // function highlight(e) {
 //     preventDefaults(e);
 //     dropArea.classList.add("highlight");
 // }

 // function unhighlight(e) {
 //     preventDefaults(e);
 //     dropArea.classList.remove("highlight");
 // }

 // dropArea.addEventListener("dragenter", highlight, false);
 // dropArea.addEventListener("dragover", highlight, false);
 // dropArea.addEventListener("dragleave", unhighlight, false);
 // // 업로드
 // function handleDrop(e) {
 //     //     unhighlight(e);
 //     //     let dt = e.dataTransfer;
 //     //     let files = dt.files;

 //     //     console.log(files);

 //     // FileList
 //     $(".image").hide();
 //     $(".message").hide();
 //     $("#img").show();

 // }

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

 // input file에 change 이벤트 부여
 const imgUpload = document.getElementById("chooseFile")
 imgUpload.addEventListener("change", e => {
     readImage(e.target)
 });

 function imgChange() {
     $(".image").hide();
     $(".message").hide();
     $("#img").show();

 }
 // 비밀번호 show/hide
 $(document).ready(function() {
     $('.eye i').on('click', function() {
         $('input').toggleClass('active');
         if ($('input').hasClass('active')) {
             $(this).attr('class', "fa fa-eye-slash fa-lg")
                 .prev('input').attr('type', "text");
         } else {
             $(this).attr('class', "fa fa-eye fa-lg")
                 .prev('input').attr('type', 'password');
         }
     });
 });


 // function checkPassword(pw) {

 //     if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(pw)) {
 //         $(".alert").html('<div>숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다.</div>');

 //         $('.pw').val('').focus();
 //         return false;
 //     }
 //     var checkNumber = pw.search(/[0-9]/g);
 //     var checkEnglish = pw.search(/[a-z]/ig);
 //     if (checkNumber < 0 || checkEnglish < 0) {
 //         $(".alert").html("<div>숫자와 영문자를 혼용하여야 합니다.</div>");
 //         $('.pw').val('').focus();
 //         return false;
 //     }
 //     if (/(\w)\1\1\1/.test(pw)) {
 //         $(".alert").html('<div>같은 문자를 4번 이상 사용하실 수 없습니다.</div>');
 //         $('.pw').val('').focus();
 //         return false;
 //     }

 //     if (pw.search(id) > -1) {
 //         $(".alert").html("<div>비밀번호에 아이디가 포함되었습니다.</div>");
 //         $('.pw').val('').focus();
 //         return false;
 //     }
 //     return true;
 // }


 // 가입하기
 function signUp(pw) {
     var form = document.fm;
     if (!form.name.value) {
         form.name.focus();
         return;
     }
     if (!form.id.value) {
         form.id.focus();
         return;
     }
     if (!form.pw.value) {
         form.pw.focus();
         return;
     }
     // 비빌번호 유효성 검사
     $(".pw").change(function() {
         checkPassword($('.pw').val());
     });
     // 유효성 검사
     function checkPassword(pw) {
         if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/.test(pw)) {
             $(".alert").html('<div>숫자+영문자+특수문자 조합으로 8자리 이상 사용해야 합니다.</div>');

             $('.pw').val('').focus();
             return false;
         }
         var checkNumber = pw.search(/[0-9]/g);
         var checkEnglish = pw.search(/[a-z]/ig);
         if (checkNumber < 0 || checkEnglish < 0) {
             $(".alert").html("<div>숫자와 영문자를 혼용하여야 합니다.</div>");
             $('.pw').val('').focus();
             return false;
         }
         if (/(\w)\1\1\1/.test(pw)) {
             $(".alert").html('<div>같은 문자를 4번 이상 사용하실 수 없습니다.</div>');
             $('.pw').val('').focus();
             return false;
         }

         if (pw.search(id) > -1) {
             $(".alert").html("<div>비밀번호에 아이디가 포함되었습니다.</div>");
             $('.pw').val('').focus();
             return false;
         }
         return true;
     }

     //////////////////////////////////////////////////////////
     const formData = new FormData();
     const file = document.getElementById("chooseFile");
     formData.append("myImage", file.files[0]);
     formData.append("email", form.id.value);
     formData.append("pw", form.pw.value);
     formData.append("name", form.name.value);
     // formData.append("photo", "01234");

     // let data = {
     //   email: form.id.value,
     //   pw: form.pw.value,
     //   name: form.name.value,
     //   poto: form.img.value,
     // };
     axios({
             headers: {
                 "Content-Type": "multipart/form-data",
             },
             method: "post",
             url: "http://localhost:8000/user/signup",
             data: formData,
         })
         .then((rep) => {
             return true;
         })
         .then((data) => {
             document.location.href = "/user/login";
         })
         .catch((error) => {
             Swal.fire({
                 icon: "error",
                 title: "회원가입 실패",
                 text: "모든 칸을 정확히 입력하세요.",
             });
         });

 }