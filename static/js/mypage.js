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
// input file에 change 이벤트 부여
const imgUpload = document.getElementById("chooseFile");
imgUpload.addEventListener("change", (e) => {
    readImage(e.target);
});

let image_change;

function imgChange() {
    $(".image").hide();
    $(".message").hide();
    image_change = true;
    ////////////////////////////////////////////////////////////////////////////////////
    const formData = new FormData();
    const file = document.getElementById("chooseFile");
    formData.append("myImage", file.files[0]);
    axios({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: "http://localhost:8000/user/mypage/edit",
            data: formData,
        })
        .then((rep) => {
            return true;
        })
        .then((data) => {})
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "업로드 실패",
            });
            return false;
        });
}

function edit() {
    let form = document.getElementById("form");
    if (!form.checkValidity()) {
        form.reportValidity();

        return false;
    }

    const formData = new FormData();
    if (image_change) {
        const file = document.getElementById("chooseFile");
        formData.append("myImage", file.files[0]);
    }
    formData.append("email", form.email.value);
    formData.append("pw", form.pw.value);
    formData.append("name", form.name.value);

    axios({
            headers: { "Content-Type": "multipart/form-data" },
            method: "post",
            url: "/user/mypage/edit",
            data: formData,
        })
        .then((rep) => {
            return rep.data;
        })
        .then((data) => {
            alert("수정 성공");
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "정보수정 실패",
                text: "모든 칸을 정확히 입력하세요.",
            });
        });
}


const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
})

function waive() {
    let form = document.getElementById("form");
    if (!form.checkValidity()) {
        form.reportValidity();

        return false;
    }
    axios({
            method: "post",
            url: "/user/mypage/delete",
            data: user = {
                id: form.email.value
            }
        })
        .then((rep) => {
            return rep.data;
        })
        .then((data) => {
            swalWithBootstrapButtons.fire({
                title: '진짜로 탈퇴 하시겠습니까??',
                text: "탈퇴 시 재가입 해야하는 수고를...",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '탈퇴',
                cancelButtonText: '안해',
                reverseButtons: false
            }).then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire(
                        '성공적으로 탈퇴되셨습니다!',
                        '안녕히 가세요... :(',
                        'success'
                    )
                    document.location.href = "/"
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        '오예!!!!',
                        '감사합니다!! :)',
                        'error'
                    )
                }
            })

        })

}