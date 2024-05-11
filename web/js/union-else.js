document.addEventListener('DOMContentLoaded', function() {
    var slideInInterface = document.getElementById('slideIn');
    var showForget = document.getElementById('to-page-forget');
    var hideButton = document.getElementById('hideButton');

    // 显示滑入界面的函数
    function showSlideIn() {
        slideInInterface.classList.add('active');
    }

    function hideSlideIn() {
        slideInInterface.classList.remove('active');
        slideInInterface.style.top = '-100%';
    }

    // 绑定事件到按钮上
    showForget.addEventListener('click', showSlideIn);
    hideButton.addEventListener('click', hideSlideIn);
});
$("#signUp").click(function(){
    $("#login-box").addClass('right-panel-active');
    $(':input', '#login').val('');
    $(':input', '#login').removeClass("focus");
})

$("#signIn").click(function(){
    $("#login-box").removeClass('right-panel-active')
    $(':input', '#register').val('');
    captcha();
})

$("#to-page-forget").click(function(){
    $(':input', '#login').val('');
})

$("#hideButton").click(function(){
    console.log('resetPassword called');
    $(':input', '#forget').val('');
    captcha();
})

$(".one-box input").on("focus blur", function(event) {
    if (event.type === "focus" || $(this).val() !== "") {
        $(this).addClass("focus");
    } else {
        $(this).removeClass("focus");
    }
});

$(".one-box span").on("click", function() {
    $(this).siblings("input").focus();
});

const queryParams = new URLSearchParams(window.location.search);
const action = queryParams.get('action'); // 获取 'action' 参数的值

if (action === 'login') {
    $("#login-box").removeClass('right-panel-active');
    console.log("login");
} else if (action === 'register') {
    $("#login-box").addClass('right-panel-active');
    console.log("register");
}