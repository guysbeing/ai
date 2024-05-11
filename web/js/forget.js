
function resetPassword(){
    var newUsername = document.getElementById("forget-username").value;
    var newPassword = document.getElementById("forget-password").value;
    var checkPassword = document.getElementById("forget-confirm-password").value;
    if(!validateInput(newUsername,newPassword)) {
        alert("账号或密码格式错误");
        return;
    }
    if(!validateRepeat(newPassword,checkPassword)){
        alert("两次输入的密码不一致");
        return;
    }
    if(!checkCode()){
        alert("填写的邮箱确认码错误");
        return;
    }
    console.log("123")
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);

            } else if(xhr.status ===409){
                alert('该用户不存在');

            }
        }
    };

    xhr.open("POST", "http://localhost:5000/forget", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var data = {
        username: newUsername,
        password: newPassword
    };

    xhr.send(JSON.stringify(data));
}

let emailCode = null;
function checkEmail(){
    var email = document.getElementById("forget-username").value;
    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(email)
    if(email===''){
        alert("用户名不能为空");
        return;
    }
    // else if(!re.test(String(email).toLowerCase())){
    //     alert("邮箱格式错误");
    //     return;
    // }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                emailCode=response.code;
            }
            else{
                alert("该用户似乎不存在");
                console.log(response)
            }
        }
    };

    xhr.open("POST", "http://localhost:5000/check_email", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var data = {
        email: email
    };
    xhr.send(JSON.stringify(data));
}
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
function checkCode(){
    const input = document.getElementById("forget-check-code").value;
    return emailCode===input && emailCode!=null
}