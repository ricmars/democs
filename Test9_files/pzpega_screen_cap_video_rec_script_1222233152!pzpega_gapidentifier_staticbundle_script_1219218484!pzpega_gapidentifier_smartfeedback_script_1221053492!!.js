var $pNamespace = pega.namespace;
$pNamespace("pega.screen");
pega.screen.api = (function() {
    var top_win = top;
    var top_doc = top_win.document;
    var top_body = top_doc.body;
    var fbbusyIndicator = new pega.ui.busyIndicator("", true, top_body, 0);
    var capturedContent = "";
    /*var isVideoCaptureInProgress = false;
      var stopOnly = false;*/
    var onExtensionAddCallback = function() {};
    var publicAPI = {
        eventsLoaded: false,
        init: function(callback) {
            if (typeof callback === "function") {
                onExtensionAddCallback = callback;
            }
        },
        captureSnapshot: function(event, onStartCallback, onCancelCallback, onCompleteCallback,
            activityClass, activityName, activityParams) {
            this.clearCallbacks();
            var activityDetails = utility.startup(onStartCallback, activityClass, activityName,
                activityParams);
            utility.showScreenCaptureOverlay(onCancelCallback, onCompleteCallback, activityDetails);
        },
        captureInit: function(onCompleteCallback, activityDetails) {
            snapshot.capture(onCompleteCallback, activityDetails)
        },
        captureCompleted: function(eventFromExtension) {
            snapshot.captureCompleted(eventFromExtension);
        },
        recordVideo: function(event, onStartCallback, onCancelCallback, onCompleteCallback, activityClass,
            activityName, activityParams) {
            this.clearCallbacks();
            var activityDetails = utility.startup(onStartCallback, activityClass, activityName,
                activityParams);
            video.recordInit(onCancelCallback, onCompleteCallback, activityDetails);
        },
        onCancelCallback: function(mediaType) {
            if (mediaType === "video") {
                video.onCancelCallback();
            }
        },
        clearCallbacks: function() {
            this.onCancelCallback = function(mediaType) {
                if (mediaType === "video") {
                    video.onCancelCallback();
                }
            };
            snapshot.onCompleteCallback = function() {};
            video.onCompleteCallback = function() {};
            video.onCancelCallback = function() {};
            snapshot.activityDetails = "";
            video.activityDetails = "";
            capturedContent = "";
        },
        getRecordingTime: function() {
            return video.recordingTime;
        },
        setRecordingTime: function(curTime) {
            video.recordingTime = curTime;
        },
        showRecordingCtrlDlg: function(eventFromExtension) {
            if (eventFromExtension.details) {
                video.showRecordingCtrlDlg(eventFromExtension.detail);
            } else {
                video.showRecordingCtrlDlg(eventFromExtension);
            }
        },
        startRecording: function(eventFromExtension) {
            video.showStartRecordCountdown(eventFromExtension);
        },
        recordCompleted: function(eventFromExtension) {
            video.recordCompleted(eventFromExtension);
        },
        stopRecording: function(overtime) {
            if (!overtime) {
                overtime = true;
            }
            video.stopRecording(overtime);
        },
        restartRecording: function() {
            video.restartRecording();
        },
        extensionInstalled: function() {
            this.checkForIncognito();
        },
        attachPluginEventResponse: function() {
            if (this.eventsLoaded === true) {
                return;
            }
            var extensionInstalled = function(eventFromExtension) {
                pega.screen.api.extensionInstalled(eventFromExtension);
            };
            top_doc.addEventListener('Event_extensionInstalled', extensionInstalled);
            var captureCompleted = function(eventFromExtension) {
                pega.screen.api.captureCompleted(eventFromExtension);
            };
            top_doc.addEventListener('Event_screenCaptureCompleted', captureCompleted);
            //top_doc.addEventListener('Event_repaintSCD', repaintSCD);
            var showRecordingCtrlDlg = function(eventFromExtension) {
                pega.screen.api.showRecordingCtrlDlg(eventFromExtension);
            };
            top_doc.addEventListener('Event_repaintVCD', showRecordingCtrlDlg);
            var startRecording = function(eventFromExtension) {
                pega.screen.api.startRecording(eventFromExtension);
            };
            top_doc.addEventListener('Event_startRecording', startRecording);
            var recordCompleted = function(eventFromExtension) {
                pega.screen.api.recordCompleted(eventFromExtension);
            };
            top_doc.addEventListener('Event_videoCaptureCompleted', recordCompleted);
            this.eventsLoaded = true;
        },
        handleDragStart: function(event) {
            utility.handleDragStart(event);
        },
        addOrMoveMarker: function(event, x, y) {
            utility.addOrMoveMarker(event, x, y);
        },
        addMaskedArea: function(event) {
            utility.addMaskedArea();
        },
        cleanUpAllEvents: function() {
            utility.cleanUpAllEvents();
        },
        cleanUpAll: function() {
            utility.cleanUpAll();
        },
        getCapturedContent: function() {
            return capturedContent;
        },
        checkForIncognito: function() {
            var fs = top_win.RequestFileSystem || top_win.webkitRequestFileSystem;
            if (!fs || typeof fs !== "function") {
                utility.postExtensionInfo(true);
                return;
            }
            fs(0, 0, function() {
                utility.postExtensionInfo(false);
            }, function() {
                utility.postExtensionInfo(true);
            });
        }
    };
    var snapshot = {
        onCompleteCallbackDefault: function(imgSrc) {
            var imgDiv = utility.getPreviewContainer(imgSrc, "screenshot.png");
            imgDiv.innerHTML = '<img src="' + imgSrc + '"/>';
        },
        onCompleteCallback: function() {},
        activityDetails: '',
        capture: function(onCompleteCallback, activityDetails) {
            if (onCompleteCallback) {
                this.onCompleteCallback = onCompleteCallback;
            } else {
                this.onCompleteCallback = this.onCompleteCallbackDefault;
            }
            if (activityDetails) {
                this.activityDetails = activityDetails;
            }
            top_doc.getElementById("feedbackCaptureDlg").setAttribute("style",
                "display: none !important");
            var evt = new CustomEvent('Event_screenCaptureInit');
            top_doc.dispatchEvent(evt);
        },
        captureCompleted: function(eventFromExtension) {
            var detail = eventFromExtension.detail;
            fbbusyIndicator.show(true);
            if (detail !== 'PEGA-SCREEN-CAPTURE-FAIL') {
                capturedContent = detail;
                if (this.activityDetails.activityName) {
                    var oSafeURL = utility.getURL("image", this.activityDetails);
                    utility.postAction(oSafeURL);
                } else {
                    try {
                        this.onCompleteCallback(detail);
                    } catch (err) {
                        console.error("Error in callback execution - " + err);
                    }
                }
                utility.cleanUpMarkers();
            } else {
                alert(pega.u.d.fieldValuesList.get("pzCaptureScreenFailed"));
                top_doc.getElementById("feedbackCaptureDlg").setAttribute("style",
                    "display: block !important");
            }
            fbbusyIndicator.hide();
        }
    };
    var video = {
        flags: {
            "isVideoCaptureInProgress": false,
            "stopOnly": false
        },
        /*isVideoCaptureInProgress: false,
            stopOnly: false,*/
        recordingTime: 1,
        onCompleteCallbackDefault: function(vidSrc) {
            var vidDiv = utility.getPreviewContainer(vidSrc, "recording.webm");
            vidDiv.innerHTML = '<video controls src="' + vidSrc + '"></video>';
        },
        onCompleteCallback: function() {},
        onCancelCallback: function() {},
        activityDetails: '',
        recordInit: function(onCancelCallback, onCompleteCallback, activityDetails) {
            this.flags.isVideoCaptureInProgress = true;
            //top_doc.isVideoCaptureInProgress = true;
            if (onCompleteCallback) {
                this.onCompleteCallback = onCompleteCallback;
            } else {
                this.onCompleteCallback = this.onCompleteCallbackDefault;
            }
            if (onCancelCallback) {
                this.onCancelCallback = onCancelCallback;
            }
            if (activityDetails) {
                this.activityDetails = activityDetails;
            }
            var refreshEvt = new CustomEvent('Event_clearFlagsForRefresh', {
                bubbles: true,
                cancelable: false
            });
            top_doc.dispatchEvent(refreshEvt);
            var startRecordEvt = new CustomEvent('Event_startAudioVideoCapture', {
                bubbles: true,
                cancelable: true
            });
            top_doc.dispatchEvent(startRecordEvt);
        },
        showRecordingCtrlDlg: function(startTime) {
            var startMinutes = parseInt((startTime - 1) / 60, 10);
            var startSeconds = parseInt((startTime - 1) % 60, 10);
            startMinutes = startMinutes < 10 ? "0" + startMinutes : startMinutes;
            startSeconds = startSeconds < 10 ? "0" + startSeconds : startSeconds;
            var dialogueElem = top_doc.createElement("div");
            dialogueElem.setAttribute("id", "feedbackRecorderDlg");
            dialogueElem.setAttribute("class", "recorddialogue");
            dialogueElem.setAttribute("draggable", "true");
            dialogueElem.innerHTML =
                '<div><button id="fbRestart" class="recorderButtonsRestart" title="' + pega.u.d.fieldValuesList
                .get("pzRecorderDlgRestart") +
                '" ></button><button id="fbStop" class="recorderButtonsStop"  title="' + pega.u.d.fieldValuesList
                .get("pzRecorderDlgStop") +
                '"></button><div class="timerText"><span id="recordingTime" class="feedbackVedieoCaptureTimer">' +
                startMinutes + ':' + startSeconds +
                '</span>/03:00</div><button id="closeFBDlg" class="recorderButtonsClose" title="' + pega
                .u.d.fieldValuesList.get("pzRecorderDlgClose") + '" ></button></div>';
            top_body.appendChild(dialogueElem);
            var close = function(event) {
                pega.screen.api.onCancelCallback("video");
                pega.screen.api.cleanUpAll();
                event.stopPropagation();
            };
            top_doc.getElementById("closeFBDlg").addEventListener("click", close);
            top_doc.getElementById("fbStop").addEventListener("click", pega.screen.api.stopRecording);
            top_doc.getElementById("fbRestart").addEventListener("click", pega.screen.api.restartRecording);
            utility.addDndOnCaptureDlg("feedbackRecorderDlg", ["closeFBDlg", "fbStop", "fbRestart"]);
            this.startRecording(startTime);
        },
        stopRecording: function(overTime) {
            fbbusyIndicator.show(true);
            clearInterval(this.timerInterval);
            utility.removeElement(top_doc.getElementById("feedbackRecorderDlg"));
            var Event_stopAudioVideoCapture = new CustomEvent("Event_stopAudioVideoCapture", {
                detail: overTime,
                bubbles: true,
                cancelable: true
            });
            top_doc.dispatchEvent(Event_stopAudioVideoCapture);
        },
        restartRecording: function() {
            setTimeout(function() {
                top_doc.getElementById("fbStop").focus();
            }, 100);
            clearInterval(this.timerInterval);
            this.recordingTime = 1;
            var evt = new CustomEvent("Event_restartAudioVideoCapture", {
                bubbles: true,
                cancelable: true
            });
            top_doc.dispatchEvent(evt);
            this.setTimerInterval();
        },
        startRecording: function(startTime) {
            /*top_doc.getElementById("fbResume").style.display = "none";*/
            this.recordingTime = startTime;
            this.setTimerInterval();
        },
        clearScreenRecordingOnClose: function() {
            if (this.flags.isVideoCaptureInProgress == true) {
                var evt = new CustomEvent("Event_stopAudioVideoCapture", {
                    detail: "stopOnly",
                    bubbles: true,
                    cancelable: true
                });
                top_doc.dispatchEvent(evt);
                this.flags.stopOnly = true;
                this.flags.isVideoCaptureInProgress = false;
                clearInterval(this.timerInterval);
                utility.cleanUpAll();
            }
        },
        timerInterval: "",
        setTimerInterval: function() {
            this.timerInterval = setInterval(function() {
                var curTime = pega.screen.api.getRecordingTime();
                var minutes = parseInt(curTime / 60, 10);
                var seconds = parseInt(curTime % 60, 10);
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                if (top_doc.getElementById("recordingTime")) {
                    top_doc.getElementById("recordingTime").innerText = minutes + ":" + seconds;
                    curTime++;
                    pega.screen.api.setRecordingTime(curTime);
                    if (curTime > (3 * 60)) {
                        pega.screen.api.stopRecording(true);
                    }
                } else {
                    clearInterval(this.timerInterval);
                }
            }, 1000);
        },
        setCountDownInterval: function(seconds) {
            var countDownInterval = setInterval(function() {
                var timerElement = top_doc.getElementById("videoCountdownTimerText");
                if (timerElement) {
                    timerElement.innerText = seconds;
                }
                if (seconds-- <= 0) {
                    clearInterval(countDownInterval);
                    var timerBackground = top_doc.getElementById("videoCountdownTimer");
                    if (timerBackground) {
                        timerBackground.parentNode.removeChild(timerBackground);
                    }
                    pega.screen.api.showRecordingCtrlDlg(1);
                }
            }, 1000);
        },
        showStartRecordCountdown: function(eventFromExtension) {
            if (top_doc.getElementById("videoCountdownTimer")) {
                return;
            }
            var videoCountdownTimerElem = top_doc.createElement("div");
            videoCountdownTimerElem.setAttribute("id", "videoCountdownTimer");
            videoCountdownTimerElem.setAttribute("class", "videoCountdownTimer");
            videoCountdownTimerElem.innerHTML =
                '<div id="videoCountdownTimerText" style="margin:auto">3</div>';
            top_body.appendChild(videoCountdownTimerElem);
            this.setCountDownInterval(2);
        },
        recordCompleted: function(eventFromExtension) {
            var detail = eventFromExtension.detail;
            fbbusyIndicator.hide();
            fbbusyIndicator.show(true);
            utility.removeElement(top_doc.getElementById("feedbackRecorderDlg"));
            this.stopVideoSharing();
            if (detail == 'PEGA-SCREEN-CAPTURE-FAIL') {
                alert(pega.u.d.fieldValuesList.get("pzRecordVideoFailed"));
                this.onCancelCallback();
            } else if (!this.flags.stopOnly) {
                if (detail != 'data:') {
                    capturedContent = detail;
                    try {
                        this.onCompleteCallback(detail);
                    } catch (err) {
                        console.error("Error in callback execution - " + err);
                    }
                    if (this.activityDetails.activityName) {
                        var oSafeURL = utility.getURL("video", this.activityDetails);
                        utility.postAction(oSafeURL);
                    }
                    utility.cleanUpMarkers();
                } else {
                    alert(pega.u.d.fieldValuesList.get("pzRecordVideoFailed"));
                }
            }
            fbbusyIndicator.hide();
            this.flags.stopOnly = false;
            this.flags.isVideoCaptureInProgress = false;
        },
        stopVideoSharing: function() {
            utility.removeElement(top_doc.getElementById("feedbackRecorderDlg"));
            utility.removeElement(top_doc.getElementById("videoCountdownTimer"));
            clearInterval(this.timerInterval);
        },
    };
    var utility = {
        hasExtension: false,
        isIncognito: false,
        startup: function(onStartCallback, activityClass, activityName, activityParams) {
            if (typeof onStartCallback === "function") {
                try {
                    onStartCallback();
                } catch (e) {
                    console.error("Start callback isn't a function");
                }
            }
            var activityDetails = null;
            if (activityName !== "" && activityClass !== "") {
                activityDetails = {
                    "activityName": activityName,
                    "activityClass": activityClass,
                    "activityParams": activityParams
                };
            }
            return activityDetails;
        },
        getURL: function(mediaType, activityDetails) {
            var oSafeURL = new SafeURL(activityDetails.activityClass + "." + activityDetails.activityName);
            oSafeURL.put("fileType", (mediaType == "image") ? "png" : "webm");
            oSafeURL.put("pzPrimaryPageName", activityDetails.primaryPage);
            var activityParams = activityDetails.activityParams;
            activityParams.forEach(function(element) {
                oSafeURL.put(element.paramName, element.paramValue);
            });
            return oSafeURL;
        },
        postAction: function(targetURL) {
            var uploadSuccess = function(result) {
                console.log("Post activity execution successful.");
            };
            var uploadFailure = function(result) {
                console.log("Post activity execution failed.");
            };
            var uploadCallback = {
                success: uploadSuccess,
                failure: uploadFailure,
                argument: null
            };
            pega.u.d.asyncRequest('POST', targetURL, uploadCallback, null);
        },
        postExtensionInfo: function(isIncognito) {
            this.isIncognito = isIncognito;
            var dummyElement = top_doc.getElementById('PEGA_SCREEN_CAPTURE_ELEMENT_DUMMY');
            this.hasExtension = (dummyElement) ? true : false;
            if (navigator.userAgent.indexOf("Chrome") > -1) {
                var oSafeURL = new SafeURL("Pega-Agile-SmartFeedback.pzSetExtensionInstalled");
                oSafeURL.put("isIncognito", isIncognito);
                oSafeURL.put("extensionInstalled", this.hasExtension);
                oSafeURL.put("pzPrimaryPageName", "D_pzAgileSmartFeedback");
                pega.u.d.asyncRequest('GET', oSafeURL, {
                    success: onExtensionAddCallback,
                    failure: onExtensionAddCallback
                }, null, {
                    bAsync: false
                });
            }
        },
        getPreviewContainer: function(downloadFileSource, downloadFileNameWithExtension) {
            var previewDiv = top_doc.createElement("div");
            previewDiv.setAttribute("class", "screen-api-media-preview");
            top_body.appendChild(previewDiv);
            //previewDiv = top_doc.querySelector(".screen-api-media-preview")
            previewDiv.innerHTML =
                '<div class="screen-api-media-preview-header"><a class="screen-api-media-preview-download" href="#"><i class="pi pi-download"></i></a><a class="screen-api-media-preview-close" href="#"><i class="pi pi-close"></i></a></div><div class="screen-api-media-preview-content"></div>';
            var downloadLink = previewDiv.querySelector(
                ".screen-api-media-preview-header > .screen-api-media-preview-download");
            downloadLink.setAttribute("href", downloadFileSource);
            downloadLink.setAttribute("download", downloadFileNameWithExtension);
            top_doc.querySelector(".screen-api-media-preview-close").addEventListener('click', function() {
                utility.removeElement(top_doc.querySelector(".screen-api-media-preview"));
            });
            top_doc.querySelector(".screen-api-media-preview-close").addEventListener('keypress',
                function(event) {
                    if (event.which === 13 || event.keyCode === 13) {
                        utility.removeElement(top_doc.querySelector(".screen-api-media-preview"));
                    }
                });
            return previewDiv.querySelector(".screen-api-media-preview-content");
        },
        showScreenCaptureOverlay: function(onCancelCallback, onCompleteCallback, activityDetails) {
            if (top_doc.querySelector("#feedbackCaptureDlg")) {
                top_doc.querySelector("#feedbackCaptureDlg").style.display = "block !important";
                return;
            }
            var overlayElem = top_doc.createElement("div");
            overlayElem.setAttribute("id", "feedbackCaptureDlg");
            overlayElem.setAttribute("class", "dialogue");
            overlayElem.setAttribute("draggable", "true");
            overlayElem.innerHTML = '<div class="boldText">' + pega.u.d.fieldValuesList.get(
                    "pzShowUsWhere") +
                '</div><button id="closeFBDlg" class="iconClose closeFBDlg"></button><div id="dragPin"  draggable=true class="dragPin" ><div class="iconOpenRule"></div></div><div class="helperText">' +
                pega.u.d.fieldValuesList.get("pzShowUsWhereDrag") +
                '</div><button id="captureButton" class="Strong pzhc pzbutton">' + pega.u.d.fieldValuesList
                .get("pzCaptureBtn_GI") +
                ' </button><input type="hidden" id="hiddenDraggableId" value="">';
            top_body.appendChild(overlayElem);
            var dragStart = function(event) {
                pega.screen.api.handleDragStart(event);
                event.stopPropagation();
            };
            top_doc.querySelector("#dragPin").addEventListener("dragstart", dragStart);
            var capture = function(event) {
                pega.screen.api.captureInit(onCompleteCallback, activityDetails);
                event.stopPropagation();
            };
            top_doc.querySelector("#captureButton").addEventListener("click", capture);
            var close = function(event) {
                if (onCancelCallback) {
                    try {
                        onCancelCallback();
                    } catch (err) {
                        console.error("Error in callback execution - " + err);
                    }
                }
                pega.screen.api.cleanUpAll();
                event.stopPropagation();
            };
            top_doc.querySelector("#closeFBDlg").addEventListener("click", close);
            this.addDndOnCaptureDlg("feedbackCaptureDlg", ["dragPin"]);
        },
        handleDragStart: function(event) {
            top_doc.querySelector("#hiddenDraggableId").value = event.target.id;
            event.dataTransfer.effectAllowed = 'move';
            this.addDropArea();
        },
        addDropArea: function() {
            this.cleanUpAllEvents();
            this.addMaskedArea();
            var drop_body = top_body;
            drop_body.addEventListener("drop", this.dropCallback);
            drop_body.addEventListener("dragover", this.dragoverCallback);
            drop_body.addEventListener("dragenter", this.dragenterCallback);
            drop_body.addEventListener("dragleave", this.dragleaveCallback);
        },
        dropCallback: function(event) {
            event.preventDefault();
            event.stopPropagation();
            pega.screen.api.addOrMoveMarker(event, event.pageX, event.pageY);
            pega.screen.api.cleanUpAllEvents();
        },
        dragoverCallback: function(event) {
            event.preventDefault();
            event.stopPropagation();
        },
        dragenterCallback: function(event) {
            event.preventDefault();
            event.stopPropagation();
            pega.screen.api.addMaskedArea();
        },
        dragleaveCallback: function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (event.target.id == "maskedDiv") {
                var maskedElem = top_doc.querySelector("#maskedDiv");
                if (maskedElem) {
                    maskedElem.parentElement.removeChild(maskedElem);
                }
            }
        },
        addOrMoveMarker: function(event, x, y) {
            var markers = top_doc.querySelectorAll(".feedback-marker");
            var count = markers.length;
            /*max number of pins */
            if (count >= 3) {
                return;
            }
            var draggableId = top_doc.querySelector("#hiddenDraggableId").value;
            if (draggableId === "") {
                return;
            }
            var markerNumb = 1;
            var marker = null;
            if (draggableId === "dragPin") {
                if (count > 0) {
                    markerNumb = count + 1;
                }
                count++;
                var markerDivElem = top_doc.createElement("div");
                markerDivElem.setAttribute("id", "feedback-marker-" + markerNumb);
                markerDivElem.setAttribute("class", "feedback-marker");
                markerDivElem.setAttribute("draggable", "true");
                markerDivElem.innerHTML = '<div class="feedback-marker-round" >' + markerNumb +
                    '</div><div id="feedback-marker-close-' + markerNumb +
                    '" class="iconClose"></div><div class="feedbackTextPosition"><textarea class="feedbackText" maxlength="128"></textarea></div>';
                top_body.appendChild(markerDivElem);
                top_doc.querySelector(".feedbackText").focus();
                var markerTextArea = top_body.querySelector("#feedback-marker-" + markerNumb).querySelector(
                    ".feedbackText");
                markerTextArea.addEventListener("input", function(event) {
                    var textBoxElem = event.currentTarget;
                    if (textBoxElem) {
                        textBoxElem.style.height = (textBoxElem.scrollHeight) + "px";
                    }
                }, false);
                marker = top_doc.querySelector("#feedback-marker-" + markerNumb);
                /*add drag function*/
                marker.addEventListener("dragstart", pega.screen.api.handleDragStart);
                /* add delete functionality*/
                var markerClose = top_doc.querySelector("#feedback-marker-close-" + markerNumb);
                markerClose.addEventListener("click", function(event) {
                    event.stopPropagation();
                    /* remove drag pin's draggability*/
                    if (top_doc.querySelectorAll(".feedback-marker").length === 3) {
                        var dragPinElem = top_doc.querySelector("#dragPin");
                        dragPinElem.setAttribute('draggable', 'true');
                        dragPinElem.classList.remove("notDraggable");
                    }
                    /* remove and reset the numbers */
                    var currentNumber = this.parentElement.getAttribute("id").slice(-1);
                    this.parentElement.parentElement.removeChild(this.parentElement);
                    for (var i = 3; i > 1 && currentNumber < i; i--) {
                        var markerInLoop = top_doc.querySelector("#feedback-marker-" + (i));
                        if (markerInLoop) {
                            markerInLoop.querySelector(".feedback-marker-round").innerText = (i -
                                1);
                            markerInLoop.setAttribute("id", "feedback-marker-" + (i - 1));
                            markerInLoop.querySelector(".iconClose").setAttribute("id",
                                "feedback-marker-close-" + (i - 1));
                        }
                    }
                });
                if (count === 3) {
                    var dragPinElem = top_doc.querySelector("#dragPin");
                    dragPinElem.removeAttribute('draggable');
                    dragPinElem.classList.add("notDraggable");
                }
            } else {
                markerNumb = draggableId.slice(-1);
                marker = top_doc.querySelector("#feedback-marker-" + markerNumb);
            }
            /* regardless what is dragged ,move the marker*/
            x = x - parseInt(marker.offsetWidth) / 2;
            y = y - parseInt(marker.offsetHeight) / 2;
            marker.style.left = x + "px";
            marker.style.top = y + "px";
            /* clean up id */
            top_doc.querySelector("#hiddenDraggableId").value = "";
        },
        cleanUpAllEvents: function() {
            /* the clean up of the events on the body */
            var drop_body = top_body;
            drop_body.removeEventListener("drop", this.dropCallback);
            drop_body.removeEventListener("dragover", this.dragoverCallback);
            drop_body.removeEventListener("dragenter", this.dragenterCallback);
            drop_body.removeEventListener("dragleave", this.dragleaveCallback);
            utility.removeElement(top_doc.querySelector('#maskedDiv'));
        },
        cleanUpAll: function() {
            var elemsToRemove = top_doc.querySelectorAll(".feedback-marker");
            for (var i = 0; i < elemsToRemove.length; i++) {
                this.removeElement(elemsToRemove[i]);
            }
            /* remove the screen capture layout */
            this.removeElement(top_doc.getElementById("feedbackCaptureDlg"));
            /* clean up the recorder layout*/
            this.removeElement(top_doc.getElementById("feedbackRecorderDlg"));
            /* the clean up of the events on the body and Iframe etc*/
            this.cleanUpAllEvents();
            video.clearScreenRecordingOnClose();
        },
        removeElement: function(elemToRemove) {
            if (elemToRemove) {
                elemToRemove.parentNode.removeChild(elemToRemove);
            }
        },
        addMaskedArea: function() {
            //create the transparent div across the view port and add events 
            if (top_doc.querySelector("#maskedDiv")) {} else {
                var dropAreaElem = top_doc.createElement("div");
                dropAreaElem.setAttribute("id", "maskedDiv");
                dropAreaElem.setAttribute("class", "maskedDropArea");
                top_body.appendChild(dropAreaElem);
            }
        },
        addDndOnCaptureDlg: function(dlgId, stopElementArray) {
            var capturedlg = "#" + dlgId;
            var capturedlgElem = top_doc.querySelector(capturedlg);
            if (capturedlgElem) {
                moveElement(capturedlgElem);
            }

            function moveElement(elmnt) {
                var pos1 = 0,
                    pos2 = 0,
                    pos3 = 0,
                    pos4 = 0;
                elmnt.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e.preventDefault();
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    var drop_doc = (pega.u.d.portalName === "pxExpress") ? pega.ui.composer.getCurrentComposerWindow()
                        .document : top_doc;
                    drop_doc.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    drop_doc.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e.preventDefault();
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    /* stop moving when mouse button is released:*/
                    var drop_doc = (pega.u.d.portalName === "pxExpress") ? pega.ui.composer.getCurrentComposerWindow()
                        .document : top_doc;
                    drop_doc.onmouseup = null;
                    drop_doc.onmousemove = null;
                }
            }
            var stopit = function(event) {
                event.stopPropagation();
            }
            if (stopElementArray) {
                for (var i = 0; i < stopElementArray.length; i++) {
                    var element = "#" + stopElementArray[i];
                    top_doc.querySelector(element).addEventListener("mousedown", stopit);
                    top_doc.querySelector(element).addEventListener("mousemove", stopit);
                    top_doc.querySelector(element).addEventListener("mousedown", stopit);
                }
            }
        },
        cleanUpMarkers: function() {
            var elemsToRemove = top_doc.querySelectorAll(".feedback-marker");
            for (var i = 0; i < elemsToRemove.length; i++) {
                this.removeElement(elemsToRemove[i]);
            }
            /* remove the screen capture layout */
            this.removeElement(top_doc.getElementById("feedbackCaptureDlg"));
            /* clean up the recorder layout*/
            this.removeElement(top_doc.getElementById("feedbackRecorderDlg"));
            /* the clean up of the events on the body and Iframe etc*/
            this.cleanUpAllEvents();
            //Clean up or stop video recording when AW is closed
            //clearScreenRecordingOnClose();
        },
    };
    return publicAPI;
}());
if (navigator.userAgent.indexOf("Chrome") > -1) {
    pega.screen.api.attachPluginEventResponse();
}
//static-content-hash-trigger-NON
var $pNamespace = pega.namespace;
$pNamespace("pega.ui");
// The editor is a singleton class which returns its public methods.
pega.ui.gapidentifier = (function() {
  var publicAPI = {}
  // Capture context at initialization
  var documentRef = document;
  var topHarness = $("[data-ui-meta*=\"'type\':\'Harness\'\"]", documentRef).first();
  if (topHarness.length === 0) {
    topHarness = $("[data-portalharnessinsname]", documentRef).first();
  }
  var desktopWindow = pega.desktop.support.getDesktopWindow();
  var _gapIdentifierPanelWidth = 400;
  var _isClicked = false;
  var _isPanelMinimized;
  var _mouseMoveCounter = 0;
  var ANIMATION_DURATION = 333;
  var ANIMATION_EASING = "linear";
  var PANEL_TEMPLATE = "<div class='runtime-control-gapidentifier-tab'></div>" +
      "<div class='runtime-control-gapidentifier-resize ui-resizable-handle ui-resizable-w'></div>" +
      "<div class='pz-gap-panel-body'><div>";
  /////////////////////////////////////////////////////////////////////////////////
  //                                  PUBLIC API                                 //
  /////////////////////////////////////////////////////////////////////////////////
  /**
     * @private Handle the click of the GapIdentifier button in portals.
     */
  function _handleClick() {
    // Prevent multi-click of button to avoid rendering errors
    if (!_isClicked) {
      _isClicked = true;
      pega.ui.gapidentifier.toggle();
      setTimeout(function() {
        _isClicked = false;
      }, ANIMATION_DURATION * 2);
    }
  }
  /**
     * @private Disable other inspectors
     * @param inspectorClass class of inspector icon to hide
     */
  function _disableInspector(inspectorClass) {
    var inspElem = $(inspectorClass, documentRef);
    if (inspElem.length !== 0) {
      if (inspectorClass !== '.pi-potion') {
        inspElem.find("a").attr("disabled", true).addClass("disabledStyle").children("i").attr(
          "disabled", true).addClass("disabledStyle");
        inspElem.find("button").attr("disabled", true).addClass("disabledStyle");
        inspElem.attr("disabled", true);
        /*Remove data click on icon when disabled so as not to enable to live ui when the agile work bench is open*/
        inspElem.find("i").removeAttr("data-click");
      } else {
        inspElem.parent().attr("disabled", true).addClass("disabledStyle");
      }
    }
  }
  /**
     * @private Enable other inspectors
     * @param inspectorClass class of inspector icon to hide
     */
  function _enableInspector(inspectorClass) {
    var inspElem = $(inspectorClass, documentRef);
    if (inspElem.length !== 0) {
      if (inspectorClass !== '.pi-potion') {
        inspElem.find("a").removeAttr("disabled").removeClass("disabledStyle").children("i").removeAttr(
          "disabled").removeClass("disabledStyle");
        inspElem.find("button").removeAttr("disabled").removeClass("disabledStyle");
        inspElem.removeAttr("disabled");
        inspElem.find("i").attr("data-click", "[[\"runScript\", [\"pega.ui.inspector.toggle()\"]]]");
      } else {
        inspElem.parent().removeAttr("disabled", true).removeClass("disabledStyle");
      }
    }
  }
  /**
     * @private Initialize floating and anchored buttons and drag events for them
     */
  function _initializeToolbar() {
    if (window !== desktopWindow) return;
    if ($('.gapid_icon').length < 1) {
      //Create button
      var oDomTreeToolbar = document.createElement("DIV");
      oDomTreeToolbar.setAttribute("class", "pz-gap-tool");
      oDomTreeToolbar.setAttribute("data-test-id", "GapIdentifierInspectorButton");
      oDomTreeToolbar.setAttribute("tabindex", "0");
      oDomTreeToolbar.setAttribute("aria-label", "Agile Workbench");
      oDomTreeToolbar.innerHTML = "<div class='toggle-runtime-gapidentifier-mask'></div>" +
        "<div unselectable='on' class='gapid_icon'><span  unselectable='on' class='pzbtn-img'>" +
        "<icon class='pi pi-bolt'/></span>" + pega.u.d.fieldValuesList.get("pzAgileWorkbench") +
        " </div>";
      $(oDomTreeToolbar).appendTo(document.body);
      //Add toggle to button on click
      oDomTreeToolbar.addEventListener("click", _handleClick, true);
      oDomTreeToolbar.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
          _handleClick()
        }
      }, true);
      var handleDrag = function(e) {
        _mouseMoveCounter++;
        if (_mouseMoveCounter > 5) {
          if (!$(oDomTreeToolbar).hasClass('noClick')) {
            $(oDomTreeToolbar).addClass('noClick');
          }
          var Width = $(".pz-gap-tool", documentRef).outerWidth();
          var Height = $(".pz-gap-tool", documentRef).outerHeight();
          var X = e.clientX - (Width / 2);
          var Y = e.clientY - (Height / 2);
          // if toggle button is dragged outside of window, reset variables event listeners
          if (e.clientX < 0 || e.clientY < 0 || e.clientX > $(window).width() || e.clientY > $(
            window).height()) {
            _mouseMoveCounter = 0;
            $(".ui-gapidentifier-tree-mask", documentRef).remove();
            window.removeEventListener("mousemove", handleDrag, true);
            $('.pz-gap-tool', documentRef).removeClass('noClick');
            return publicAPI.handleSupression(e);
          }
          //Prevent drag off left
          if (X < 0) {
            X = 0;
          }
          //Prevent drag off top
          if (Y < 0) {
            Y = 0;
          }
          //Prevent drag off right
          if (X > ($(window).width() - Width)) {
            X = ($(window).width() - Width);
          }
          //Prevent drag off bottom
          if (Y > ($(window).height() - Height)) {
            Y = ($(window).height() - Height);
          }
          //This will set the button's position based on a % rather than set pixel cords
          //Y = (Y / $(window).height() * 100) + "%";
          //X = (X / $(window).width() * 100) + "%";
          $(".pz-gap-tool", documentRef).css({
            'position': 'fixed',
            'top': Y,
            'left': X
          });
        }
        return publicAPI.handleSupression(e);
      }
      oDomTreeToolbar.addEventListener("mousedown", function(e) {
        if (!$(oDomTreeToolbar).hasClass('noClick')) {
          if ($(".ui-gapidentifier-tree-mask", documentRef).length === 0) {
            $(document.body, documentRef).append(
              "<div class='ui-gapidentifier-tree-mask'></div>");
          }
          //Add mouse move
          window.addEventListener("mousemove", handleDrag, true);
        }
        return publicAPI.handleSupression(e);
      }, true)
      window.addEventListener("mouseup", function(e) {
        if ($(".ui-gapidentifier-tree-mask", documentRef).length > 0) {
          _mouseMoveCounter = 0;
          $(".ui-gapidentifier-tree-mask", documentRef).remove();
          window.removeEventListener("mousemove", handleDrag, true);
        }
      }, true);
      //Add resize event to the window only for the Button
      window.addEventListener("resize", function() {
        if ($(".pz-gap-tool").css("top") !== "auto") {
          // Get button offset
          var button = $(".pz-gap-tool");
          var buttonOffset = button.offset();
          var buttonTop = buttonOffset.top;
          var buttonLeft = buttonOffset.left;
          // Get size of window, and scroll position
          var windowHeight = $(window).height() - button.height();
          var windowWidth = $(window).width() - button.width();
          var scrollTop = $(window).scrollTop();
          var scrollLeft = $(window).scrollLeft();
          // Adjust button position if needed based on window resize
          if (buttonTop < 0) button.css({
            'top': "0px"
          });
          else if ((buttonTop - scrollTop) > windowHeight) button.css({
            'top': (windowHeight + "px")
          });
          if (buttonLeft < 0) button.css({
            'left': "0px"
          });
          if ((buttonLeft - scrollLeft) > windowWidth) button.css({
            'left': (windowWidth + "px")
          });
        }
      }, true);
    }
  }
  /**
     * Initialize GapIdentifier panel markup, called when window is loaded 
     **/
  publicAPI.initialize = function() {
    //Create control panel template
    var oControlPanel = document.createElement("DIV");
    oControlPanel.className = "pz-gap-panel gapidentifier-hidden";
    oControlPanel.innerHTML = PANEL_TEMPLATE;
    //Check to see if the panel already exists and if so then just replace it
    if ($(document.body).find("div.pz-gap-panel").length > 0) {
      $(document.body).find("div.pz-gap-panel").replaceWith($(oControlPanel));
    } else {
      $(oControlPanel).appendTo(document.body);
    }
    return publicAPI.loadSectionIntoDom("pzGapIdentifier_Panel", "@baseclass", $(
      ".pz-gap-panel-body > div")[0]);
  }
  /**
         * @public Adds the information to the given element and then calls reloadSection API to retrieve the markup from the server
         * this is done because reloadSection handles the PegaOnlyOnce logic that prevents duplicate libraries from being loading more than once
         *
         * @param $String$ sectionName - The name of the section to be loaded
         * @param $String$ sectionClass - The class of the section to be loaded
         * @param $HTML Element$ elem - The HTML to load the section into
         * @param $String$ baseRef - The base reference of the section to be loaded
         */
  publicAPI.loadSectionIntoDom = function(sectionName, sectionClass, elem, baseRef) {
    // Set default section attributes
    elem.className = "sectionDivStyle";
    elem.id = "RULE_KEY";
    elem.setAttribute("node_type", "MAIN_RULE");
    elem.setAttribute("version", "1");
    elem.setAttribute("objclass", "Rule-HTML-Section");
    if (pega.ctx.isUITemplatized === true) elem.setAttribute("data-template", "");
    elem.setAttribute("name", "BASE_REF");
    elem.setAttribute("id", "RULE_KEY");
    elem.setAttribute("class", "sectionDivStyle");
    elem.setAttribute("node_name", sectionName);
    elem.setAttribute("data-node-id", sectionName);
    elem.setAttribute("pyclassname", sectionClass);
    if (baseRef && baseRef !== "") {
      elem.setAttribute("BASE_REF", baseRef);
    }
    _initializeToolbar();
  }
  /**
         * @public checks if the right panel is open is called from pzpega_ui_guide
         *
         */
  publicAPI.isAgileWorkBenchOpen = function() {
    var isOpen = false;
    var $controlPanel = $(".pz-gap-panel", documentRef);
    if ($controlPanel && $controlPanel.hasClass("showing")) {
      isOpen = true;
    }
    return isOpen;
  }
  /**
         * @public Handles retrieving settings information from the server then animating in the side panel
         *
         * @param $Function$ callback - Callbakc function to be called after animationlic is complete
         */
  publicAPI.show = function(callback, activityToTrigger, PreActivityParams) {
    publicAPI.checkExtensionInfo();
    if (PreActivityParams) {
      PreActivityParams = PreActivityParams;
    } else {
      PreActivityParams = "";
    }
    if (activityToTrigger) {
      activityToTrigger = activityToTrigger;
    } else {
      activityToTrigger = "pzInitGapPanel";
    }
    var $controlPanel = $(".pz-gap-panel", documentRef);
    var element = $(".pz-gap-panel-body > div", documentRef);
    if (element.length !== 0) {
      pega.u.d.reloadSection(element[0], activityToTrigger, PreActivityParams, false, false, -1, false,
                             null, null, null, callback);
    }
    $controlPanel.removeClass("gapidentifier-hidden");
    $(".pz-gap-panel-body").removeClass("gapidentifier-hidden");
    $(".runtime-control-gapidentifier-resize", documentRef).css('display', "");
    $(".gapid_icon", documentRef).toggleClass("active");
    if ($('#js-toggle-runtime-editor', documentRef).length !== 0) {
      $('#js-toggle-runtime-editor', documentRef).attr("disabled", true);
    }
    _disableInspector('.ui-inspector');
    _disableInspector('.accessibility-toggle');
    _disableInspector('.localization-toggle');
    _disableInspector('.pi-potion');
    _gapIdentifierPanelWidth = 400;
    _animatePanel();
    toggleHighlightAWLink("show");
    callback();
  }
  /**
         * @private Called from show to animate the panel into place
         *
         * @param $Function$ callback - Callback function passed into show to be called when animation is finished
         **/
  function _animatePanel(callback) {
    // When disabling the tree then make sure to add the transition override for the toolbar
    var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
    if (toolbar) {
      toolbar.classList.add("disable-slide");
    }
    //Slide in panel by reducing the width of the rest of the screen
    topHarness.css({
      'position': 'absolute',
      'left': '0',
      'right': '0',
      'min-width': '0'
    });
    var right;
    var TempPanelWidth;
    if (_gapIdentifierPanelWidth > topHarness.width()) {
      right = topHarness.width() - (100) + "px";
      TempPanelWidth = topHarness.width() - (100);
    } else if (_gapIdentifierPanelWidth < 10) {
      right = "10px"
      TempPanelWidth = 10;
    } else {
      right = _gapIdentifierPanelWidth + "px";
      TempPanelWidth = _gapIdentifierPanelWidth;
    }
    if (_isPanelMinimized) {
      right = "0px";
      TempPanelWidth = "0";
    }
    topHarness.animate({
      right: right
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {});
    if (_isPanelMinimized) $('.runtime-control-gapidentifier-tab').addClass(
      'runtime-control-gapidentifier-tab-min');
    else $('.runtime-control-gapidentifier-tab').addClass('runtime-control-gapidentifier-tab-max');
    
    $(".pz-gap-panel").animate({
      width: TempPanelWidth + "px"
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {
      $(".pz-gap-panel").addClass("showing");
      if (!$(".pz-gap-panel").hasClass("ui-resizable")) {
        _resizePanel();
      }
      // Add active class to the tree
      setTimeout(function() {
        $('.pz-gap-panel').addClass("pz-gap-panel-active")
      }, 250);
    });
  }

  function toggleHighlightAWLink(action) {
    var awLink = document.querySelector(".gapid_icon a");
    if (awLink) {
      if (action === "show") {
        awLink.classList.add("gapid_icon_active");
      } else {
        awLink.classList.remove("gapid_icon_active");
      }
    }
  }
  /**
     * @private If screen layout is using flex, make necessary updates based on right panel size
     **/
  function _updateScreenLayoutFlex(rightPanelWidth) {
    // US-152932 handling width of main middle when inspector is opened
    if ($(".screen-layout").hasClass("flex")) {
      var rightWidth, widthToBeSubtracted, leftWidth;
      var clientWidth = $(window).width();
      leftWidth = $(".screen-layout-region-main-sidebar1").outerWidth() || 0;
      rightWidth = $(".screen-layout-region-main-sidebar2").outerWidth() || 0;
      widthToBeSubtracted = leftWidth + rightWidth + parseInt(rightPanelWidth);
      $('.screen-layout-region-main-middle').css({
        'width': (clientWidth - widthToBeSubtracted) + 'px'
      });
    }
  }
  /**
     * @public Handles animating the side panel off screen
     *
     * @param $Function$ callback - Callback function to be called after animation is complete
     */
  publicAPI.hide = function(callback) {
    if ($('#js-toggle-runtime-editor', documentRef).length !== 0) {
      $('#js-toggle-runtime-editor', documentRef).removeAttr("disabled");
    }
    $(".gapid_icon").toggleClass("active");
    $('.screen-layout-region-main-middle').css({
        'width': ''
      });
    toggleHighlightAWLink("hide");
    _enableInspector('.ui-inspector');
    _enableInspector('.accessibility-toggle');
    _enableInspector('.localization-toggle');
    _enableInspector('.pi-potion');
    var $controlPanel = $(".pz-gap-panel", documentRef);
    state = false;
    topHarness.animate({
      right: "0px"
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {
      $controlPanel.removeClass("showing");
      $controlPanel.addClass("gapidentifier-hidden");
      $(".runtime-control-gapidentifier-resize", documentRef).css('display', "none");
      // When disabling the tree then make sure to clean up the transition override for the toolbar
      var toolbar = document.querySelector("div[data-node-id='pzRuntimeToolsTopBar']");
      if (toolbar) {
        toolbar.classList.remove("disable-slide");
      }
    });
    $('.runtime-control-gapidentifier-tab', documentRef).removeClass(
      'runtime-control-gapidentifier-tab-min');
    $('.runtime-control-gapidentifier-tab', documentRef).removeClass(
      'runtime-control-gapidentifier-tab-max');
    topHarness.removeAttr("_isPanelMinimized");
    $controlPanel.animate({
      width: "0px"
    }, ANIMATION_DURATION, ANIMATION_EASING, function() {
      $('.pz-gap-panel', documentRef).removeClass("pz-gap-panel-active");
      callback();
    });
  }
  /**
         * @public Handles stopping event propagation for the given event. This is how we suppress events at the window level
         *
         * @param $Event$ e - The event object for the event
         */
  publicAPI.handleSupression = function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    return false;
  }
  publicAPI.minimizeToggle = function(event) {
    if (pega.u.d.portalName === "pxExpress") {
      pega.ui.awPanelExpress.toggleOnCaptureOrRecord();
      return;
    }
    if (topHarness.attr("_isPanelMinimized") === "true") {
      maximizeAgileWorkbench()
    } else {
      minimizeAgileWorkbench();
    }
  }
  publicAPI.maximizeToggle = function(detail) {
    if (pega.u.d.portalName === "pxExpress") {
      if (detail === 'PEGA-SCREEN-CAPTURE-FAIL') {
        if (!pega.ui.awPanelExpress.isAgileWBPanelOpen()) {
          pega.ui.awPanelExpress.toggleOnCaptureOrRecord();
        }
      } else {
        pega.ui.awPanelExpress.toggleOnCaptureOrRecord();
      }
      return;
    }
    maximizeAgileWorkbench();
  }

  function maximizeAgileWorkbench() {
    topHarness.css({
      'position': 'absolute',
      'left': '0'
    });
    if (topHarness.attr("_isPanelMinimized") === "true") {
      // If the current _gapIdentifierPanelWidth is larger than the screen then
      if (_gapIdentifierPanelWidth > $(window).width() - 100) {
        _gapIdentifierPanelWidth = $(window).width() - 100;
      }
      topHarness.css('right', _gapIdentifierPanelWidth + "px");
      $('.runtime-control-gapidentifier-tab', documentRef).removeClass(
        'runtime-control-gapidentifier-tab-min');
      $('.runtime-control-gapidentifier-tab', documentRef).addClass(
        'runtime-control-gapidentifier-tab-max');
      $(".pz-gap-panel", documentRef).css('width', _gapIdentifierPanelWidth + "px");
      $(".pz-gap-panel-body", documentRef).removeClass("gapidentifier-hidden");
      /* handle capture screen in US of guide */
      $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-min');
      $('.runtime-control-guide-tab', documentRef).addClass('runtime-control-guide-tab-max');
      $(".pz-guide-panel", documentRef).css('width', _gapIdentifierPanelWidth + "px");
      $(".pz-guide-panel-body", documentRef).removeClass("guide-hidden");
      /* handle capture screen in US of guide  - end*/
      topHarness.attr("_isPanelMinimized", false);
      _updateScreenLayoutFlex(_gapIdentifierPanelWidth);
    }
  }

  function minimizeAgileWorkbench() {
    topHarness.css({
      'position': 'absolute',
      'left': '0'
    });
    if (topHarness.attr("_isPanelMinimized") !== "true") {
      topHarness.attr("_isPanelMinimized", true);
      var newPanelWidth = 0;
      topHarness.css('right', newPanelWidth + "px");
      $('.runtime-control-gapidentifier-tab', documentRef).addClass(
        'runtime-control-gapidentifier-tab-min');
      $('.runtime-control-gapidentifier-tab', documentRef).removeClass(
        'runtime-control-gapidentifier-tab-max');
      $(".pz-gap-panel", documentRef).css('width', newPanelWidth + "px");
      $(".pz-gap-panel-body", documentRef).addClass("gapidentifier-hidden");
      /* handle capture screen in US of guide */
      $('.runtime-control-guide-tab', documentRef).addClass('runtime-control-guide-tab-min');
      $('.runtime-control-guide-tab', documentRef).removeClass('runtime-control-guide-tab-max');
      $(".pz-guide-panel", documentRef).css('width', newPanelWidth + "px");
      $(".pz-guide-panel-body", documentRef).addClass("guide-hidden");
      /* handle capture screen in US of guide  - end */
      $('.screen-layout-region-main-middle').css({
        'width': ''
      });
    }
  }
  /**
     * @private Handles enabling the resize ability for the side panel
     **/
  function _resizePanel() {
    var el = $(".pz-gap-panel");
    var count = el.outerWidth();
    el.css({
      'right': '0',
      'left': ''
    });
    //Sets rest of screen to absolute so it can be positioned
    desktopWindowCSSPosition = topHarness.css('position');
    topHarness.css({
      'position': 'absolute',
      'left': '0',
      'right': count + 'px',
      'min-width': '0'
    });
    _updateScreenLayoutFlex(count);
    var tempMouseUpHandler = function(e) {
      //Remove mouse up from window
      window.removeEventListener("mouseup", tempMouseUpHandler, true);
      //  $(document).triggerHandler("mouseup");
      return;
    };
    //Add mouse up event on capture phase
    $(".runtime-control-gapidentifier-resize")[0].addEventListener("mouseup", tempMouseUpHandler, true);
    //Define jquery objects outside of the resize event. This is a performance hit as resize
    //occurs on each mouse move and there is no need to reparse the dom to find the same
    //dom element
    _windowOuterWidth = $(window).outerWidth();
    $(".pz-gap-panel").css({
      'right': '0',
      'left': ''
    });
    $(".pz-gap-panel", documentRef).resizable({
      handles: {
        'w': '.runtime-control-gapidentifier-resize'
      },
      resize: function(event, ui) {
        var el = ui.element;
        var count = el.width();
        el.css({
          'right': '0',
          'left': ''
        });
        //Dont allow the resize to be bigger than the screen size
        if (count > _windowOuterWidth - 100) {
          count = _windowOuterWidth - 100;
          el.css({
            'width': count + 'px'
          });
        }
        //resize the screen to acount for width of panel
        topHarness.css({
          'right': count + 'px'
        });
        _updateScreenLayoutFlex(count);
      },
      start: function(event, ui) {
        topHarness.css({
          'position': 'absolute',
          'left': '0',
          'min-width': '0'
        });
        $(document.body).append("<div class='ui-gapidentifier-tree-mask'></div>");
      },
      stop: function(event, ui) {
        var runtimeControlPanelElement = $(".pz-gap-panel");
        runtimeControlPanelElement.queue(function() {
          $(".pz-gap-panel").dequeue();
        });
        _gapIdentifierPanelWidth = runtimeControlPanelElement.outerWidth();
        _isPanelMinimized = false;
        //Remove masking div
        $(".ui-gapidentifier-tree-mask").remove();
      }
    });
    //Onclick of the drag handle
    $(".runtime-control-gapidentifier-tab").click(function() {
      publicAPI.minimizeToggle(true);
    });
  }
  /**
     * @public Toggles GapIdentifier on or off
     */
  publicAPI.toggle = function(event) {
    // If we are in offline mode do not toggle, return instead    
    if (pega && pega.offline) {
      return;
    }
    if (pega.ui && pega.ui.composer && pega.ui.composer.isActive() && pega.ui.composer.toggleAgileWorkbench) {
      pega.ui.composer.toggleAgileWorkbench(event);
      return;
    }
    if ($('.pz-gap-tool').hasClass('noClick')) {
      $('.pz-gap-tool').removeClass('noClick');
      return false;
    }
    var hideCallBack = function() {
      //Post Hide code can be handled here
      var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
      var postDataURL = new SafeURL();
      strUrlSF.put("pyActivity", "pzClearGapIdentifierPages");
      var callback = function() {
        //Activity response
      }
      //pega.u.d.convertToRunActivityAction(strUrlSF);
      return pega.u.d.asyncRequest('POST', strUrlSF, callback, postDataURL);
    }
    var showCallBack = function() {
      var assetFooter = documentRef.querySelector('div[node_name="pzAssetFooter"]');
      if(assetFooter) {
        pega.u.d.reloadSection(assetFooter, null, null, false, false, -1, false,
                             null, null, null, null);
      }
    }
    if ($(".pz-gap-panel-active", documentRef).length !== 0) {
      publicAPI.hide(hideCallBack);
    } else {
      if ($(".runtime-control-panel-active", documentRef).length === 0) {
        publicAPI.show(showCallBack);
      }
    }
  }
  /**
         * @public Toggles GapIdentifier off on Export
         */
  publicAPI.hideOnExport = function() {
    // If we are in offline mode do not toggle, return instead
    if (pega && pega.offline) {
      return;
    }
    if ($('.pz-gap-tool').hasClass('noClick')) {
      $('.pz-gap-tool').removeClass('noClick');
      return false;
    }
    var hideCallBack = function() {
      //Post Hide code can be handled here
      var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
      var postDataURL = new SafeURL();
      strUrlSF.put("pyActivity", "pzClearGapIdentifierPages");
      var callback = function() {
        //Activity response
      }
      return pega.u.d.asyncRequest('POST', strUrlSF, callback, postDataURL);
    }
    if ($(".pz-gap-panel-active", documentRef).length !== 0) {
      publicAPI.hide(hideCallBack);
    }
  }

  publicAPI.checkExtensionInfo = function() {
    if(pega.screen) {
    pega.screen.api.extensionInstalled();
    }
  }
  /**
         * @public refreshes AW on drag-drop performed in app management view
         */
  publicAPI.checkAndPrepareAWRefresh = function(itemInfo) {
    var oSafeURL = new SafeURL("Pega-Agile-Work.pzCheckAndPrepareAWRefresh");
    oSafeURL.put("pzPrimaryPageName", "D_pzAgileWorkbench");
    oSafeURL.put("itemInfo", itemInfo);
      var currentCtx = pega.ctxmgr.getCurrentHarnessContext();
      pega.ctxmgr.setRootDocumentContext();
    
    var refreshAWSuccess = function(result) {
      if (result.responseText === "true") { // This can be replaced with just if(result). 
          //However, at the time of implementation this isn't working - keeping the comment as TBD
          var element = "";
          if (pega.u.d.portalName === "pxExpress") element = $(
            "div[node_name='pzGapIdentifier_Panel']", document);
          else element = $(".pz-gap-panel-body > div", documentRef);
          if (element.length !== 0) {
            publicAPI.checkExtensionInfo();
            pega.u.d.reloadSection(element[0], "", "", false, false, -1, false, null,
                                   null, null, null);
          }
        }
          pega.ctxmgr.setContext(currentCtx); 
      };

      var refreshAWFailure = function(o) {
         pega.ctxmgr.setContext(currentCtx); 
      };
   
     var refreshAWCallback = {
        success: refreshAWSuccess,
        failure: refreshAWFailure
      };
      pega.u.d.asyncRequest('POST', oSafeURL, refreshAWCallback);
  }

  /**
         * @public Opens GapIdentifier on click of link from app management view
         */
  publicAPI.showItemFromAppMgmtView = function(ItemID, FeatureID, AppInsName, FeatureName) {
    var params = "&ItemID=" + ItemID + "&FeatureID=" + FeatureID + "&AppInsName=" + AppInsName +
        "&FeatureName=" + FeatureName;
    var callback = function() {
      //Post Show code can be handled here
    }
    // If we are in offline mode do not toggle, return instead
    if (pega && pega.offline) {
      return;
    }
    if (pega.ui.guide.isApplicationGuideOpen()) {
      pega.ui.guide.toggle();
    }
    if (publicAPI.isAgileWorkBenchOpen()) {
      var element = $(".pz-gap-panel-body > div", documentRef);
      if (element.length !== 0) {
        publicAPI.checkExtensionInfo();
        pega.u.d.reloadSection(element[0], "pzShowWorkItem", params, false, false, -1, false, null,
                               null, null, callback);
      }
      if (topHarness.attr("_isPanelMinimized") === "true") {
        publicAPI.maximizeToggle(true);
      }
      return;
    }
    var showCallBack = function() {}
    publicAPI.checkExtensionInfo();
    publicAPI.show(showCallBack, "pzShowWorkItem", params);
    return;
  }
  /**
         * @public Opens GapIdentifier on click of link from app management view
         */
  publicAPI.createItemFromAppMgmtView = function(ItemType, AppInsName, FeatureID, FeatureName) {
    var params = "&ItemType=" + ItemType + "&AppInsName=" + AppInsName + "&FeatureID=" + FeatureID +
        "&FeatureName=" + FeatureName;
    var callback = function() {
      //Post Show code can be handled here
    }
    // If we are in offline mode do not toggle, return instead
    if (pega && pega.offline) {
      return;
    }
    if (publicAPI.isAgileWorkBenchOpen()) {
      var element = $(".pz-gap-panel-body > div", documentRef);
      if (element.length !== 0) {
        publicAPI.checkExtensionInfo();
        pega.u.d.reloadSection(element[0], "pzCreateWorkItemWrapper", params, false, false, -1,
                               false, null, null, null, callback);
      }
      if (topHarness.attr("_isPanelMinimized") === "true") {
        publicAPI.maximizeToggle(true);
      }
      return;
    }
    var showCallBack = function() {}
    publicAPI.checkExtensionInfo();
    publicAPI.show(showCallBack, "pzCreateWorkItemWrapper", params);
    return;
  }
  publicAPI.refreshAppMgmtView = function() {
    if (pega.u.d.portalName === "pxExpress") {
      this.refreshAppMgmtViewExp()
    }
    else{
      var iframeArray = $("iframe");
      for (var i = 0; i < iframeArray.length; i++) {
        var eleID = iframeArray[i].id;
        var elem = $("#" + eleID).contents().find("div[node_name='pzLPApplicationOverview']");
        if (elem.length !== 0) {
          var iframe = iframeArray[i];
          var document = iframe.contentDocument || iframe.contentWindow.document;
          iframe.contentWindow.pega.application.features.refreshAppMgmtViewForFeature(document);
          }
        }
      }
    }
  publicAPI.refreshAppMgmtViewExp = function() {
    var elem = document.querySelectorAll("div[node_name='pzLPApplicationOverview']");
    if (elem.length !== 0) {
      var currentcontext = pega.ctxmgr.getCurrentHarnessContext();
      pega.ctxmgr.setRootDocumentContext();
      var dcSpaContext = pega.ctxmgr.getDCSPAContext();
      pega.application.features.refreshAppMgmtViewForFeature(document,currentcontext,dcSpaContext);
    }

  }
  publicAPI.refreshAWOnDragDrop = function(draggedWI) {
    var callback = function() {
      //Post Show code can be handled here
    }
    var element = $("div[node_name='pzFeaturesOverviewLeftLayout']", document);
    if (element.length !== 0) {
      pega.u.d.reloadSection(element[0], "pzRefreshAppOverview", "", false, false, -1, false, null,
                             null, null, callback);
    }
  }
  /**
         * @public Opens GapIdentifier on click of workitem counts from Feature card view
         */
  publicAPI.showItemsByFeatureFromAppMgmtView = function(FeatureInsKey, Tab) {
    var params = "&FeatureInsKey=" + FeatureInsKey + "&Tab=" + Tab;
    var callback = function() {
      //Post Show code can be handled here
    }
    // If we are in offline mode do not toggle, return instead
    if (pega && pega.offline) {
      return;
    }
    if (publicAPI.isAgileWorkBenchOpen()) {
      var element = $(".pz-gap-panel-body > div", documentRef);
      if (element.length !== 0) {
        publicAPI.checkExtensionInfo();
        pega.u.d.reloadSection(element[0], "pzShowWorkItemByFeature", params, false, false, -1,
                               false, null, null, null, callback);
      }
      if (topHarness.attr("_isPanelMinimized") === "true") {
        publicAPI.maximizeToggle(true);
      }
      return;
    }
    var showCallBack = function() {}
    publicAPI.checkExtensionInfo();
    publicAPI.show(showCallBack, "pzShowWorkItemByFeature", params);
    return;
  }
  /**
         * @public Toggles gapidentifier from inside the iframe
         */
  publicAPI.toggleGIFromIframe = function(event) {
      documentRef = document;
      publicAPI.toggle();
    
  }
  /**
         * @public Toggles gapidentifier from inside the iframe
         */
  publicAPI.toggleCompleteRejectItem = function(event) {
    var target = event.target || event.srcElement;
    var rowElem = $(target).parents(".pz-gap-item-row");
    if (rowElem.hasClass("visible")) {
      rowElem.removeClass("visible");
      rowElem.children(".item-2").children("div").css("right", "");
    } else {
      rowElem.parents("div[node_name='pzAssetContent']").find(".pz-gap-item-row.visible").each(
        function() {
          $(this).removeClass("visible");
          $(this).children(".item-2").children("div").css("right", "");
        });
      rowElem.addClass("visible");
      rowElem[0].offsetHeight; // force a redraw of the element before triggering the transition
      rowElem.children(".item-2").children("div").css("right", "0");
    }
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  }
  /* the code below is copied from case management attachment widget to gap identifer as the case management widget does not handle showing attachments using source stream and does not expose the innner functions as public hence we have replicated the code here*/
  var haveDocumentViewer = function() {
    var launchBox = pega.mobile.hybrid.getLaunchBox();
    return (launchBox && launchBox.DocumentViewer);
  };
  var isMobileBrowser = function() {
    return /Android|webOS|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(navigator.userAgent);
  };
  var showInDocViewer = function(relativeUrl, event, isAbsUrl, switchToLocal) {
    var absUrl = isAbsUrl ? relativeUrl : window.location.protocol + "//" + window.location.host +
        relativeUrl;
    var busyInd = new pega.ui.busyIndicator("", true, null);
    var srcElem = getSourceElem(event);
    if (srcElem) {
      busyInd.setTargetElement(srcElem);
    }
    busyInd.show();
    var cbFunctions = function(switchToLocal, success) {
      if (success) {
        return function() {
          console.debug('Attachment opened successfully' + switchToLocal);
          // console.log(this); 
          busyInd.hide();
          if (switchToLocal) pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION
                                                                 .LOCAL);
        };
      } else {
        return function(error) {
          console.error('Failed to open attachment: ' + error.description);
          busyInd.hide();
          if (switchToLocal) pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION
                                                                 .LOCAL);
        };
      }
    };
    var cbDocViewer = {
      onSuccess: cbFunctions(switchToLocal, true),
      onProgress: function() {},
      onFailure: cbFunctions(switchToLocal)
    };
    pega.mobile.hybrid.getLaunchBox().DocumentViewer.open(absUrl, {}, cbDocViewer);
  };
  var downloadOnClick = function(downloadUrl, event) {
    var windowParams = "resizable=yes,scrollbars=yes,status=yes";
    var elemId = "ATTACHMENT-DATA";
    var createTempFrame = function() {
      var tempFrame = document.createElement('iframe');
      tempFrame.id = elemId;
      tempFrame.style.display = 'none';
      document.body.appendChild(tempFrame);
      return tempFrame;
    };
    try {
      if (haveDocumentViewer()) {
        showInDocViewer(downloadUrl, event);
      } else if (isMobileBrowser()) {
        window.openUrlInWindow(downloadUrl, "Attachment", windowParams);
      } else if (document.addEventListener) // feature detection for IE9+ browsers
      {
        var elem = getTopWindow().document.getElementById(elemId);
        if (null == elem) {
          elem = document.getElementById(elemId);
        }
        if (null == elem) {
          elem = createTempFrame();
        }
        elem.src = downloadUrl;
      } else {
        // Eng-10954/SR-103684/Bug-138864/Bug-140892 : kumad1 04/15/14
        window.open(downloadUrl, "Attachment", windowParams);
      }
    } catch (E) {
      console.error("Error displaying attachment: ", downloadUrl, E);
      if (document.all[elemId]) {
        document.getElementById(elemId).src = downloadUrl;
      } else {
        var tempFrame = createTempFrame();
        tempFrame.src = downloadUrl;
      }
    }
  };
  publicAPI.processInlineImageAW = function(ls, oc, insn, insk, lrt, jString, ftype, showInline, storageType,
                                             filename, fileLabel, fileLabelTooltip, timestamp) {
    ls = sanitizeParameterValue(ls);
    oc = sanitizeParameterValue(oc);
    insn = sanitizeParameterValue(insn);
    insk = sanitizeParameterValue(insk);
    lrt = sanitizeParameterValue(lrt);
    ftype = sanitizeParameterValue(ftype);
    showInline = sanitizeParameterValue(showInline);
    storageType = sanitizeParameterValue(storageType);
    filename = sanitizeParameterValue(filename);
    fileLabel = sanitizeParameterValue(fileLabel);
    fileLabelTooltip = sanitizeParameterValue(fileLabelTooltip);
    jString.attachKey = lrt;
    if (showInline === "true") {
      var displayActivityJSON = [];
      displayActivityJSON.activityName = (storageType === "External") ? "GetAttachmentReference" :
      "DisplayAttachFile";
      displayActivityJSON.activityClass = "Work-";
      displayActivityJSON.activityParams = [];
      if ((storageType === "External")) {
        displayActivityJSON.activityParams.push({
          'paramName': 'linkInsHandle',
          'paramValue': insk
        });
      } else {
        displayActivityJSON.activityParams.push({
          'paramName': 'LinkedRefTo',
          'paramValue': lrt
        });
      }
      jString.displayActivityJSON = displayActivityJSON;
    }
    var downloadURL = filename;
    var isImage = (ftype === "png" || ftype === "jpg" || ftype === "jpeg" || ftype === "bmp" || ftype ===
                   "gif");
    var isVideo = (ftype === "webm" || ftype === "mp4" || ftype === "ogg" || ftype === "ogv" || ftype ===
                   "m4v");
    if ((isImage || isVideo) && showInline === "true") {
      downloadURL = SafeURL_createFromURL(pega.u.d.url);
      if (storageType === "External") {
        downloadURL.put("pyActivity", "Work-.GetAttachmentReference");
        downloadURL.put("linkInsHandle", insk);
      } else {
        downloadURL.put("pyActivity", "Work-.DisplayAttachFile");
        downloadURL.put("LinkedRefTo", lrt);
      }
      pega.u.d.convertToRunActivityAction(downloadURL);
      downloadURL = downloadURL.toURL();
    }
    if (ftype === "tif" || ftype === "tiff") {
      isImage = true;
    }
    var imgdiv = document.getElementById("img" + timestamp);
    var customStyle = "cursor: pointer; display: inline; width: 150px; height: 130px;";
    var onClickAction_launchPreview = function(e) {
      pega.ui.HarnessActions.doAttachmentSingleClick(ls, oc, insn, insk, null, null, lrt,
                                                     showInline, jString);
    };
    if (imgdiv) {
      var extn = downloadURL.substring(downloadURL.lastIndexOf(".") + 1, downloadURL.length);
      var tempDownloadURL = (extn.toLowerCase() === "svg" ? downloadURL +
                             '#svgView(preserveAspectRatio(none))' : downloadURL);
      if (showInline === "true") {
        if (isVideo) {
          var videoType = ftype;
          if (videoType === 'ogv') videoType = 'ogg';
          if (videoType === 'm4v') videoType = 'mp4';
          imgdiv.innerHTML =
            '<video width="150px" height="130px" style="object-fit:fill" preload="metadata" > <source src="' +
            downloadURL + ' "type="video/' + videoType + '"></video>';
          imgdiv.children[0].onclick = onClickAction_launchPreview;
          var videoOverlay = document.getElementById("gapAttachmentOverlayForVideo" + timestamp);
          videoOverlay.style.display = "flex";
          videoOverlay.onclick = onClickAction_launchPreview;
        } else {
          imgdiv.innerHTML = '<img class="attach_Icon" style="' + customStyle + '" src="' +
            tempDownloadURL + '" alt="' + fileLabel + '" onError="replaceBrokenPoster(this)"/>';
          imgdiv.children[0].onclick = onClickAction_launchPreview;
        }
      } else {
        imgdiv.innerHTML = '<img class="attach_Icon" style="' + customStyle + '" src="' +
          tempDownloadURL + '" alt="' + fileLabel + '"/>';
        imgdiv.children[0].onclick = function(e) {
          pega.ui.HarnessActions.doAttachmentSingleClick(ls, oc, insn, insk, null, null, lrt);
        };
      }
    }
    var nameLinkTD = document.getElementById("attachNameLink" + timestamp);
    if (nameLinkTD) {
      nameLinkTD.innerHTML =
        '<a href="#" style="word-break: break-all;overflow: hidden;display: inline-block;" title="' +
        fileLabelTooltip + '">' + fileLabel + '</a>';
      if (showInline === "true" && (isImage || isVideo || ftype === "pdf")) {
        nameLinkTD.children[0].onclick = onClickAction_launchPreview;
      } else {
        nameLinkTD.children[0].onclick = function(e) {
          pega.ui.HarnessActions.doAttachmentSingleClick(ls, oc, insn, insk, null, null, lrt);
        };
      }
    }
  }
  publicAPI.processInlineImageAW_Integrated = function(jString, stepPage, className, ftype, showInline,
                                                        webStorageEnabled, filename, fileLabel, fileLabelTooltip, strURL, fileStream, timestamp) {
    ftype = sanitizeParameterValue(ftype);
    showInline = sanitizeParameterValue(showInline);
    filename = sanitizeParameterValue(filename);
    fileLabel = sanitizeParameterValue(fileLabel);
    fileLabelTooltip = sanitizeParameterValue(fileLabelTooltip);
    var urlSource = "";
    if (className === "Data-WorkAttach-URL") {
      urlSource = strURL;
    }
    var downloadURL = filename;
    var isImage = (ftype === "png" || ftype === "jpg" || ftype === "jpeg" || ftype === "bmp" || ftype ===
                   "gif");
    var isVideo = (ftype === "webm" || ftype === "mp4" || ftype === "ogg" || ftype === "ogv" || ftype ===
                   "m4v");
    if (isImage && (webStorageEnabled !== "true") && showInline === "true") {
      downloadURL = "data:image/" + ftype + ";base64," + fileStream.trim();
    }
    if (isVideo && (webStorageEnabled !== "true") && showInline === "true") {
      downloadURL = "data:video/" + ftype + ";base64," + fileStream.trim();
    }
    if (ftype === "tif" || ftype === "tiff") {
      isImage = true;
    }
    var imgdiv = document.getElementById('img' + timestamp);
    if (jString) {
      jString.doNotUseEV = "true";
    }
    var clickAction_downloadAtt = function(event) {
      pega.ui.gapidentifier.downloadPMAttachment(event, stepPage, false);
    };
    var clickAction_previewAtt = function(event) {
      pega.ui.gapidentifier.downloadPMAttachment(event, stepPage, true, jString);
    };
    var clickAction_openURL = function(event) {
      pega.ui.gapidentifier.openURLPMAttachment(urlSource);
    };
    var extn = downloadURL.substring(downloadURL.lastIndexOf(".") + 1, downloadURL.length);
    var tempDownloadURL = (extn === "svg" ? downloadURL + '#svgView(preserveAspectRatio(none))' :
                           downloadURL);
    if (imgdiv) {
      var customStyle = "cursor: pointer; display: inline; width: 150px; height: 130px;";
      imgdiv.innerHTML = '<img class="attach_Icon" style="' + customStyle + '" src="' +
        tempDownloadURL + '" alt="' + fileLabel + '"/>';
      if (webStorageEnabled === "true") {
        imgdiv.children[0].onclick = clickAction_downloadAtt;
      } else if ((isImage || ftype === "pdf") && showInline === "true") {
        imgdiv.children[0].onclick = clickAction_previewAtt;
      } else if (isVideo && showInline === "true") {
        var videoType = ftype;
        if (videoType === 'ogv') videoType = 'ogg';
        if (videoType === 'm4v') videoType = 'mp4';
        imgdiv.innerHTML =
          '<video width="150px" height="130px" style="object-fit:fill" preload="metadata" > <source src="' +
          downloadURL + ' "type="video/' + videoType + '"></video>';
        imgdiv.children[0].onclick = clickAction_previewAtt;
        var videoOverlay = document.getElementById('gapAttachmentOverlayForVideo' + timestamp);
        videoOverlay.style.display = "flex";
        videoOverlay.onclick = clickAction_previewAtt;
      } else if (className === "Data-WorkAttach-URL") {
        imgdiv.innerHTML = '<img class="attach_Icon" style="' + customStyle + '" src="' +
          tempDownloadURL + '" alt="' + fileLabel + '"/>';
        imgdiv.children[0].onclick = function(event) {
          pega.ui.gapidentifier.openURLPMAttachment(urlSource);
        };
      } else {
        imgdiv.children[0].onclick = clickAction_downloadAtt;
      }
    }
    var nameLinkTD = document.getElementById('attachNameLink' + timestamp);
    if (nameLinkTD) {
      var customStyle = "word-break: break-all;overflow: hidden;display: inline-block;";
      if (className === "Data-WorkAttach-URL") {
        nameLinkTD.innerHTML = '<a href="#" style="' + customStyle + '" title="' + fileLabelTooltip +
          '">' + fileLabel + '</a>';
        nameLinkTD.children[0].onclick = clickAction_openURL;
      } else {
        if ((isImage || isVideo || ftype === "pdf") && showInline === "true") {
          nameLinkTD.innerHTML = '<a href="#" style="' + customStyle + '" title="' +
            fileLabelTooltip + '">' + fileLabel + '</a>';
          nameLinkTD.children[0].onclick = clickAction_previewAtt;
        } else {
          nameLinkTD.innerHTML = '<a href="#" style="' + customStyle + '" title="' +
            fileLabelTooltip + '">' + fileLabel + '</a>';
          nameLinkTD.children[0].onclick = clickAction_downloadAtt;
        }
      }
    }
  }

  function sanitizeParameterValue(targetParamValue) {
    if (targetParamValue !== null) {
      return targetParamValue.trim();
    } else {
      return null;
    }
  }

  var getTopWindow = function() {
    var dtWin = pega.desktop.support.getDesktopWindow();
    return (dtWin ? dtWin : window);
  }
  /* public method to download attachment when integrated as the activity called uses the source code instead of getting the source from database*/
  publicAPI.downloadPMAttachment = function(event, pageName, useInlineView, jsonString) {
    var oSafeURL = SafeURL_createFromURL(pega.u.d.url);
    oSafeURL.put("pyActivity", "Pega-Agile-Work.pyDownloadAttachment");
    oSafeURL.put("pzPrimaryPageName", pageName);
    pega.u.d.convertToRunActivityAction(oSafeURL);
    // pega.ui.HarnessActions.doAttachmentSingleClickAWB(event, jsonString, oSafeURL.toURL(), useInlineView);
    pega.c.AttachUtil.checkTokenAndDisplayAttachment_pegaSocial_inline(event, jsonString, oSafeURL.toURL(),
                                                                       useInlineView,oSafeURL.toURL());
  };
  publicAPI.openURLPMAttachment = function(url) {
    window.open(url);
  };
  return publicAPI;
})();
window.addEventListener("load", function() {
  if (pega.u.d.portalName !== "pxExpress" && pega.u.d.isAgileWorkbenchEnabled === true) {
    pega.ui.gapidentifier.initialize();
  }
});
//static-content-hash-trigger-YUI
var $pNamespace = pega.namespace;
$pNamespace("pega.screen");

pega.screen.attachment_client = (function () { 

  var publicAPI = {    
    capture_invokedFrom: "NA",
    busyThrobber: new pega.ui.busyIndicator("", true, pega.desktop.support.getDesktopWindow().document.body, 0), 
    createCase: "",
    caseType: "",

    initScreenAPI: function() {
      var refreshWorkbenchFooter = function() {
        var footer = "pzAssetFooter";
        footer = pega.u.d.getSectionByName(footer);
        if (footer) {
          pega.u.d.reloadSection(footer, '', '', false, false, '-1', false);
        }
      };
      pega.screen.api.init(refreshWorkbenchFooter);
    },

    captureScreenshot: function(event, createCase, caseType) {      
      this.createCase = createCase;
      this.caseType = caseType; 
      var parent_ctx = getParentWindowCtx();
      if(parent_ctx.pega.screen) {
        parent_ctx.pega.screen.api.captureSnapshot(event, function(){pega.screen.attachment_client.minimizeParentPanel()}, 
                                                   function(){pega.screen.attachment_client.maximizeParentPanel()}, 
                                                   function(){pega.screen.attachment_client.uploadContent(pega.screen.api.getCapturedContent(), "png")});      
      } else {
        console.error("Screen capture script is missing");
      }      
    },    

    recordVideo: function(event, createCase, caseType) {
      this.createCase = createCase;
      this.caseType = caseType; 
      var parent_ctx = getParentWindowCtx();
      if(parent_ctx.pega.screen) {
        parent_ctx.pega.screen.api.recordVideo(event, function(){pega.screen.attachment_client.minimizeParentPanel()}, 
                                               function(){pega.screen.attachment_client.maximizeParentPanel()}, 
                                               function(){pega.screen.attachment_client.uploadContent(pega.screen.api.getCapturedContent(), "webm")});      
      } else {
        console.error("Record video script is missing");
      }
    },

    maximizeParentPanel: function() {
      var parentPanel = this.getParentPanel();
      if(parentPanel === "ag") {
        pega.ui.guide.maximizeToggle();
      } else {
        pega.ui.gapidentifier.maximizeToggle();
      }
      this.capture_invokedFrom = "NA";
    },

    minimizeParentPanel: function() {
      var parentPanel = this.getParentPanel();
      if(parentPanel === "ag") {
        pega.ui.guide.minimizeToggle();
      } else {
        pega.ui.gapidentifier.minimizeToggle();
      }  
    },

    getParentPanel: function() {
      var parentPanel = this.capture_invokedFrom;  
      if(parentPanel === undefined || parentPanel === "NA") {
        if (pega.u.d.portalName === "pxExpress") {
          var agPanelTemp = pega.ui.composer.getCurrentComposerWindow().pega.ui.agPanelExpress;
          if(agPanelTemp) {        
            if(agPanelTemp.isShowing()) {
              parentPanel = "ag";
            }
          }
        } else {
          parentPanel = pega.desktop.support.getDesktopWindow().document.querySelector('div[node_name="pzApplicationGuidesWrapper"] div[node_name="pzUserStoryWrapperForAppGuide"]');
          if(parentPanel) {
            parentPanel = "ag";
          }
        }
      }
      this.capture_invokedFrom = parentPanel;
      return parentPanel;
    },

    uploadContent: function(uploadData, mediaType) {
      this.busyThrobber.show();
      var uploadURL = SafeURL_createFromEncryptedURL(pega.u.d.url);
      uploadURL.put("pyActivity", "Pega-Agile-SmartFeedback.pzAttachFeedbackFile");
      uploadURL.put("pzPrimaryPageName", "D_pzAgileSmartFeedback");
      uploadURL.put("fileType", mediaType);
      uploadURL.put("value", uploadData);
      uploadURL.put("CreateCase", this.createCase);

      if(this.caseType) {
        uploadURL.put("CaseTypeClass", this.caseType);
      }
      var data = {
        value: uploadData
      };

      var uploadCleanup = function() {        
        pega.screen.attachment_client.busyThrobber.hide();
        pega.screen.attachment_client.maximizeParentPanel();
      }
      var uploadSuccess = function(result) {
        uploadCleanup();
        if(result.responseText === "Success") { 
          var isCreateCase = pega.screen.attachment_client.createCase;
          var sectionNode = (isCreateCase=="true") ? "pzGapIdentifierWrapper" : "pzGapIdentifierAttachments";
          sectionNode = pega.u.d.getSectionByName(sectionNode);    

          if (sectionNode) {
            pega.u.d.reloadSection(sectionNode, '', '', false, false, '-1', false);
            if(isCreateCase=="true"){
              pega.ui.gapidentifier.refreshAppMgmtView();
            }
          }
        } else {
          alert(result.responseText);
        }
      };
      var uploadFailure = function(result) {
        uploadCleanup();
        alert(result.responseText);
      };
      var uploadCallback = {
        success: uploadSuccess,
        failure: uploadFailure,
        argument: null
      };

      pega.u.d.asyncRequest('POST', uploadURL, uploadCallback, null);
    }
  };

  function getParentWindowCtx() {
    return ((pega.u.d.portalName === "pxExpress") ? pega.ui.composer.getCurrentComposerWindow() : pega.desktop.support.getDesktopWindow());
  }

  return publicAPI;
}());
//static-content-hash-trigger-GCC
