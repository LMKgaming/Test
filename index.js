let numberTeam = 0;
let isBoarded = false;
let numberOfBoard = document.querySelector("input[id='number-board']")
numberOfBoard.onchange = function () {
    isBoarded = numberOfBoard.value === "" ? false : true
}
const LIST_INFO = [];
const LIST_MATCH = [];

let submitNumberTeam = document.querySelector(".submit-number");

submitNumberTeam.onclick = function () {
    numberTeam = document.querySelector("input[id='number']").value;
    console.log(numberTeam);
    createPlaceEnterName(numberTeam);
};

let sortArr = (arr) => {
    console.log(arr);
    let newArr = [];
    let length = arr.length;
    let temp = [];
    for (let i = 0; i < length; i++) {
        console.log(temp);
        if (temp.length === 0) {
            temp.push(i);
        } else {
            let tempLength = temp.length;
            for (let j = 0; j < tempLength; j++) {
                console.log("for 2");
                if (arr[temp[j]].point < arr[i].point) {
                    temp.splice(j, 0, i);
                    console.log("case 1");
                    break;
                } else if (
                    arr[temp[j]].point === arr[i].point &&
                    arr[temp[j]].win - arr[temp[j]].lose < arr[i].win - arr[i].lose
                ) {
                    temp.splice(j, 0, i);
                    console.log("case 2");
                    break;
                } else if (
                    arr[temp[j]].point === arr[i].point &&
                    arr[temp[j]].win - arr[temp[j]].lose === arr[i].win - arr[i].lose &&
                    arr[temp[j]].history[`${arr[i].name}`] < 0
                ) {
                    temp.splice(j, 0, i);
                    console.log("case 3");
                    break;
                } else if (j === tempLength - 1) {
                    temp.push(i);
                    console.log("case 4");
                    console.log(i, j);
                }
            }
        }
    }
    console.log(temp);
    for (let i of temp) {
        newArr.push(arr[i]);
    }
    console.log(newArr);
    return newArr;
};

let checkInfo = () => {
    LIST_INFO.length = 0;
    document.querySelectorAll(".ten-doi").forEach((item) => {
        console.log(item.value);
        LIST_INFO.push({
            name: item.value,
            table: null,
            match: 0,
            win: 0,
            lose: 0,
            point: 0,
            history: {},
        });
    });
    console.log(LIST_INFO);
    showAndUpdateChart(LIST_INFO);
};

let createPlaceEnterName = (number) => {
    let struct = (index) => `
        <div>
            <label for="doi${index}">Tên đội ${index}</label>
            <input class="ten-doi" id="doi${index}" type="text">
        </div>
    `;
    let string = "";
    for (let i = 1; i <= number; i++) {
        string += struct(i);
    }
    string += `
        <button onclick="checkInfo()">Xác nhận</button>
    `;
    let place = document.querySelector(".list-team");
    place.innerHTML = string;
};

let showAndUpdateMatch = () => {
    let struct = (data) => `
        <div style="display: flex; justify-content: space-around;flex: 1;">
            <h2>${data.first}</h2>
            <h2>${data.firstScore}</h2>
            <h2>-</h2>
            <h2>${data.secondScore}</h2>
            <h2>${data.second}</h2>
        </div>
    `;
    let string = LIST_MATCH.map((item) => struct(item));
    document.querySelector(".list-match").innerHTML = string;
};

let showAndUpdateChart = (dataList) => {
    console.log("re render chart");
    let firstString = `
        <div style="display: flex; justify-content: space-around;">
            <h2>Tên đội</h2>
            <h2>Số trận</h2>
            <h2>Số trận thắng</h2>
            <h2>Số trận thua</h2>
            <h2>Hiệu Số</h2>
            <h2>Điểm</h2>
        </div>
    `;
    let struct = (data) => `
        <div style="display: flex; justify-content: space-around;">
            <h4>${data.name}</h4>
            <h4>${data.match}</h4>
            <h4>${data.win}</h4>
            <h4>${data.lose}</h4>
            <h4>${data.win - data.lose}</h4>
            <h4>${data.point}</h4>
        </div>
    `;
    let lastString = sortArr(dataList).map((item) => struct(item));
    document.querySelector(".chart").innerHTML = firstString + lastString.join("");
};

let addMatch = () => {
    if (!LIST_INFO.length) return false;
    console.log("First cond");
    let firstTeam = document.querySelector("input[id='ten-doi-1']").value;
    let secondTeam = document.querySelector("input[id='ten-doi-2']").value;
    let firstTeamScore = Number(document.querySelector("input[id='point-1']").value);
    let secondTeamScore = Number(document.querySelector("input[id='point-2']").value);
    console.log(firstTeam, secondTeam, firstTeamScore, secondTeamScore);
    if (!firstTeam || !secondTeam) return false;
    let firstTeamData = LIST_INFO.find((item) => item.name === firstTeam);
    let secondTeamData = LIST_INFO.find((item) => item.name === secondTeam);
    console.log(firstTeamData, secondTeamData);
    if (!firstTeamData || !secondTeamData) return false;
    firstTeamData.match += 1;
    secondTeamData.match += 1;
    firstTeamData.win += firstTeamScore;
    firstTeamData.lose += secondTeamScore;
    secondTeamData.win += secondTeamScore;
    secondTeamData.lose += firstTeamScore;
    if (secondTeamScore - firstTeamScore > 0) {
        secondTeamData.point += 2;
    } else if (secondTeamScore === firstTeamScore) {
        secondTeamData.point += 1;
        firstTeamData.point += 1;
    } else {
        firstTeamData.point += 2;
    }
    firstTeamData.history[`${secondTeamData.name}`] = firstTeamScore - secondTeamScore;
    secondTeamData.history[`${secondTeamData.name}`] = secondTeamScore - firstTeamScore;
    LIST_MATCH.push({
        first: firstTeamData.name,
        second: secondTeamData.name,
        firstScore: firstTeamScore,
        secondScore: secondTeamScore,
    });
    console.log("first Team Data", firstTeamData);
    console.log("second Team Data", secondTeamData);
    return true;
};

let addMatchBoard = () => {
    if (!LIST_INFO.length) return false;
    let firstTeam = document.querySelector("input[id='ten-doi-1']").value;
    let secondTeam = document.querySelector("input[id='ten-doi-2']").value;
    let firstTeamScore = Number(document.querySelector("input[id='point-1']").value);
    let secondTeamScore = Number(document.querySelector("input[id='point-2']").value);
    if (!firstTeam || !secondTeam) return false;
    let firstTeamData = LIST_INFO.find((item) => item.name === firstTeam);
    let secondTeamData = LIST_INFO.find((item) => item.name === secondTeam);
    console.log(firstTeamData, secondTeamData);
    if (!firstTeamData || !secondTeamData || firstTeamData.match !== secondTeamData.match) return false;
    firstTeamData.match += 1;
    secondTeamData.match += 1;
    firstTeamData.win += firstTeamScore;
    firstTeamData.lose += secondTeamScore;
    secondTeamData.win += secondTeamScore;
    secondTeamData.lose += firstTeamScore;
    if (secondTeamScore - firstTeamScore > 0) {
        secondTeamData.point += 2;
    } else if (secondTeamScore === firstTeamScore) {
        secondTeamData.point += 1;
        firstTeamData.point += 1;
    } else {
        firstTeamData.point += 2;
    }
    firstTeamData.history[`${secondTeamData.name}`] = firstTeamScore - secondTeamScore;
    secondTeamData.history[`${secondTeamData.name}`] = secondTeamScore - firstTeamScore;
    LIST_MATCH.push({
        first: firstTeamData.name,
        second: secondTeamData.name,
        firstScore: firstTeamScore,
        secondScore: secondTeamScore,
    });
    console.log("first Team Data", firstTeamData);
    console.log("second Team Data", secondTeamData);
    return true;
}

let submitMatch = () => {
    if (isBoarded) {
        let bool = addMatchBoard()
        bool && showAndUpdateChartBoard(LIST_INFO)
        bool && showAndUpdateMatch()
    } else {
        let bool = addMatch();
        bool && showAndUpdateChart(LIST_INFO);
        bool && showAndUpdateMatch();
        console.log(LIST_INFO);
    }
};

let submitMatchBtn = document.querySelector(".submit-match");
submitMatchBtn.onclick = submitMatch;

let createPlaceEnterNameBoard = (numberTeam, numberBoard) => {
    let struct = (index) => `
        <div>
            <h3>Bảng ${index}</h3>
            ###
        </div>
    `;
    let contentStruct = (index, board) => `
        <div>
            <label for="bang${board}-doi${index}">Tên đội ${index}</label>
            <input name="${board}" class="ten-doi" id="bang${board}-doi${index}" type="text">
        </div>
    `;
    let string = "";
    let subString = "";
    for (let i = 1; i <= numberBoard; i++) {
        for (let j = 1; j <= numberTeam / numberBoard; j++) {
            subString += contentStruct(j, i);
        }
        string = string + struct(i).replace("###", subString);
        subString = "";
    }
    string += `
        <button onclick="checkInfoBoard()">Xác nhận</button>
    `;
    let place = document.querySelector(".list-team");
    place.innerHTML = string;
};

let submitBoard = document.querySelector(".submit-number-board");
submitBoard.onclick = function () {
    let numberTeam = document.querySelector("input[id='number']").value;
    let numberBoard = document.querySelector("input[id='number-board']").value;
    createPlaceEnterNameBoard(Number(numberTeam), Number(numberBoard));
};

let showAndUpdateChartEachBoard = (eachBoardList) => {
    let firstString = `
        <div style="display: flex; justify-content: space-around;">
            <h4>Tên đội</h4>
            <h4>Số trận</h4>
            <h4>Số trận thắng</h4>
            <h4>Số trận thua</h4>
            <h4>Hiệu Số</h4>
            <h4>Điểm</h4>
        </div>
    `;
    let contentStruct = (data) => `
        <div style="display: flex; justify-content: space-around;">
            <h4>${data.name}</h4>
            <h4>${data.match}</h4>
            <h4>${data.win}</h4>
            <h4>${data.lose}</h4>
            <h4>${data.win - data.lose}</h4>
            <h4>${data.point}</h4>
        </div>
    `;
    let lastString = sortArr(eachBoardList).map((item) => contentStruct(item));

    return firstString + lastString.join("");
};

let showAndUpdateChartBoard = (dataList) => {
    let finalStrings = "";
    let numberBoard = dataList[dataList.length - 1].table;
    let numberTeamOfBoard = dataList.length / numberBoard;
    for (let i = 1; i <= numberBoard; i++) {
        let subStrings = showAndUpdateChartEachBoard(
            dataList.slice(numberTeamOfBoard * i - numberTeamOfBoard, numberTeamOfBoard * i)
        );
        finalStrings += `
            <div style="border: 1px solid black">
                <h3>Bảng ${i}</h3>
                ${subStrings}
            </div>
        `;
    }

    document.querySelector(".chart").innerHTML = finalStrings;
};

let checkInfoBoard = () => {
    LIST_INFO.length = 0;
    document.querySelectorAll(".ten-doi").forEach((item) => {
        console.log(item.value);
        LIST_INFO.push({
            name: item.value,
            table: Number(item.name),
            match: 0,
            win: 0,
            lose: 0,
            point: 0,
            history: {},
        });
    });
    console.log(LIST_INFO);
    showAndUpdateChartBoard(LIST_INFO);
};
