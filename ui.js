pages = 0
page_contents = []
page_array = []
async function getThumbsJSON(){
    x = await fetch("https://raw.githubusercontent.com/cdc-sys/level-thumbnails/main/thumbnails.json")
    y = await x.text()
    z = JSON.parse(y)
    return z
}
theJSON = {};

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
    renderingPage = page_array[index]
    div = document.createElement("div")
    div.id = "page-view"
    for (img of renderingPage){
        image = document.createElement("img")
        image.src = `https://cdc-sys.github.io/level-thumbnails/thumbs/${img}.png`
        image.width = 256
        image.height = 144
        div.appendChild(image)
    }
    document.body.appendChild(div)
}
function renderPageButtons(){
    existingButtonDiv = document.getElementById("button-view")
    if (existingButtonDiv != undefined){
        document.body.removeChild(existingButtonDiv)
    }
    div = document.createElement("div")
    div.id = "button-view"
    for (page in page_array){
        button = document.createElement("button")
        button.innerText = parseInt(page) + 1;
        button.setAttribute("onclick",`renderWithPage(${page});`)
        div.appendChild(button)
    }
    document.body.appendChild(div)
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
    input = document.createElement("input")
    input.id = "levelid-input"
    button = document.createElement("button")
    button.id = "submit-button"
    button.setAttribute("onclick","onSubmitButton()")
    button.innerText = "GOTO";
    div.appendChild(input)
    div.appendChild(button)
    document.body.appendChild(div)
}
function renderWithPage(index){
    document.body.innerHTML = ""
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
