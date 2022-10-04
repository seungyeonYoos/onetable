// 좋아요 기능
// var heart;
// var heartdelete;

// const pushHeartBtn = document.querySelector(".Heart");
// pushHeartBtn.addEventListener('click', () => {

//     if (pushHeartBtn.innerHTML !== '<i class="xi-heart xi-x"></i>') {
//         pushHeartBtn.innerHTML = '<i class="xi-heart xi-x"></i>';
//         pushHeartBtn.style.color = 'red';
//         heartcount = pushHeartBtn;

//     } else {
//         pushHeartBtn.innerHTML = '<i class=" xi-heart-o xi-x"></i>';
//         pushHeartBtn.style.color = 'black';

//     }
// });

function heart(id, userId) {
	const pushHeartBtn = document.localStorage(".Heart");
	pushHeartBtn.addEventListener("click", () => {
		if (pushHeartBtn.innerHTML !== '<i class="xi-heart xi-x"></i>') {
			pushHeartBtn.innerHTML = '<i class="xi-heart xi-x"></i>';
			pushHeartBtn.style.color = "red";
			axios({
				method: "post",
				url: `/recipe/${id}/fav`,
				data: (data = {
					user_id: userId,
				}),
			}).then((rep) => {
				return rep.data;
			});
		} else {
			pushHeartBtn.innerHTML = '<i class=" xi-heart-o xi-x"></i>';
			pushHeartBtn.style.color = "black";
			axios({
				method: "delete",
				url: `/recipe/${id}/fav`,
				data: (data = {
					user_id: userId,
				}),
			}).then((rep) => {
				return rep.data;
			});
		}
	});
}
// 수정
function modify(id) {
	axios({
		method: "put",
		url: `/recipe/${id}/modify`,
	}).then((rep) => {
		return true;
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
console.log("good", good);
console.log("bad", bad);
var score = 0;
$("#goodrecipe").on("click", () => {
	score = good;
	console.log(score);
});

$("#badrecipe").on("click", () => {
	score = bad;
	console.log(score);
});

function reviewChat(id) {
	var myReview = document.getElementById("myReview").value;

	axios({
		method: "post",
		url: `/recipe/${id}`,
		data: (data = {
			score: score,
			comment: myReview,
		}),
	})
		.then((rep) => {
			return rep.data;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
}
