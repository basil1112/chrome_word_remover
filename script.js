


console.log('***************content script******************')
let BASE_URL = "http://localhost:3000";

var ACTION = Object.freeze({
  REPLACE: 1,
  REMOVE: 0,
  BlUR: 2
})


let found_bully = false;

let bullyWordArray = [];
let supportEmail = "";

let temp_url = undefined;

var keys = []
var values = []

function loadFromAPI() {

  fetch(`${BASE_URL}/getAllKeywords`)
    .then(response => response.json())
    .then(data => {

      let value = JSON.parse(JSON.stringify(data));
      console.log("Value >>", value);

      replacePageWords(value);

    });
}

loadFromAPI();



function replacePageWords(keywordsArray) {
  //...
  let isLast = false;
  for (var i = 0; i < keywordsArray.length; i++) {
    isLast = i == keywordsArray.length - 1 ? true : false;
    keys.push(keywordsArray[i].keyword);
    values.push(keywordsArray[i].replace);
    replaceWord(keywordsArray[i], isLast);
  }

}
async function replaceWord(obj, isLast) {

  if (temp_url == undefined) {
    await chrome.storage.sync.get({
      activeURL: {}
    }, function (items) {
      console.log("ITEM", items)
      temp_url = items.activeURL.tabURL;

      chrome.storage.sync.get({
        actionToTake: {}
      }, function (items) {
        if (items) {
          obj.type = items.actionToTake.type;
          console.log("ACTION", obj.type);
          process(obj, isLast, temp_url)
        }
      });

    });
  }
  else {
    chrome.storage.sync.get({
      actionToTake: {}
    }, function (items) {
      if (items) {
        obj.type = items.actionToTake.type;
        process(obj, isLast, temp_url)
      }
    });
  }
}

String.prototype.replaceArray = function (find, replace) {
  var replaceString = this;
  var regex;
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "gi");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

function process(obj, isLast, temp_url) {

  if (isLast) {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];
        if (node.nodeType === 3) {

          if (obj.type == '0') {
            //remove
            for (k = 0; k < values.length; k++) {
              values[k] = "*****";
            }
            var text = node.nodeValue;
            var replacedText = text.replaceArray(keys, values);
            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
              // Convert to lowercase
              $text = text.toLowerCase();
              // replace unnesessary chars. leave only chars, numbers and space
              $text = $text.replace(/[^\w\d ]/g, '');
              var result = $text.split(' ');
              // remove $commonWords
              result = result.filter(function (word) {

                let value = keys.map(v => v.toLowerCase())
                return value.indexOf(word) > -1;
              });

              let unique = [...new Set(result)];
              if (unique.length > 0) {
                isPresent = containsAny(bullyWordArray, unique);
                console.log(isPresent);
                if (!isPresent) {
                  bullyWordArray.push({
                    word: unique.toString(),
                    url: temp_url
                  })
                }
              }
            }
          }
          else if (obj.type == '1') {
            //replace
            var text = node.nodeValue;
            var replacedText = text.replaceArray(keys, values);
            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
              // Convert to lowercase
              $text = text.toLowerCase();
              // replace unnesessary chars. leave only chars, numbers and space
              $text = $text.replace(/[^\w\d ]/g, '');
              var result = $text.split(' ');
              // remove $commonWords
              result = result.filter(function (word) {

                let value = keys.map(v => v.toLowerCase())
                return value.indexOf(word) > -1;
              });

              let unique = [...new Set(result)];
              if (unique.length > 0) {
                isPresent = containsAny(bullyWordArray, unique);
                console.log(isPresent);
                if (!isPresent) {
                  bullyWordArray.push({
                    word: unique.toString(),
                    url: temp_url
                  })
                }
              }
            }
          }
          else if (obj.type == '2') {
            //blur
            for (k = 0; k < values.length; k++) {
              values[k] = "blur"
            }
            var text = node.nodeValue;
            var replacedText = text.replaceArray(keys, values);
            if (replacedText !== text) {
              element.style.color = 'transparent';
              element.style.textShadow = '0 0 8px rgba(0,0,0,0.5)';

              // Convert to lowercase
              $text = text.toLowerCase();
              // replace unnesessary chars. leave only chars, numbers and space
              $text = $text.replace(/[^\w\d ]/g, '');
              var result = $text.split(' ');
              // remove $commonWords
              result = result.filter(function (word) {

                let value = keys.map(v => v.toLowerCase())
                return value.indexOf(word) > -1;
              });

              let unique = [...new Set(result)];
              if (unique.length > 0) {
                isPresent = containsAny(bullyWordArray, unique);
                console.log(isPresent);
                if (!isPresent) {
                  bullyWordArray.push({
                    word: unique.toString(),
                    url: temp_url
                  })
                }
              }

            }
          }
          else {
            /* 
                        for (k = 0; k < values.length; k++) {
                          values[k] = "blur"
                        }
                        var text = node.nodeValue;
                        var replacedText = text.replaceArray(keys, values);
                        if (replacedText !== text) {
                          element.style.color = 'transparent';
                          element.style.textShadow = '0 0 8px rgba(0,0,0,0.5)';
            
                          // Convert to lowercase
                          $text = text.toLowerCase();
                          // replace unnesessary chars. leave only chars, numbers and space
                          $text = $text.replace(/[^\w\d ]/g, '');
                          var result = $text.split(' ');
                          // remove $commonWords
                          result = result.filter(function (word) {
            
                            let value = keys.map(v => v.toLowerCase())
                            return value.indexOf(word) > -1;
                          });
            
                          let unique = [...new Set(result)];
                          if (unique.length > 0) {
                            isPresent = containsAny(bullyWordArray, unique);
                            console.log(isPresent);
                            if (!isPresent) {
                              bullyWordArray.push({
                                word: unique.toString(),
                                url: temp_url
                              })
                            }
                          }
                        } */

            var text = node.nodeValue;
            var replacedText = text.replaceArray(keys, values);
            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
              // Convert to lowercase
              $text = text.toLowerCase();
              // replace unnesessary chars. leave only chars, numbers and space
              $text = $text.replace(/[^\w\d ]/g, '');
              var result = $text.split(' ');
              // remove $commonWords
              result = result.filter(function (word) {

                let value = keys.map(v => v.toLowerCase())
                return value.indexOf(word) > -1;
              });

              let unique = [...new Set(result)];
              if (unique.length > 0) {
                isPresent = containsAny(bullyWordArray, unique);
                console.log(isPresent);
                if (!isPresent) {
                  bullyWordArray.push({
                    word: unique.toString(),
                    url: temp_url
                  })
                }
              }
            }

          }
        }
      }
    }

    if (bullyWordArray.length > 0) {

      const unique = [...new Map(bullyWordArray.map(item => [item["word"], item])).values()];

      //found bully words send all mails 
      let body = "We found some bully words in this website, please find the following for reference";
      for (i = 0; i < unique.length; i++) {
        //construct email word
        body = body + " WORD : \n" + unique[i].word + "  \n URL : " + unique[i].url.substring(0, 25);
      }

      if (unique[0].url.indexOf("youtube") > 0) {
        supportEmail = "support@you.tube.in"
        foundBully(body, supportEmail)
      } else if (unique[0].url.indexOf("facebook") > 0) {
        supportEmail = "facebook@facevook.in"
        foundBully(body, supportEmail)
      }
      else if (unique[0].url.indexOf("instagram") > 0) {
        supportEmail = "facebook@facevook.in"
        foundBully(body, supportEmail)
      }
      else {
        supportEmail = "custodian@gmail.com"
        foundBully(body, supportEmail)
      }

    }

  }
}


function containsAny(source, target) {
  var result = source.filter(function (item) { return target.indexOf(item) > -1 });
  return (result.length > 0);
}



/**
 * method which opens mail client
 * also set the word we found
 * 
 * @param {method} word 
 */
function foundBully(body, supportEmail) {

  chrome.storage.sync.get({
    reportAction: {}
  }, function (items) {
    if (items) {
      console.log("send report", items);
      if (items.reportAction.sendReport == 1) {
        window.location.href = `mailto:${supportEmail}?subject=Buggy Word&body=${body}`;
      }
    }
  });


}



