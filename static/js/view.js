// 더보기
$(window).on('load', function() {
    review('#review_load', '4');
    userLikes('#userLikes_load', '4');
    likeClass('#likeClass_load', '4');
    myrecipe('#myrecipe_load', '4');
    myClass('#myClass_load', '4');
    appClass('#appClass_load', '4');
    // 로드될 파트 


    $("#view .reviewB").on("click", function() {
        review('#review_load', '4', '#view');
    })
    $("#view .userLikesB").on("click", function() {
        userLikes('#userLikes_load', '4', '#view');
    })
    $("#view .likeClassB").on("click", function() {
        likeClass('#likeClass_load', '4', '#view');
    })
    $("#view .myrecipeB").on("click", function() {
        myrecipe('#myrecipe_load', '4', '#view');
    })
    $("#view .myClassB").on("click", function() {
        myClass('#myClass_load', '4', '#view');
    })
    $("#view .appClassB").on("click", function() {
        appClass('#appClass_load', '4', '#view');
    });
    // 



});

function review(id, cnt, btn) {
    var review_list = id + " .reviewItem:not(.active)";
    var review_length = $(review_list).length;
    var review_total_cnt;
    if (cnt < review_length) {
        review_total_cnt = cnt;
    } else {
        review_total_cnt = review_length;
        $('.reviewB').hide()
    }
    $(review_list + ":lt(" + review_total_cnt + ")").addClass("active");
}

function userLikes(id, cnt, btn) {
    var userLikes_list = id + " .userLikesItem:not(.active)";
    var userLikes_length = $(userLikes_list).length;
    var userLikes_total_cnt;
    if (cnt < userLikes_length) {
        userLikes_total_cnt = cnt;
    } else {
        userLikes_total_cnt = userLikes_length;
        $('.userLikesB').hide()
    }
    $(userLikes_list + ":lt(" + userLikes_total_cnt + ")").addClass("active");
}

function likeClass(id, cnt, btn) {
    var likeClass_list = id + " .likeClassItem:not(.active)";
    var likeClass_length = $(likeClass_list).length;
    var likeClass_total_cnt;
    if (cnt < likeClass_length) {
        likeClass_total_cnt = cnt;
    } else {
        likeClass_total_cnt = likeClass_length;
        $('.likeClassB').hide()
    }
    $(likeClass_list + ":lt(" + likeClass_total_cnt + ")").addClass("active");
}

function myrecipe(id, cnt, btn) {
    var myrecipe_list = id + " .myrecipeItem:not(.active)";
    var myrecipe_length = $(myrecipe_list).length;
    var myrecipe_total_cnt;
    if (cnt < myrecipe_length) {
        myrecipe_total_cnt = cnt;
    } else {
        myrecipe_total_cnt = myrecipe_length;
        $('.myrecipeB').hide()
    }
    $(myrecipe_list + ":lt(" + myrecipe_total_cnt + ")").addClass("active");
}

function myClass(id, cnt, btn) {
    var myClass_list = id + " .myClassItem:not(.active)";
    var myClass_length = $(myClass_list).length;
    var myClass_total_cnt;
    if (cnt < myClass_length) {
        myClass_total_cnt = cnt;
    } else {
        myClass_total_cnt = myClass_length;
        $('.myClassB').hide()
    }
    $(myClass_list + ":lt(" + myClass_total_cnt + ")").addClass("active");
}

function appClass(id, cnt, btn) {
    var appClass_list = id + " .appClassItem:not(.active)";
    var appClass_length = $(appClass_list).length;
    var appClass_total_cnt;
    if (cnt < appClass_length) {
        appClass_total_cnt = cnt;
    } else {
        appClass_total_cnt = appClass_length;
        $('.appClassB').hide()
    }
    $(appClass_list + ":lt(" + appClass_total_cnt + ")").addClass("active");
}

$(window).on('load', function() {
    recipe('#recipe_load', '5');
    $("#view .recipeB").on("click", function() {
        recipe('#recipe_load', '5', '#view');
    });

});



function recipe(id, cnt, btn) {
    // 반복될 리스트 class name
    var recipe_list = id + " .recipeItem:not(.active)";
    var recipe_length = $(recipe_list).length;
    console.log(recipe_length);
    var recipe_total_cnt;
    if (cnt < recipe_length) {
        recipe_total_cnt = cnt;
    } else {
        recipe_total_cnt = recipe_length;
        // 더보기 버튼 클래스
        $(".recipeB").hide();
    }
    $(recipe_list + ":lt(" + recipe_total_cnt + ")").addClass("active");
}