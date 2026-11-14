const SUPABASE_URL = "https://sqxhlyrdknwuwafrgjcs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Cgv32Pj75QzhAicFJhCVCw_oljMobDS";

const supabaseConfigured =
    window.supabase &&
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("PASTE_") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("PASTE_");

const supabaseClient = supabaseConfigured
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const sections = ["login", "register", "forgotPassword", "updatePassword"];

function showSection(sectionId) {
    sections.forEach(id => {
        document.getElementById(id).classList.toggle("hidden", id !== sectionId);
    });

    clearMessage();
    document.getElementById(sectionId).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showLogin() {
    showSection("login");
}

function showRegister() {
    showSection("register");
}

function setMessage(message, type = "") {
    const el = document.getElementById("authMessage");
    el.textContent = message;
    el.className = "message" + (type ? " " + type : "");
}

function clearMessage() {
    setMessage("");
}

function requireSupabase() {
    if (!supabaseClient) {
        setMessage(
            "Supabase is not connected yet. Add your project URL and public key.",
            "error"
        );
        return false;
    }

    return true;
}

function setBusy(buttonId, busy, busyText, normalText) {
    const button = document.getElementById(buttonId);
    button.disabled = busy;
    button.textContent = busy ? busyText : normalText;
}

document.getElementById("showRegisterLink").addEventListener("click", event => {
    event.preventDefault();
    showRegister();
});

document.getElementById("showLoginLink").addEventListener("click", event => {
    event.preventDefault();
    showLogin();
});

document.getElementById("forgotPasswordLink").addEventListener("click", event => {
    event.preventDefault();
    document.getElementById("resetEmail").value =
        document.getElementById("loginEmail").value;

    showSection("forgotPassword");
});

document.getElementById("backToLoginFromForgot").addEventListener("click", event => {
    event.preventDefault();
    showLogin();
});

document.getElementById("registerForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!requireSupabase()) return;

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    setBusy("registerButton", true, "Creating account...", "Register");

    const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName }
        }
    });

    setBusy("registerButton", false, "Creating account...", "Register");

    if (error) {
        setMessage(error.message, "error");
    } else {
        setMessage("Registration submitted. Check your email for confirmation.", "success");
    }
});

document.getElementById("loginForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!requireSupabase()) return;

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    setBusy("loginButton", true, "Logging in...", "Log In");

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    setBusy("loginButton", false, "Logging in...", "Log In");

    if (error) {
        setMessage(error.message, "error");
    } else {
        setMessage("You are signed in. The protected dashboard still needs to be built.", "success");
    }
});

document.getElementById("forgotPasswordForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!requireSupabase()) return;

    const email = document.getElementById("resetEmail").value.trim();
    const redirectTo = window.location.origin + window.location.pathname;

    setBusy("sendResetButton", true, "Sending link...", "Send Reset Link");

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo
    });

    setBusy("sendResetButton", false, "Sending link...", "Send Reset Link");

    if (error) {
        setMessage(error.message, "error");
    } else {
        setMessage(
            "If an account matches that email, a password-reset link will be sent. Check your inbox and spam folder.",
            "success"
        );
    }
});

document.getElementById("updatePasswordForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!requireSupabase()) return;

    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
        setMessage("Your password must contain at least 8 characters.", "error");
        return;
    }

    if (password !== confirmPassword) {
        setMessage("The passwords do not match.", "error");
        return;
    }

    setBusy("updatePasswordButton", true, "Updating...", "Update Password");

    const { error } = await supabaseClient.auth.updateUser({
        password
    });

    setBusy("updatePasswordButton", false, "Updating...", "Update Password");

    if (error) {
        setMessage(error.message, "error");
    } else {
        setMessage("Your password has been updated. You can now log in.", "success");
        document.getElementById("updatePasswordForm").reset();
        showLogin();
    }
});

if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(event => {
        if (event === "PASSWORD_RECOVERY") {
            showSection("updatePassword");
            setMessage("Enter and confirm your new password.", "success");
        }
    });
}