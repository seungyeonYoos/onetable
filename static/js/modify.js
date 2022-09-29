function edit() {
	const formData = new FormData();

	const file = document.querySelector("#dynamicForm");
	const file2 = document.querySelector("#dynamicForm");
	formData.append("recipe", file.files[0]);
	for (const property in file.files) {
	}
	for (let i = 0; i < Object.values(file2.files).length; i++) {
		formData.append("steps", file.files[i]);
	}
	formData.append("steps", file.files[0]);
}
function remove() {}

// const form = document.querySelector("form");
// const data = {
//     name: form.name.value,
//     gender: form.gender.value,
// }
// axios({
//     url: "/get/axios",
//     method: "get", //post면 params가 아닌 data로 작성한다.
//     params: data,
// 		timeout: 3000,//timeout 설정할 수 있다.
// }).then((res) => {
//     console.log(res);
// 		console.log(res.data);
// 		//이렇게 데이터를 주고 받을 수 있다.
// });
