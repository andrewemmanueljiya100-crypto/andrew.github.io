function showLogin() {
    document.getElementById("login").classList.remove("hidden");
    document.getElementById("register").classList.add("hidden");

    document.getElementById("login").scrollIntoView({
        behavior: "smooth"
    });
}

function showRegister() {
    document.getElementById("register").classList.remove("hidden");
    document.getElementById("login").classList.add("hidden");

    document.getElementById("register").scrollIntoView({
        behavior: "smooth"
    });
}

document.getElementById("loginForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        alert(
            "This is a design demonstration. " +
            "Secure login authentication has not been connected."
        );
    }
);

document.getElementById("registerForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        alert(
            "The registration form is working visually, " +
            "but a secure account system is not yet connected."
        );
    }
);