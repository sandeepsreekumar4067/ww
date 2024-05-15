const username = document.getElementById("username");
const password = document.getElementById("password");
const loginbutton = document.getElementById("loginbutton");
const loginButton = document.getElementById('loginBtn');

const signinButton = document.getElementById('signinBtn');
const logoutButton = document.getElementById('logoutBtn');
let userIsLoggedIn = false;
loginbutton.addEventListener("click", async (e) => {
    console.log("clicked");
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });

        if (response.ok) {
            const resp = await response.json()
            alert('Login Successful');
            window.location.href = "index.html";
            localStorage.setItem(
                'token',resp.token
            )
        } else {
            const responseData = await response.json();
            alert(responseData.error || "Login Failed");
        }

    } catch (err) {
        console.error("Error Occurred: ", err);
        alert("An error occurred during login");
    }
});





//user logged in checking logic 

if (userIsLoggedIn) {
    // If the user is logged in, hide login and signin buttons, show logout button
    loginButton.style.display = 'none';
    signinButton.style.display = 'none';
    logoutButton.style.display = 'inline-block'; // or 'block' depending on your styling
} else {
    // If the user is not logged in, hide logout button, show login and signin buttons
    loginButton.style.display = 'inline-block'; // or 'block' depending on your styling
    signinButton.style.display = 'inline-block'; // or 'block' depending on your styling
    logoutButton.style.display = 'none';
}

// Add event listener for logout button (you need to implement the logout functionality)
logoutButton.addEventListener('click', () => {
    // Implement logout logic here
    alert('Logout clicked');
});
