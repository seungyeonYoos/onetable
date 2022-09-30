// 좋아요 기능
var heartcount = 0;

function heart() {
    const pushHeartBtn = document.querySelector(".heart");
    console.log(pushHeartBtn)
    if (pushHeartBtn.innerHTML !== '<i class="xi-heart xi-x"></i>') {
        pushHeartBtn.innerHTML = '<i class="xi-heart xi-x"></i>';
        pushHeartBtn.style.color = 'red';
    } else {
        pushHeartBtn.innerHTML = '<i class=" xi-heart-o xi-x"></i>';
        pushHeartBtn.style.color = 'black';
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
        url: `http://localhost:8000/recipe/${id}`,
        data: data = {
            review: myReview,
            evaluation: evaluation
        }
    }).then((rep) => {
        return rep.data;
    })

    console.log(data)

}