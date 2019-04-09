var contextMenuItem = {
    "id": "exportToCRM",
    "title": "Export text to 中文读几",
    "contexts": ["selection"] // more contexts available on Chrome developer webpage
};
chrome.contextMenus.create(contextMenuItem);


function isChinese(value) {
    // Return True if is Chinese character, false otherwise
    // Chinese should be unicode, so can search that way
    // https://stackoverflow.com/questions/11206443/how-can-i-check-if-variable-contains-chinese-japanese-characters
    "use strict";
    var regex = /[\u3400-\u9FBF]/;
    if (value.toString().match(regex)) {
        return true;
    } // regex in match function checking unicode (also counts for Japanese, will need to remove)
    return false;
}

chrome.contextMenus.onClicked.addListener(function(clickData){
    if (clickData.menuItemId == "exportToCRM" && clickData.selectionText){
        if (isChinese(clickData.selectionText)){
            var user = 'User1'; // Need to change this later (Google Account)
            var text = clickData.selectionText;
            var URL = window.location.href; // Check if this works
            var text_json = {
                "user": user,
                "body": text,
                "context": URL
            };

            // Open Local Host url with clickData.selectionText passed somehow
            // Looks like an HTTP request, follow tutorial:
            // HTTP POST method, have
            const xhttp = new XMLHttpRequest();
            const destURL = 'localhost:5000/list/upload'; // local server URL
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(xhttp.text);
                }
            }
            xhttp.open("POST",text_json,true)
            xhttp.send();
            //chrome.storage.sync.set({json here})
        }
    }
})
