function count_stuff() {

    $(".stuff_button").before(`
    <ul id="stuff">
    <div class="stuffItem">
        <label for="stuff_itme"></label>
        <li class="stuff_itme"><input id="stuff_itme" type="text" placeholder="ex : 소금 "></li>
    </div>
    <div class="met">
        <label for="meterage"></label>
        <li class="meterage"><input id="meterage" type="text" placeholder="ex : 39g"></li><br>
    </div>
    <div class="meterageInfor">
        <select name="meterageInfor" id="">
    <option value="ml">ml</option>
    <option value="g">g</option>
    <option value="oz">oz</option>
    </div>
    </select>
    </ul>
    `)
}

function count_order() {

    $(".order_button").before(`
    <ul id="order_itme">
                            
    <div class="order_list">
    <li class="order_infor"><textarea name="" id="order_infor" rows="3"></textarea></li>
    <li class="order_img"><img src="" alt=""></li>
    </div>
    </ul>
    `)

}