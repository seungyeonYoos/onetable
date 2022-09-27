// var IMP = window.IMP; // 생략가능
// IMP.init("imp35171536"); // <-- 본인 가맹점 식별코드 삽입

function requestPay() {
  IMP.init("imp35171536");
  IMP.request_pay(
    {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: "merchant_" + new Date().getTime(),
      name: "결제테스트",
      amount: 14000,
      buyer_email: "iamport@siot.do",
      buyer_name: "구매자",
      buyer_tel: "010-1234-5678",
      buyer_addr: "서울특별시 강남구 삼성동",
      buyer_postcode: "123-456",
    },
    function (rsp) {
      // callback
      if (rsp.success) {
        let msg = "결제가 완료되었습니다.";
        msg += "고유ID: " + rsp.imp_uid;
        msg += "거래ID: " + rsp.merchant_uid;
        msg += "결제 금액: " + rsp.paid_amount;
        msg += "카드 승인번호: " + rsp.apply_num;
        alert(msg);
        location.href = "/";
      } else {
        let msg = "결제에 실패하였습니다.";
        alert(msg);
      }
    }
  );
}
