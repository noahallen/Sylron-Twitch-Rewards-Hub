function handleRewards(reward, extra) {
    // console.log(reward);
    switch (reward) {
        case "Test":
            console.log("Test redeemed")
            fetchToServer("blue");
            break;
        case "Snack":
            console.log("Snack redeemed")
            break;
        case "Coffin Dance":
            console.log("Coffin Dance redeemed")
            break;
        case "Change Lights to Blue":
            console.log("Blue lights redeemed")
            fetchToServer("blue");
            break;
        case "Change Lights to Red":
            console.log("Red lights redeemed")
            fetchToServer("red");
            break;
        case "Change Lights to Green":
            console.log("Green lights redeemed")
            fetchToServer("green");
            break;
        case "Test With Input":
            console.log("Custom lights redeemed")
            fetchToServer("custom/" + extra);
            break;
        case "Change Lights to Custom Color":
            console.log("Custom lights redeemed")
            fetchToServer("custom/" + extra);
            break;
        default:
            console.log("Not handled")
            break;
    }
}



function fetchToServer(fetchID) {
    fetch("http://" + '127.0.0.1' + ":" + '3000' + "/" + fetchID)
        .then(response => response.json())
        .then(obj => {
            console.log(obj.results);
            document.getElementById("BodyID").innerHTML += obj.results + "<br/>";
        })
        .catch(err => console.log(err));
}