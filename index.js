function handleRewards(reward) {
    // console.log(reward);
    switch (reward) {
        case "Test":
            console.log("Test redeemed")
            break;
        case "Snack":
            console.log("Snack redeemed")
            break;
        case "Coffin Dance":
            console.log("Coffin Dance redeemed")
            break;
        default:
            console.log("Not handled")
            break;
    }
}