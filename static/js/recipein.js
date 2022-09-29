function good(id) {
    $("#chat").show();
    $(".chat").show();
    $("#evaluation").hide();
    $(".evaluation").hide();

    var good = $("#good").val();
    axios({
            method: 'post',
            url: `http://localhost:8000/recipe/${id}`,
            data: data = {
                good: good,
            }
        }).then((rep) => {
            return rep.data;
        })
        .then((data) => {
            Swal.fire(
                '평가 감사합니다 :)',
                '댓글을 작성해주세요 !!',
                'success'
            )
        });
    console.log(good)
};



function bad(id) {
    $("#chat").show();
    $(".chat").show();
    $("#evaluation").hide();
    $(".evaluation").hide();


    var bad = $("#bad").val();
    axios({
            method: 'post',
            url: `http://localhost:8000/recipe/${id}`,
            data: data = {
                bad: bad,


            }
        }).then((rep) => {
            return rep.data;
        })
        .then((data) => {
            Swal.fire({
                icon: "error",
                title: "왜요......?",
                text: "제...레시피...별로에요?.. :("
            });
        });
    console.log(bad)


};

function reviewChat() {

    axios({
            method: 'post',
            url: `http://localhost:8000/recipe/${id}`,
            data: data = {
                review: form.myReview.value


            }
        }).then((rep) => {
            return rep.data;
        })
        .then((data) => {
            Swal.fire({
                icon: "error",
                title: "왜요......?",
                text: "제...레시피...별로에요?.. :("
            });
        });
}