// 좋아요 기능
var heartcount = 0;

function heart(id) {
    const pushHeartBtn = document.querySelector(".Heart");
    console.log(pushHeartBtn)
    if (pushHeartBtn.innerHTML !== '<i class="xi-heart xi-x"></i>') {
        pushHeartBtn.innerHTML = '<i class="xi-heart xi-x"></i>';
        pushHeartBtn.style.color = 'red';
        heartcount += 1;
        axios({
            method: 'post',
            url: `/recipe/${id}/fav`,
            data: data = {
                heartcount: heartcount
            }
        }).then((rep) => {
            return rep.data;
        })
    } else {
        pushHeartBtn.innerHTML = '<i class=" xi-heart-o xi-x"></i>';
        pushHeartBtn.style.color = 'black';
        heartcount -= 1;
        axios({
            method: 'delete',
            url: `/recipe/${id}/fav`,
            data: data = {
                heartcount: heartcount
            }
        }).then((rep) => {
            return rep.data;
        })
    }
    console.log(heartcount)

}

var evaluation = 0;

function goodRecipe() {

    const goodrecipe = document.querySelector(".goodrecipe");
    if (goodrecipe.innerHTML !== '<i class="xi-emoticon-smiley xi-2x"></i>') {
        goodrecipe.innerHTML = '<i class="xi-emoticon-smiley xi-2x"></i>';
        goodrecipe.style.color = "red";

        evaluation += 1;
    } else {
        goodrecipe.innerHTML = '<i class="xi-emoticon-smiley-o xi-2x"></i>';
        goodrecipe.style.color = "black";
        evaluation -= 1;

    }
    console.log(evaluation)

}

function badRecipe() {
    const badrecipe = document.querySelector(".badrecipe");
    if (badrecipe.innerHTML !== '<i class="xi-emoticon-sad xi-2x"></i>') {
        badrecipe.innerHTML = '<i class="xi-emoticon-sad xi-2x"></i>';
        badrecipe.style.color = "red";
        evaluation -= 1;
    } else {
        badrecipe.innerHTML = '<i class="xi-emoticon-sad-o xi-2x"></i>';
        badrecipe.style.color = "black";
        evaluation += 1;
    }
}

function reviewChat(id) {
    var myReview = document.getElementById("myReview").value;
    axios({
        method: 'post',
        url: `/recipe/${id}`,
        data: data = {
            score: evaluation,
            comment: myReview,
        }
    }).then((rep) => {
        return rep.data;
    })

}