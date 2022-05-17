

var report = document.getElementById("report_bully_toggle");

var replace = document.getElementById("replace_toggle");
var blurr = document.getElementById("blur_toggle");
var remove = document.getElementById("remove_togle");


var ACTION = Object.freeze({
  REPLACE: 1,
  REMOVE: 0,
  BlUR: 2
})


replace.addEventListener("click", function () {
  if (replace.checked === true) {
    blurr.checked = false;
    remove.checked = false;
    setAction(ACTION.REPLACE);
  }
});
blurr.addEventListener("click", function () {
  if (blurr.checked === true) {
    replace.checked = false;
    remove.checked = false;
    setAction(ACTION.BlUR)
  }
});

remove.addEventListener("click", function () {
  if (remove.checked === true) {
    blurr.checked = false;
    replace.checked = false;
    setAction(ACTION.REMOVE)
  }
});

report.addEventListener("click", function () {
  if (report.checked === true) {
    console.log("writing to report")
    setReport(1);
  } else {
    console.log("writing to report")
    setReport(0);
  }
});




function setAction(value) {
  chrome.storage.sync.set({
    actionToTake: {
      type: value,
    }
  }, function () {
    console.log("written to chrome store to take action");
  });
}


function setReport(value) {
  chrome.storage.sync.set({
    reportAction: {
      sendReport: value,
    }
  }, function () {
    chrome.storage.sync.get({
      reportAction: {}
    }, function (items) {
      console.log("written to chrome store to take action",items);
    });
   
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {

  chrome.storage.sync.get({
    actionToTake: {}
  }, function (items) {
    if (items) {
      if (items.actionToTake.type == ACTION.REPLACE) {
        replace.checked = true;
      } else if (items.actionToTake.type == ACTION.REMOVE) {
        remove.checked = true;
      }
      else if (items.actionToTake.type == ACTION.BlUR) {
        blurr.checked = true;
      }
      else {
        setAction(ACTION.REMOVE);
        remove.checked = true;
      }
    }
  });

  chrome.storage.sync.get({
    reportAction: {}
  }, function (items) {
    if (items) {

      console.log("items.reportAction.sendReport",items.reportAction.sendReport)

      if (items.reportAction.sendReport == 1) {
        console.log("setting here");
        report.checked = true;
      } else if (items.actionToTake.type == 0) {
        report.checked = false;
      }
      else {
        report.checked = false;
      }
    }
  });

}


document.addEventListener('DOMContentLoaded', restore_options);

