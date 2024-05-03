pages = 0
page_contents = []
page_array = []
GLOBAL_center = null
currentPage = 0
async function getThumbsJSON(){
    x = await fetch("https://raw.githubusercontent.com/cdc-sys/level-thumbnails/main/thumbnails.json")
    y = await x.text()
    z = JSON.parse(y)
    return z
}
theJSON = {};
function init(){
    center = document.createElement("center")
    document.body.appendChild(center)
    GLOBAL_center = center;
}
function setupPages(){
    page_contents = []
    page_array = []
    id = 0;
    for (var i = 0; i<pages;i++){
        for (var i2 = 0; i2<25;i2++){
            page_contents.push(theJSON.level_ids[id])
            id+=1;
        }
        page_array.push(page_contents)
                page_contents = []
    }
}
function renderPage(index){
    currentPage = index;
    renderingPage = page_array[index]
    div = document.createElement("div")
    div.id = "page-view"
    h2 = document.createElement("h2")
    h2.innerText = "Thumbnails"
    div.appendChild(h2)
    for (img of renderingPage){
        image = document.createElement("img")
        image.src = `https://raw.githubusercontent.com/cdc-sys/level-thumbnails/main/thumbs/${img}.png`
        image.width = 256
        image.height = 144
        div.appendChild(image)
    }
    GLOBAL_center.appendChild(div)
}
function renderPageButtons(){
    existingButtonDiv = document.getElementById("button-view")
    if (existingButtonDiv != undefined){
        document.body.removeChild(existingButtonDiv)
    }
    div = document.createElement("div")
    div.id = "button-view"
    h2 = document.createElement("h2")
    h2.innerText = "Pages"
    div.appendChild(h2)
    for (page in page_array){
        button = document.createElement("button")
        pageNumber = `${parseInt(page) + 1}`
        if (parseInt(page) != currentPage){
        button.innerHTML = pageNumber
        }
        if (parseInt(page) == currentPage){
        button.innerHTML = "<strong>" + pageNumber + "</strong>";
        }
        button.setAttribute("onclick",`renderWithPage(${page});`)
        div.appendChild(button)
    }
    GLOBAL_center.appendChild(div)
}
function findLevelAndOpenPage(id){
    for (page of page_array){
        for (level of page){
            if (level == id){
                index = page_array.indexOf(page);
                renderWithPage(index);
                return index;
            }
        }
    }
}
function onSubmitButton(){
    input = document.getElementById("levelid-input")
    id = input.value
    findLevelAndOpenPage(id);
}
function renderGotoUI(){
    existingButtonDiv = document.getElementById("goto-view")
    if (existingButtonDiv != undefined){
        document.body.removeChild(existingButtonDiv)
    }
    div = document.createElement("div")
    div.id = "goto-view"
    h2 = document.createElement("h2")
    h2.innerText = "Go To Level"
    div.appendChild(h2)
    input = document.createElement("input")
    input.id = "levelid-input"
    button = document.createElement("button")
    button.id = "submit-button"
    button.setAttribute("onclick","onSubmitButton()")
    button.innerText = "GOTO";
    div.appendChild(input)
    div.appendChild(button)
    GLOBAL_center.appendChild(div)
}
function renderWithPage(index){
    document.body.innerHTML = ""
    warn = document.createElement("warning")
    warn.innerHTML = "NOTE: This only shows the thumbnails as of " + (new Date(theJSON.lastUpdated*1000)).toLocaleString() + " and will <strong>NOT</strong> be updated due to technical limitations, thanks for understanding.";
    document.body.appendChild(warn);
    init();
    renderPage(index)
    renderPageButtons();
    renderGotoUI();
}
function getTotalPageCount(pageSize){
    return Math.ceil(theJSON.level_ids.length/pageSize);
}

getThumbsJSON().then((value) => {
  theJSON = value;
    pages = getTotalPageCount(25);
    setupPages();
    renderWithPage(0);
})
