
document.getElementById("register").addEventListener("submit", function(event) {
    event.preventDefault()
    console.log("register")
    const newUsername = document.getElementById("register-username").value;
    const newPassword = document.getElementById("register-password").value;
    const checkPassword = document.getElementById("register-confirm-password").value;
    const registerEmail = document.getElementById("register-email").value;
    if(!validateRepeat(newPassword,checkPassword)){
        alert("两次输入的密码不一致");
        return;
    }
    if(!validateInput(newPassword,newPassword)){
        alert("账号或密码格式错误");
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                alert("注册成功")

            } else{
                alert("该用户名已存在")
            }
        }
    };

    xhr.open("POST", "http://localhost:5000/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    const data = {
        username: newUsername,
        password: newPassword,
        email: registerEmail
    };
    console.log(data)
    xhr.send(JSON.stringify(data));
})
function validateRepeat(password,repeat){
    return password===repeat;
}
function validateInput(username, password) {
    // 使用正则表达式进行验证
    const regex = /^[a-zA-Z0-9]{1,16}$/;

    if (regex.test(username) && regex.test(password)) {
        // 输入合法
        return true;
    } else {
        // 输入不合法
        return false;
    }
}