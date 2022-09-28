function good() {
    $("#chat").show();
    $(".chat").show();
    $("#evaluation").hide();
    $(".evaluation").hide();

}

function bad() {
    Swal.fire({
        icon: "error",
        title: "왜요......?",
        text: "제...레시피...별로에요?.. :("
    });
    $("#evaluation").hide();
    $(".evaluation").hide();

}