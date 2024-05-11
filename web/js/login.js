
document.getElementById("login").addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("log")
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const captcha_code = document.getElementById("captcha_code").value;
    if(!validateCaptcha(captcha_code)) {
        document.getElementById("captcha_code").value='';
        console.log("wrong captcha");
        captcha();
        alert("验证码错误");
        return;
    }
    if (!validateInput(username, password)) {
        alert("账号或密码错误");
        console.log("wrong password")
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                alert("登陆成功");
            } else {
                alert("账号或密码错误")
            }
        }
    };

    xhr.open("POST", "http://localhost:5000/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var data = {
        username: username,
        password: password
    };

    xhr.send(JSON.stringify(data));
});

let captchaCode;

function captcha() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(xhr.responseText);
            var captchaImage = document.getElementById("captcha_image");
            if (xhr.status === 200) {
                captchaImage.src = 'data:image/png;base64,' + response.image_64;
                captchaCode=response.code.toLowerCase();
            } else {
                captchaImage.src = null;
            }
        }
    };

    xhr.open("POST", "http://localhost:5000/captcha", true);
    xhr.setRequestHeader("Content-Type", "application/json");


    xhr.send(JSON.stringify());
}
function validateInput(username, password) {
    // 使用正则表达式进行验证
    var regex = /^[a-zA-Z0-9]{1,16}$/;

    if (regex.test(username) && regex.test(password)) {
        // 输入合法
        return true;
    } else {
        // 输入不合法
        return false;
    }
}
function validateCaptcha(input) {
    return input.toLowerCase() === captchaCode;

}

captcha()

