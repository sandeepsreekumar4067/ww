const district = document.getElementsByClassName("district")
const replace = document.getElementById("district-name-container")




console.log("tested");
var test = document.querySelectorAll(".district");
var test2 = document.querySelectorAll(".district-2");
// test.onclick = function(){
//     console.log("clicked");
//     console.log(test.innerText);
// }
// Add a click event listener to each district container
test.forEach(function(container) {
    console.log("clicked");
    container.addEventListener('click', function() {
        // Access the value inside the clicked district-container
        // var districtValue = container.innerText.trim();
        console.log('Clicked District:', container.textContent.trim());
        localStorage.setItem("district",container.textContent.trim())

        // You can do something with the districtValue here, like redirecting or displaying information.
    });
});

test2.forEach(function(container) {
    console.log("clicked");
    container.addEventListener('click', function() {
        // Access the value inside the clicked district-container
        // var districtValue = container.innerText.trim();
        console.log('Clicked District:', container.textContent);
        localStorage.setItem("district",container.textContent.trim())


        // You can do something with the districtValue here, like redirecting or displaying information.
    });
});


