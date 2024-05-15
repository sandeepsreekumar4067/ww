
const username = document.getElementById("username");
const password = document.getElementById("password");
const signupbutton = document.getElementById("signupForm");
const loginButton = document.getElementById('loginBtn');
const signinButton = document.getElementById('signupbtn');
const logoutButton = document.getElementById('logoutBtn');
let userIsLoggedIn = false; // Replace with your actual authentication logic
signupbutton.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/signin", {
            method: "POST",
            body: JSON.stringify({
                username: username.value,
                password: password.value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert("Successful");
            window.location.href = "index.html";
            userIsLoggedIn = true
            const message =  await response.json()
            localStorage.setItem("token",message.token)
        } else {
            const responseData = await response.json();
            if (response.status === 400) {
                // Duplicate username error
                alert(responseData.error);
            } else {
                // Other errors
                alert("Failed");
            }
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred");
    }
});


//

if ( userIsLoggedIn) {
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

