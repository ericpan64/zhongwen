function hasChinese(value) {
    // Return True if string has Chinese character, false otherwise
    // Chinese should be unicode, so can search that way
    // https://stackoverflow.com/questions/11206443/how-can-i-check-if-variable-contains-chinese-japanese-characters
    "use strict";
    var regex = /[\u3400-\u9FBF]/;
    if (value.toString().match(regex)) {
        return true;
    } // regex in match function checking unicode (also counts for Japanese, will need to remove)
    return false;
}

function postAjax(url, data) { // https://plainjs.com/javascript/ajax/send-ajax-get-and-post-requests-47/
    /* Posts json data to URL, logs in console if successful */
    var params = data;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function(){
        console.log(params); // logs data being sent
        console.log(this.responseText); // logs response text from XMLHttpRequest (which hasn't done anything yet)
      };
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(params);
    return xhr;
}

// Posts to CRM website
function postToCRM(clickData){
    console.log(clickData.selectionText); // print selectionText
    if (clickData.menuItemId == "exportToCRM" && clickData.selectionText){
        if (hasChinese(clickData.selectionText)){
            chrome.identity.getProfileUserInfo(function(userInfo){
                var user = userInfo.id; // Unique user ID if user is logged-in -- otherwise none
                //Get URL from current tab
                chrome.tabs.query({'active':true, 'lastFocusedWindow':true}, function(tabs){
                    var text_json = JSON.stringify({
                    "user": user,
                    "body": clickData.selectionText,
                    "title": tabs[0].title,
                    "URL": tabs[0].url
                    }); // converts to JSON string, see https://stackoverflow.com/questions/8294088/javascript-object-vs-json
                    console.log(text_json); // print current tab

                    // Uploads text (POST request)
                    postAjax("http:localhost:5000/uploadText",text_json)

                    // Open New Tab to document
                    var newURL = "http:localhost:5000/"; // Change this to landing page
                    chrome.tabs.create({url: newURL});
                });
            });
        }
    }
}

// Create Context Menu item
chrome.contextMenus.create({
    id: "exportToCRM",
    title: "Export text to 中文读几",
    contexts: ["selection"] // more contexts available on Chrome developer webpage
}); 

chrome.contextMenus.onClicked.addListener(postToCRM);