function count_stuff() {

    $(".stuff_button").before(`
    <ul id="stuff">
    <label for="stuff_itme">재료명</label>
    <li class="stuff_itme"><input id="stuff_itme" type="text" placeholder="ex : 소금 "></li>
    <label for="meterage">계량</label>
    <li class="meterage"><input id="meterage" type="text" placeholder="ex : 39g"></li><br>
    </ul>
    `)
}

function count_order() {}