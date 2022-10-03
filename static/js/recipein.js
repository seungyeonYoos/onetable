// 좋아요 기능
var heartcount;

const pushHeartBtn = document.querySelector(".Heart");
pushHeartBtn.addEventListener('click', () => {

    if (pushHeartBtn.innerHTML !== '<i class="xi-heart xi-x"></i>') {
        pushHeartBtn.innerHTML = '<i class="xi-heart xi-x"></i>';
        pushHeartBtn.style.color = 'red';
        heartcount = pushHeartBtn;

    } else {
        pushHeartBtn.innerHTML = '<i class=" xi-heart-o xi-x"></i>';
        pushHeartBtn.style.color = 'black';
    }
});

function heart(id) {

    axios({
        method: 'post',
        url: `http://localhost:8000/recipe/${id}/fav`,
        data: data = {
            heartcount: heartcount
        }
    }).then((rep) => {
        return rep.data;
    });
    axios({
        method: 'delete',
        url: `http://localhost:8000/recipe/${id}/fav`,
        data: data = {
            deleteFavorite: heartcount
        }
    }).then((rep) => {
        return rep.data;
    });

}



function goodRecipe() {
    const goodrecipe = document.querySelector(".goodrecipe");
    if (goodrecipe.innerHTML !== '<i class="xi-emoticon-smiley xi-2x"></i>') {
        goodrecipe.innerHTML = '<i class="xi-emoticon-smiley xi-2x"></i>';
        goodrecipe.style.color = "red";
    } else {
        goodrecipe.innerHTML = '<i class="xi-emoticon-smiley-o xi-2x"></i>';
        goodrecipe.style.color = "black";
    }
}

function badRecipe() {
    const badrecipe = document.querySelector(".badrecipe");
    if (badrecipe.innerHTML !== '<i class="xi-emoticon-sad xi-2x"></i>') {
        badrecipe.innerHTML = '<i class="xi-emoticon-sad xi-2x"></i>';
        badrecipe.style.color = "red";

    } else {
        badrecipe.innerHTML = '<i class="xi-emoticon-sad-o xi-2x"></i>';
        badrecipe.style.color = "black";
    }
}

let good = document.getElementById("goodrecipe").value;
let bad = document.getElementById("badrecipe").value;
console.log("good", good)
console.log("bad", bad)
var score = 0;
$("#goodrecipe").on("click", () => {
    score = good;
    console.log(score)
})

$("#badrecipe").on("click", () => {
    score = bad;
    console.log(score)
})

function reviewChat(id) {
    var myReview = document.getElementById("myReview").value;

    axios({
        method: 'post',
        url: `http://localhost:8000/recipe/${id}`,
        data: data = {
            score: score,
            comment: myReview,
        }
    }).then((rep) => {
        return rep.data;
    }).then((data) => {
        document.location.href = `/recipe/${id}`;

    }).catch((err) => {
        return false;
    })
};