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

// To-Do: need to fix this
function httpPostAsync(theUrl, callback)
{
    // example from GET request: https://stackoverflow.com/questions/247483/http-get-request-in-javascript
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// Posts to CRM website
function postToCRM(clickData){
    console.log(clickData.selectionText); // print selectionText
    if (clickData.menuItemId == "exportToCRM" && clickData.selectionText){
        if (isChinese(clickData.selectionText)){
            var user = 'User1'; // Need to change this later (Google Account)
            //Get URL from current tab
            chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, function(tabs){
                var text_json = {
                "user": user,
                "body": clickData.selectionText,
                "title": tabs[0].title,
                "URL": tabs[0].url
                };
                console.log(text_json); // print current tab
            });
            
            /*
            // Open New Tab
            var newURL = "localhost:5000";
            chrome.tabs.create({url: newURL});
            */
        }
    }
}

// Create Context Menu item
chrome.contextMenus.create({
    "id": "exportToCRM",
    "title": "Export text to 中文读几",
    "contexts": ["selection"] // more contexts available on Chrome developer webpage
}); 

chrome.contextMenus.onClicked.addListener(postToCRM);