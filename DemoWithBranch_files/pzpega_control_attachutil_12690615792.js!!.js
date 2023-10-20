(function(pega) {
  if (!pega.control) {
    pega.c = pega.namespace("pega.control");
  } else {
    pega.c = pega.control;
  }
  if (!pega.c.AttachUtil) {
    /*-----------------------------------------
         * Utility methods for attachments
         *-----------------------------------------*/
    var isBlank = function(sval) {
      return (!sval || sval.trim() === "");
    };
    var hasValue = function(sval) {
      return !isBlank(sval);
    };
    var setUploadEncoding = function(oForm) {
      oForm.encoding = "multipart/form-data";
    };
    var setFormEncoding = function(oForm) {
      oForm.encoding = "application/x-www-form-urlencoded";
    };
    var browserSupportsFileList = function() {
      return (window.File && window.FileReader && window.FileList);
    };
    var getTopWindow = function() {
      var dtWin = pega.desktop.support.getDesktopWindow();
      return (dtWin ? dtWin : window);
    };
    var haveDocumentViewer = function() {
      var launchBox = pega.mobile.hybrid.getLaunchBox();
      return (launchBox && launchBox.DocumentViewer);
    };
    var isMobileBrowser = function() {
      return /Android|webOS|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(navigator.userAgent);
    };
    var isPIMC = navigator.userAgent.indexOf("PegaMobile") > -1;
    var getSourceElem = function(event) {
      var src;
      if (!event) {
        // If caller does not, or cannot, pass event, try one last time to get it from the call stack.
        event = this.getRunScriptEvent();
      }
      if (event) {
        src = event.srcElement ? event.srcElement : event.target;
      }
      return src;
    };
    /* Checks if user has an auth token for the storage location (or does not need one)*/
    var checkAppStorageOkToAttach = function(tokenCallback) {
      var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
      strUrlSF.put("pyActivity", "pzAppStorageOkToAttachFile");
      var callBack = {
        success: function(response) {
          var authenticated = response.responseText;
          tokenCallback(authenticated);
        }
      };
      var response = pega.u.d.asyncRequest('GET', strUrlSF, callBack, null, null);
      return response;
    };
    var previewInPIMC = function(relativeUrl, event, isAbsUrl, switchToLocal) {
      var absUrl = isAbsUrl ? relativeUrl : window.location.protocol + "//" + window.location.host + relativeUrl;

      var cbFunctions = function(switchToLocal, success) {
        if (success) {
          return function() {
            console.debug('Attachment opened successfully' + switchToLocal);
            // console.log(this);
            if (switchToLocal) pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION
                                                                   .LOCAL);
          };
        } else {
          return function(error) {
            var errorMessage = 'Failed to open attachment "' + absUrl + '"';
            if (error) {
              errorMessage += '. Reason: ' + error.description;
            }
            console.error(errorMessage);
            if (switchToLocal) pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION
                                                                   .LOCAL);
          };
        }
      };
      // call Hybrid Client API
      // bajaa for TASK-475834 enhanced to support switching back

      pega.mobile.sdk.plugins.documents.preview(absUrl).then(function() {
        console.debug("Attachment downloaded and previewed with success");
        cbFunctions(switchToLocal, true)();
      }).catch(function() {
        cbFunctions(switchToLocal)();
      });

    };
    var showInDocViewer = function(relativeUrl, event, isAbsUrl, switchToLocal) {
      var absUrl = isAbsUrl ? relativeUrl : window.location.protocol + "//" + window.location.host +
          relativeUrl;
      // BUG-244487 : shows indicator on download progress
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
      // call Hybrid Client API
      // bajaa for TASK-475834 enhanced to support switching back
      var cbDocViewer = {
        onSuccess: cbFunctions(switchToLocal, true),
        onProgress: function() {},
        onFailure: cbFunctions(switchToLocal)
      };
      pega.mobile.hybrid.getLaunchBox().DocumentViewer.open(absUrl, {}, cbDocViewer);
    };
    var displayAttachment = function(downloadUrl, downloadURLFromInlinePreview, event, useInlineView,
                                      attachmentMetadataObj) {
      var elemId = "ATTACHMENT-DATA";
      var useExternalViewer = "false";
      if (useInlineView && attachmentMetadataObj !== undefined && attachmentMetadataObj !== null) {
        var currentPreviewID = attachmentMetadataObj.uniqueID;
        var isHeaderRequired = attachmentMetadataObj.isHeaderRequired;
        var isDownloadRequired = attachmentMetadataObj.isDownloadRequired;
        var previewWrapperDiv = attachmentMetadataObj.targetDiv;
        var displayType = attachmentMetadataObj.displayType;
        var configuredHeight = attachmentMetadataObj.height;
        var configuredWidth = attachmentMetadataObj.width;
        var fallbackThumbnail = attachmentMetadataObj.fallbackThumbnail;
        var maintainAspectRatio = attachmentMetadataObj.maintainAspectRatio;
        if (attachmentMetadataObj.doNotUseEV !== "true" && pega.c.EVAUtil) {
          var evDetails = pega.c.EVAUtil.getExternalViewerDetails(attachmentMetadataObj);
          useExternalViewer = evDetails.useExternalViewer;
        } else {
          useExternalViewer = "false";
        }
        if (useExternalViewer === "false" && isOfficeAttachment(attachmentMetadataObj.fileType)) {
          useInlineView = false;
        }
      }
      var windowParams = "resizable=yes,scrollbars=yes,status=yes";
      var createTempFrame = function() {
        var tempFrame = document.createElement('iframe');
        tempFrame.id = elemId;
        tempFrame.style.display = 'none';
        document.body.appendChild(tempFrame);
        return tempFrame;
      };

      function createWrapperDiv(style) {
        var wrapperDiv = document.getElementById("ATTACHMENT-WRAPPER-DIV");
        if (wrapperDiv != null) {
          $("#ATTACHMENT-WRAPPER-DIV").remove();
        }
        wrapperDiv = document.createElement('div');
        wrapperDiv.id = "ATTACHMENT-WRAPPER-DIV";
        wrapperDiv.setAttribute('class', style);
        document.body.appendChild(wrapperDiv);
        return wrapperDiv;
      }

      function createHeader(targetDiv, style) {
        targetDiv.innerHTML = '<div id="ATTACHMENT-PREVIEW-HEADER" class="' + style + '"></div>';
        var headerDiv = document.getElementById("ATTACHMENT-PREVIEW-HEADER");
        headerDiv.innerHTML =
          '<div id="ATTACHMENT-PREVIEW-HEADER-INFO" class="attachment-inline-preview-header-info"></div>';
        headerDiv.innerHTML = headerDiv.innerHTML +
          '<div id="ATTACHMENT-PREVIEW-HEADER-DOWNLOAD-LINK" class="attachment-inline-preview-header-download-link"></div>';
        headerDiv.innerHTML = headerDiv.innerHTML +
          '<div id="ATTACHMENT-PREVIEW-HEADER-CLOSE-LINK" class="attachment-inline-preview-header-close-link"></div>';
        if (isHeaderRequired !== "false") {
          createHeaderInfoPart(document.getElementById("ATTACHMENT-PREVIEW-HEADER-INFO"));
        }
        if (isDownloadRequired !== "false") {
          createHeaderDownloadLinkPart(document.getElementById(
            "ATTACHMENT-PREVIEW-HEADER-DOWNLOAD-LINK"));
        }
        createHeaderCloseLinkPart(document.getElementById("ATTACHMENT-PREVIEW-HEADER-CLOSE-LINK"));
      }

      function createHeaderInfoPart(targetDiv) {
        var headerTitle = attachmentMetadataObj.fileName;
        var titleClass = "attachment-inline-preview-header-info-title";
        var titleHTML = '<div id="ATTACHMENT-PREVIEW-HEADER-INFO-TITLE" class="' + titleClass + '"><h1>' +
            headerTitle + '<span>.' + attachmentMetadataObj.fileType + '</span></h1></div>';
        targetDiv.innerHTML = targetDiv.innerHTML + titleHTML;
        var fileType = getFileTypeFromExtension(attachmentMetadataObj.fileType);
        var uploadedOn = attachmentMetadataObj.uploadedOn;
        var uploadedBy = attachmentMetadataObj.uploadedBy;
        var attachmentMetadata = fileType + " | " + uploadedOn + " " + uploadedBy;
        var metaClass = "attachment-inline-preview-header-info-meta";
        var metaHTML = '<div id="ATTACHMENT-PREVIEW-HEADER-INFO-META" class="' + metaClass + '">' +
            attachmentMetadata + '</div>';
        targetDiv.innerHTML = targetDiv.innerHTML + metaHTML;
      }

      function createHeaderDownloadLinkPart(targetDiv) {
        var downloadLinkClass = "attachment-inline-preview-header-links-download";
        var downloadLinkText = pega.u.d.fieldValuesList.get("pzDownload") + " " + attachmentMetadataObj.fileType
        .toUpperCase();
        var downloadLinkHTML = '<a id="inlineDownload" tabindex=0 role="link" title="' +
            downloadLinkText + '" class="' + downloadLinkClass +
            '"><i class="pi pi-download"></i> <span>' + downloadLinkText + '</span></a>';
        targetDiv.innerHTML = targetDiv.innerHTML + downloadLinkHTML;
        var action_downloadAttachment = function(e) {
          if (downloadURLFromInlinePreview == null) {
            alert(pega.u.d.fieldValuesList.get("pzAttachDownloadURLBroken"));
            return;
          }
          if (isMobileBrowser()) {
            if ($('html').hasClass("iOS")) {
              window.openUrlInWindow(downloadURLFromInlinePreview, "Attachment", windowParams);
            } else {
              downloadAttachmentUsingURL(downloadURLFromInlinePreview);
            }
          } else {
            downloadAttachmentUsingURL(downloadURLFromInlinePreview);
          }
        };
        $(document).on("click", "#inlineDownload", action_downloadAttachment);
        $(document).on("keypress", "#inlineDownload", function(event) {
          if (event.which === 13 || event.keyCode === 13) {
            action_downloadAttachment(event);
          }
        });
      }

      function createHeaderCloseLinkPart(targetDiv) {
        var closeLinkClass = "attachment-inline-preview-header-links-close";
        var closeTooltip = pega.u.d.fieldValuesList.get("pzClose");
        var closeLinkHTML = '<a id="inlineClose" tabindex=0 role="link" title="' + closeTooltip +
            '" class="' + closeLinkClass + '"><i class="pi pi-times"/></a>';
        targetDiv.innerHTML = targetDiv.innerHTML + closeLinkHTML;
        $(document).on('click', '#inlineClose', function() {
          $("#ATTACHMENT-WRAPPER-DIV").remove();
        });
        $(document).on('keypress', '#inlineClose', function(event) {
          if (event.which === 13 || event.keyCode === 13) {
            $("#ATTACHMENT-WRAPPER-DIV").remove();
          }
        });
      }

      function createContentDiv(targetDiv, style) {
        var contentDivId = "ATTACHMENT-PREVIEW-CONTENT" + currentPreviewID;
        targetDiv.innerHTML = targetDiv.innerHTML + '<div id="' + contentDivId + '" class="' + style +
          '"></div>';
        return document.getElementById('ATTACHMENT-PREVIEW-CONTENT' + currentPreviewID);
      }

      function renderMediaAttachment(url, fileType) {
        url = url + "&viewInline=true";
        if (isImageAttachment(fileType)) {
          var imageTag = document.createElement('img');
          imageTag.setAttribute('class',
                                'attachment-inline-preview-content-img attachment-inline-preview-content-img' +
                                currentPreviewID);
          imageTag.setAttribute('style', 'display:none;');
          imageTag.onerror = function() {
            handleBrokenMediaLink("image");
          }
          if (maintainAspectRatio !== "false") {
            imageTag.onload = function() {
              checkAndCorrectMediaDimension("image");
            };
          } else {
            stopPreviewLoadingThrobber();
            imageTag.setAttribute('style', 'display:block;');
            imageTag.setAttribute('width', configuredWidth);
            imageTag.setAttribute('height', configuredHeight);
          }
          imageTag.src = downloadUrl + "&viewInline=true";
          if (isMobileBrowser()) {
            $(document).on('click', '.attachment-inline-preview-content-img' + currentPreviewID,
                           function() {
              $('.attachment-inline-preview-content-img' + currentPreviewID).toggleClass(
                'zoom-in-inline-img');
            });
          }
          return imageTag;
        }
        if (isVideoAttachment(fileType)) {
          var videoTag = document.createElement('video');
          var extension = attachmentMetadataObj.fileType;
          if (extension === "ogv") extension = "ogg";
          if (extension === "m4v") extension = "mp4";
          if (displayType !== 'embed') {
            videoTag.setAttribute("autoplay", "");
          }
          videoTag.setAttribute("controls", "");
          videoTag.preload = "auto";
          videoTag.setAttribute('class',
                                'attachment-inline-preview-content-video attachment-inline-preview-content-video' +
                                currentPreviewID);
          if (isMobileBrowser()) {
            stopPreviewLoadingThrobber();
          } else {
            videoTag.setAttribute('style', 'display:none;');
          }
          if (maintainAspectRatio !== "false") {
            videoTag.onloadeddata = function() {
              checkAndCorrectMediaDimension("video");
            };
          } else {
            stopPreviewLoadingThrobber();
            videoTag.setAttribute('style', 'display:block;width:' + configuredWidth + 'px;height:' +
                                  configuredHeight + 'px;');
          }
          videoTag.onerror = function() {
            handleBrokenMediaLink("video");
          }
          var srcTag = document.createElement('source');
          srcTag.type = "video/" + extension;
          srcTag.onerror = function() {
            handleBrokenMediaLink("video");
          }
          srcTag.src = url;
          videoTag.appendChild(srcTag);
          return videoTag;
        }
      }

      function renderPDFAttachment(url, fileName, mediaWrapper) {
        if (useExternalViewer === "true") {
          url = pega.c.EVAUtil.modifyURLForExternalViewer(evDetails, attachmentMetadataObj, url);
        } else {
          url = url + "&viewInline=true";
        }
        var pdfTag = document.createElement('iframe');
        var browser = window.navigator.userAgent;
        if (!(browser.indexOf("Trident/") > 0 || browser.indexOf("Edge/") > 0)) {
          pdfTag.style.position = "absolute";
          pdfTag.style.left = "-9999px";
          pdfTag.onload = function() {
            pdfLoader(pdfTag, true);
          }
        } else {
          pdfLoader(pdfTag, false, mediaWrapper);
        }
        if (useExternalViewer === "false") {
          if (url !== undefined && url !== null && url !== "") {
            if (browser.indexOf("Trident/") > 0) {
              pdfTag.src = url + "&viewPDFInline=true";
            } else {
              var urlStr = url + "&viewPDFInline=true&fileName=" + fileName;
              var tempSafeURL = SafeURL_createFromURL(urlStr);
              pdfTag.src = tempSafeURL.toURL();
            }
          } else {
            pdfTag.src = "";
          }
        } else {
          pdfTag.src = url;
        }
        return pdfTag;
      }

      function pdfLoader(pdfTag, isNonIE, mediaWrapper) {
        var dimension = getContentPreviewDimension("pdf");
        var contentHeightLimit = dimension[0];
        var contentWidthLimit = dimension[1];
        stopPreviewLoadingThrobber();
        if (isNonIE) {
          pdfTag.height = contentHeightLimit;
          pdfTag.width = contentWidthLimit;
        } else {
          mediaWrapper.style.height = contentHeightLimit + "px";
          mediaWrapper.style.width = contentWidthLimit + "px";
          pdfTag.style.height = "100%";
          pdfTag.style.width = "100%";
        }
        setContentPreviewDimension(contentHeightLimit, contentWidthLimit);
        if (isNonIE) {
          pdfTag.style.position = "inherit";
          pdfTag.style.left = "0";
        }
        setPostPreviewActionFocus();
      }

      function checkAndCorrectMediaDimension(mediaType) {
        var mediaClass = (mediaType === "image") ? "attachment-inline-preview-content-img" +
            currentPreviewID : "attachment-inline-preview-content-video" + currentPreviewID;
        var mediaObj = document.getElementsByClassName(mediaClass)[0];
        if (isMobileBrowser() && mediaType !== "image") {
          mediaObj.style.display = "none";
        }
        var dimension = getContentPreviewDimension(mediaType);
        var contentHeightLimit = dimension[0];
        var contentWidthLimit = dimension[1];
        stopPreviewLoadingThrobber();
        var currentMediaHeight = 0;
        var currentMediaWidth = 0;
        if (mediaType === "image") {
          currentMediaHeight = mediaObj.naturalHeight;
          currentMediaWidth = mediaObj.naturalWidth;
        } else {
          currentMediaHeight = mediaObj.videoHeight;
          currentMediaWidth = mediaObj.videoWidth;
        }
        if (parseInt(contentWidthLimit) === 0) {
          mediaObj.setAttribute('style', 'display:block;width: 100%; height: 100%');
          setPostPreviewActionFocus();
          return;
        }
        if (parseInt(contentHeightLimit) === 0) {
          contentHeightLimit = Math.round((currentMediaHeight / currentMediaWidth) * contentWidthLimit);
        }
        while (currentMediaHeight > contentHeightLimit || currentMediaWidth > contentWidthLimit) {
          if (currentMediaHeight > contentHeightLimit) {
            setContentPreviewDimension(contentHeightLimit, ((contentHeightLimit / currentMediaHeight) *
                                                            currentMediaWidth));
          } else if (currentMediaWidth > contentWidthLimit) {
            setContentPreviewDimension(((contentWidthLimit / currentMediaWidth) * currentMediaHeight),
                                       contentWidthLimit);
          }
          currentMediaHeight = Math.round($("#ATTACHMENT-PREVIEW-CONTENT" + currentPreviewID +
                                            " > span").height());
          currentMediaWidth = Math.round($("#ATTACHMENT-PREVIEW-CONTENT" + currentPreviewID +
                                           " > span").width());
        }
        mediaObj.height = currentMediaHeight;
        mediaObj.width = currentMediaWidth;
        mediaObj.setAttribute('style', 'display:block;');
        setPostPreviewActionFocus();
      }

      function getContentPreviewDimension(attachType) {
        var contentHeightLimit = 0;
        var contentWidthLimit = 0;
        if (displayType !== 'embed') {
          contentHeightLimit = Math.round($("#ATTACHMENT-WRAPPER-DIV").height() - $(
            "#ATTACHMENT-PREVIEW-HEADER").height() - 35);
          contentWidthLimit = Math.round($("#ATTACHMENT-WRAPPER-DIV").width() - 28);
          if (isMobileBrowser()) {
            contentWidthLimit = contentWidthLimit + 28;
          }
        } else {
          contentHeightLimit = parseInt(configuredHeight);
          contentWidthLimit = parseInt(configuredWidth);
          if (contentWidthLimit === 0) {
            contentWidthLimit = Math.round(document.getElementById(previewWrapperDiv).offsetWidth);
          }
          if (contentHeightLimit === 0 && attachType === "pdf") {
            contentHeightLimit = Math.round(contentWidthLimit * (842 / 595));
          }
        }
        var dimension = [contentHeightLimit, contentWidthLimit];
        return dimension;
      }

      function setContentPreviewDimension(contentHeightLimit, contentWidthLimit) {
        $("#ATTACHMENT-PREVIEW-CONTENT" + currentPreviewID + " > span").width(contentWidthLimit);
        $("#ATTACHMENT-PREVIEW-CONTENT" + currentPreviewID + " > span").height(contentHeightLimit);
      }

      function setPostPreviewActionFocus() {
        if (displayType !== 'embed') {
          if (isDownloadRequired !== "false") {
            $("#inlineDownload").focus();
          } else {
            $("#inlineClose").focus();
          }
        }
      }

      function handleBrokenMediaLink(type) {
        stopPreviewLoadingThrobber();
        var errMsgWithStyle = "";
        /*var errMsg = (type === "video" ? pega.u.d.fieldValuesList.get("pzVideoLoadFail") : pega.u.d.fieldValuesList.get("pzImageLoadFail"));*/
        if (displayType !== 'embed') {
          var errMsg = pega.u.d.fieldValuesList.get("pzAttachmentNotFound");
          var errMsgStyle = 'color:#fff';
          errMsgWithStyle = "<b style='" + errMsgStyle + "'>" + errMsg + "</b>";
        } else {
          errMsgWithStyle = "<img src = '" + fallbackThumbnail + "' width='44' height='44'>"
        }
        document.getElementById("INLINE-PREVIEW-MEDIA-WRAPPER" + currentPreviewID).innerHTML =
          errMsgWithStyle;
      }

      function stopPreviewLoadingThrobber() {
        if (document.getElementById("IMG_SHOW_THROBBER_BEFORE_LOAD" + currentPreviewID)) {
          document.getElementById("IMG_SHOW_THROBBER_BEFORE_LOAD" + currentPreviewID).remove();
        }
      }

      function downloadAttachmentIniFrame(url, useInlineView) {
        if (attachmentMetadataObj != null && useExternalViewer === "false") {
          var isPreviewCandidate = isInlineViewCandiadate(attachmentMetadataObj.fileType);
          if (!isPreviewCandidate) {
            useInlineView = false;
          }
        }
        if (useInlineView && attachmentMetadataObj != null) {
          processInlinePreview(url);
        } else {
          downloadAttachmentUsingURL(url);
        }
      }

      function processInlinePreview(url) {
        var wrapperDiv = previewWrapperDiv;
        if (wrapperDiv === undefined || wrapperDiv === null || wrapperDiv === "") {
          wrapperDiv = createWrapperDiv('attachment-inline-preview-wrapper');
        } else {
          wrapperDiv = document.getElementById(wrapperDiv);
        }
        if (displayType !== 'embed') {
          createHeader(wrapperDiv, 'attachment-inline-preview-header');
        }
        var contentDiv = createContentDiv(wrapperDiv, 'attachment-inline-preview-content');
        if (displayType === 'embed') {
          contentDiv.classList.add('attachment-inline-preview-content-embed');
        }
        var mediaWrapper = document.createElement('span');
        var imageTag = document.createElement('img');
        imageTag.src = "webwb/pzLoadingBarAnimation.gif";
        imageTag.id = "IMG_SHOW_THROBBER_BEFORE_LOAD" + currentPreviewID;
        contentDiv.appendChild(imageTag);
        if (useExternalViewer !== "true" || isVideoAttachment(attachmentMetadataObj.fileType)) {
          mediaWrapper.id = "INLINE-PREVIEW-MEDIA-WRAPPER" + currentPreviewID;
          if (isMediaAttachment(attachmentMetadataObj.fileType)) {
            mediaWrapper.appendChild(renderMediaAttachment(url, attachmentMetadataObj.fileType));
            contentDiv.appendChild(mediaWrapper);
          } else if (attachmentMetadataObj.fileType.toLowerCase() === "pdf") {
            mediaWrapper.appendChild(renderPDFAttachment(url, attachmentMetadataObj.fileName,
                                                         mediaWrapper));
            contentDiv.appendChild(mediaWrapper);
          } else {
            downloadAttachmentUsingURL(url);
          }
        } else {
          mediaWrapper.appendChild(renderPDFAttachment(url, attachmentMetadataObj.fileName,
                                                       mediaWrapper));
          contentDiv.appendChild(mediaWrapper);
        }
      }

      function downloadAttachmentUsingURL(url) {
        var elem = getTopWindow().document.getElementById(elemId);
        if (elem === null) {
          elem = document.getElementById(elemId);
        }
        if (elem === null) {
          elem = createTempFrame();
        }
        elem.src = url;
      }
      try {
        if (haveDocumentViewer()) {
          showInDocViewer(downloadUrl, event);
        }
        else if (isPIMC) {
          previewInPIMC(downloadUrl, event);
        }
        else if (isMobileBrowser()) {
          // BUG-307062: Download attachments in the same window in mobile browsers for Android
          // iOS doesn't download in iFrame but creates image tag in iFrame. So download in new window.                    
          if (useInlineView) {
            downloadAttachmentIniFrame(downloadUrl, useInlineView);
          } else {
            if ($('html').hasClass("iOS")) {
              window.openUrlInWindow(downloadUrl, "Attachment", windowParams);
            } else {
              downloadAttachmentIniFrame(downloadUrl);
            }
          }
        } else if (document.addEventListener) // feature detection for IE9+ browsers
        {
          downloadAttachmentIniFrame(downloadUrl, useInlineView);
        } else {
          // Eng-10954/SR-103684/Bug-138864/Bug-140892 : kumad1 04/15/14
          window.open(downloadUrl, "Attachment", windowParams);
        }
      } catch (E) {
        console.error("Error displaying attachment: ", downloadUrl, E);
        var tempFrame = createTempFrame();
        tempFrame.src = downloadUrl;
      }
    };
    var isInlineViewCandiadate = function(attachmentType) {
      if (attachmentType === undefined) {
        return false;
      }
      return (isMediaAttachment(attachmentType)) || (attachmentType.toLowerCase() === "pdf");
    };
    var isMediaAttachment = function(attachmentType) {
      return (isImageAttachment(attachmentType) || isVideoAttachment(attachmentType) || isAudioAttachment(
        attachmentType));
    };
    var isImageAttachment = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      return (attachmentType === "png" || attachmentType === "jpg" || attachmentType === "jpeg" ||
              attachmentType === "bmp" || attachmentType === "gif" || ((attachmentType === "tif" ||
                                                                        attachmentType === "tiff") && isSafariOrEdgeOrIE()));
    };
    var isVideoAttachment = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      if (attachmentType === "mp4" || attachmentType === "m4v") {
        return true;
      } else {
        if (!isSafariOrEdgeOrIE()) {
          return (attachmentType === "webm" || attachmentType === "ogg" || attachmentType === "ogv");
        } else {
          return false;
        }
      }
    };
    var isAudioAttachment = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      return (attachmentType === "mp3" || attachmentType === "wav");
    };
    var isOfficeDocAttachment = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      return (attachmentType === "doc" || attachmentType === "docx");
    };
    var isOfficeExcelAttachment = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      return (attachmentType === "xls" || attachmentType === "xlsx");
    };
    var isOfficePPTAttachment = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      return (attachmentType === "ppt" || attachmentType === "pptx");
    };
    var isOfficeAttachment = function(attachmentType) {
      return (isOfficeDocAttachment(attachmentType) || isOfficeExcelAttachment(attachmentType) ||
              isOfficePPTAttachment(attachmentType));
    };
    var getFileTypeFromExtension = function(attachmentType) {
      attachmentType = attachmentType.toLowerCase();
      if (isImageAttachment(attachmentType) || attachmentType === "tif" || attachmentType === "tiff")
        return pega.u.d.fieldValuesList.get("pzImage");
      if (isVideoAttachment(attachmentType)) return pega.u.d.fieldValuesList.get("pzVideo");
      if (isAudioAttachment(attachmentType)) return pega.u.d.fieldValuesList.get("pzMusic");
      if (isOfficeDocAttachment(attachmentType)) return pega.u.d.fieldValuesList.get("pzOfcDoc");
      if (isOfficeExcelAttachment(attachmentType)) return pega.u.d.fieldValuesList.get("pzOfcExcel");
      if (isOfficePPTAttachment(attachmentType)) return pega.u.d.fieldValuesList.get("pzOfcPPT");
      if (attachmentType === "pdf") return pega.u.d.fieldValuesList.get("pzPDF");
      else {
        return attachmentType;
      }
    };
    var isSafariOrEdgeOrIE = function() {
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      var browser = window.navigator.userAgent;
      if ((!isChrome && browser.indexOf("Firefox/") <= 0) && (browser.indexOf("Safari/") > 0 || browser.indexOf(
        "Trident/") > 0 || browser.indexOf("Edge/") > 0)) {
        return true;
      } else {
        return false;
      }
    };
    var setAttachmentMetadataUniqueID = function(attachmentMetadataObj) {
      if (attachmentMetadataObj !== undefined && attachmentMetadataObj !== null) {
        attachmentMetadataObj.uniqueID = new Date().getTime() + Math.floor(Math.random() * 20);
      }
    };
    var isSignatureAttachment = function(pxLinkedRefTo) {
      var attachments = pega.ui.ClientCache.find("D_pzOfflineAttachmentList");
      var attachmentIterator = (attachments && attachments.get("pxResults")) ? attachments.get("pxResults").iterator() : undefined;
      if (attachmentIterator) {
        while (attachmentIterator.hasNext()) {
          var attachment = attachmentIterator.next();
          if (pxLinkedRefTo === attachment.get("pxLinkedRefTo").getValue()) {
            return attachment.get("pyLabel").getValue() === "Signature-Attach";
          }
        }
      }
      return false;
    };
    var downloadAttachment = function(strInsKey, pxLinkedRefTo, refClass, downloadActivity, docViewerActivity,
                                       event, useInlineView, attachmentMetadataObj) {
      if ((haveDocumentViewer() || isPIMC) && hasValue(pxLinkedRefTo) && hasValue(docViewerActivity)) {
        var docViewerURL = new SafeURL(refClass + "." + docViewerActivity);
        docViewerURL.put("LinkedRefTo", pxLinkedRefTo.trim());
        pega.u.d.convertToRunActivityAction(docViewerURL);
        docViewerURL = docViewerURL.toURL(); // bajaa for TASK-475834
        var isAbsUrl, switchToLocal;
        if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
          if (pxLinkedRefTo.toUpperCase().indexOf("DATA-WORKATTACH-") < 0) {
            if (isPIMC && isSignatureAttachment(pxLinkedRefTo)) {
              pms.plugins.clientstore.getItemUrl('signature', pxLinkedRefTo.trim(), {decodeBase64: true, fileExtension: 'png'})
                .then(function(signatureUrl) {
                  previewInPIMC({ "id": signatureUrl }, event, true, switchToLocal);
                })
                .catch(function(error) {
                  console.error("Can't preview signature attachment " + pxLinkedRefTo + ". Reason: " + error);
                });
              return;
            } else {
              docViewerURL = pxLinkedRefTo.trim();
              isAbsUrl = true;
            }
          } else if(pxLinkedRefTo.toUpperCase().indexOf("TMP-DATA-WORKATTACH-") !== -1){ /*for PIMC offline preview old attachment mode*/
            pega.mobile.sdk.plugins.clientstore.getItem("DATA-WORKATTACH-FILE",pxLinkedRefTo.trim())
              .then(function(item){
              isAbsUrl = true;
              previewInPIMC({"id":item.url}, event, isAbsUrl,switchToLocal); /*BUG-495744*/
            }).catch(function(){
              console.log("error");
            });
            return;
          }else
            if (!pega.offline.NetworkStatus.isDataNetworkAvailable()) {
              setTimeout(function() {
                var CannotPerformWhenOffline = pega.u.d.fieldValuesList.get(
                  "CannotPerformWhenOffline");
                alert(CannotPerformWhenOffline);
                pega && pega.control && pega.control.Actions && pega.control.Actions.prototype
                  .hideSkeleton();
              }, 100);
              return;
            } else {
              pega.u.d.ServerProxy.setDestination(pega.u.d.ServerProxy.DESTINATION.REMOTE);
              switchToLocal = true;
            }
        }
        if(isPIMC){
          previewInPIMC(docViewerURL, event, isAbsUrl,switchToLocal);
        }else{
          showInDocViewer(docViewerURL, event, isAbsUrl, switchToLocal);
        }
      } else {
        var downloadURL = "";
        var downloadURLFromInlinePreview = ""
        var isMedia = false;
        var isPDF = false;
        var storage = "";
        if (useInlineView) {
          if (attachmentMetadataObj != null) {
            try {
              var attachmentType = attachmentMetadataObj.fileType;
              if (attachmentType != null && attachmentType.trim() !== "") {
                isMedia = isMediaAttachment(attachmentType.trim());
                isPDF = (attachmentType.trim().toLowerCase() === "pdf");
                storage = attachmentMetadataObj.storageType;
              }
            } catch (e) {}
          }
          if ((!isMedia && !isPDF) || storage === "External") {
            downloadURL = new SafeURL(refClass + "." + downloadActivity);
            downloadURL.put("linkInsHandle", strInsKey.trim());
          } else {
            downloadURL = new SafeURL(refClass + "." + docViewerActivity);
            downloadURL.put("LinkedRefTo", pxLinkedRefTo.trim());
          }
          downloadURLFromInlinePreview = new SafeURL(refClass + "." + downloadActivity);
          downloadURLFromInlinePreview.put("linkInsHandle", strInsKey.trim());
          pega.u.d.convertToRunActivityAction(downloadURLFromInlinePreview);
          pega.u.d.convertToRunActivityAction(downloadURL);
          downloadURLFromInlinePreview = downloadURLFromInlinePreview.toURL();
        } else {
          //BUG-608518 changes
          if (isMobileBrowser()) {
            if ($('html').hasClass("iOS")) {
              downloadURL = new SafeURL("@baseclass.pzProcessURLInWindow");
              downloadURL.put('pyPreActivity', refClass + "." + downloadActivity);
            }else{
              downloadURL = new SafeURL(refClass + "." + downloadActivity);
              pega.u.d.convertToRunActivityAction(downloadURL);
            }
          }else{
            downloadURL = new SafeURL(refClass + "." + downloadActivity);
            pega.u.d.convertToRunActivityAction(downloadURL);
          }
          downloadURL.put("linkInsHandle", strInsKey.trim());
        }
        displayAttachment(downloadURL.toURL(), downloadURLFromInlinePreview, event, useInlineView,
                          attachmentMetadataObj);
      }
    };
    var openAttachmentInOffline = function(itemType, pxLinkedRefTo) {
      if (itemType === "DATA-WORKATTACH-URL") {
        var CannotOpenUrlOnMobileApp = pega.u.d.fieldValuesList.get("CannotOpenUrlOnMobileApp");
        alert(CannotOpenUrlOnMobileApp);
      } else {
        var launchBox = pega.mobile.hybrid.getLaunchBox();
        launchBox.PRPC.ClientStore.getItem(itemType, pxLinkedRefTo).then(function(item) {
          var documentViewerCallbacks = {
            onSuccess: function() {
              console.debug("Attachment opened successfully");
            },
            onFailure: function(error) {
              console.error("Failed to open attachment: " + error.description);
            }
          };
          launchBox.DocumentViewer.open(item.url, documentViewerCallbacks);
        }, function() {
          console.error("Failed to fetch attachment URL from ClientStore.");
        });
      }
    };
    /* 	For File input element in IE, blur event is fired when the Browse button of the file input element is pressed.
        	This triggers validations even when the user is not done with chosing a file.
        	The validation alert imposes accessibility issue in chosing the file from file browser.
        	Hence delaying the validations till form submission.
        	 */
    /* 	@private
        	replaces the validationType attribute from the file input html element
        	with validationTypeBackup attribute so that the validation handlers are not
        	attached as listeners to the onblur and onchange events.
        	These events are employed to trigger client-side valiations.
        	IE triggers onblur at wrong times for file type input field.
        	 */
    var removeFileValidationTypes = function(ids) {
      var id = ids["thisId"];
      var obj = document.getElementById(id);
      if (obj != null) {
        var valType = obj.getAttribute("validationType");
        if (valType) {
          obj.setAttribute("validationTypeBackup", valType);
          obj.removeAttribute("validationType");
        }
      }
    }
    /*	@private
                restores the validationType attribute from validationTypeBackup attribute for
                the file input html element so that the validation handlers are invoked
                when the form is submitted.
                 */
    var restoreFileValidationTypes = function(ids) {
      var id = ids["thisId"];
      var obj = document.getElementById(id);
      if (obj != null) {
        var valTypeBackup = obj.getAttribute("validationTypeBackup");
        if (valTypeBackup) {
          obj.setAttribute("validationType", valTypeBackup);
          obj.removeAttribute("validationTypeBackup");
        }
      }
    }
    var onLoad = function(cbOnLoad) {
      // BUG-146964:added support for cross browser by using AddEventListener
      if (window.addEventListener) {
        window.addEventListener("load", cbOnLoad, false);
      } else if (window.attachEvent) {
        window.attachEvent("onload", cbOnLoad);
      }
    };
    pega.c.AttachUtil = {
      MULTIPART_FORM_DATA: "multipart/form-data",
      FORM_URL_ENCODED: "application/x-www-form-urlencoded",
      resetEncoding: function(oForm, form_mime_type) {
        if (oForm) {
          oForm.encoding = form_mime_type;
        }
      },
      resetEncodingFileUpload: function(oForm) {
        this.resetEncoding(oForm, this.MULTIPART_FORM_DATA);
      },
      resetEncodingForm: function(oForm) {
        this.resetEncoding(oForm, this.FORM_URL_ENCODED);
      },
      setEncoding: function(oForm, doEncodingNow, form_mime_type) {
        if (oForm) {
          if (doEncodingNow) {
            oForm.encoding = form_mime_type;
          } else {
            var cbSetUploadEncoding = function() {
              oForm.encoding = form_mime_type;
            };
            onLoad(cbSetUploadEncoding);
          }
        }
      },
      setEncodingFileUpload: function(oForm, doEncodingNow) {
        this.setEncoding(oForm, doEncodingNow, this.MULTIPART_FORM_DATA);
      },
      setEncodingForm: function(oForm, doEncodingNow) {
        this.setEncoding(oForm, doEncodingNow, this.FORM_URL_ENCODED);
      },
      isMaxFileSizeExceeded: function(maxSizeBytes, fileInput) {
        if (browserSupportsFileList() && fileInput != null) {
          var files = fileInput.files;
          for (var i = 0, filesCount = files.length; i < filesCount; ++i) {
            if (files[i].size > maxSizeBytes) {
              return true;
            }
          }
        }
        return false;
      },
      showMaxFileSizeViolation: function(event) {
        pega.u.d.reloadSection(null, "pyMaxFileSizeViolation", "", false, false, null, null, event);
      },
      getSelectedFileName: function(fileInput) {
        var selFileName = "",
            fileName;
        if (fileInput != null) {
          if (browserSupportsFileList()) {
            var files = fileInput.files;
            for (var i = 0, filesCount = files.length; files != null && i < filesCount; ++i) {
              fileName = files[i].name;
              if (isBlank(fileName)) {
                fileName = files[i].value;
              }
              if (hasValue(fileName)) {
                selFileName += fileName + ":";
              }
            }
          } else {
            fileName = fileInput.getAttribute("value");
            if (isBlank(fileName)) {
              fileName = fileInput.value;
            }
            if (hasValue(fileName)) {
              selFileName = fileName;
            }
          }
        }
        return selFileName;
      },
      deferValidationUntilSubmit: function(fileInputId) {
        var idObj = {
          thisId: fileInputId
        };
        removeFileValidationTypes(idObj);
        if (!isRegisteredOnBeforeSubmit(restoreFileValidationTypes)) {
          pega.u.d.registerOnBeforeSubmit(restoreFileValidationTypes, idObj);
        }
      },
      // pega.util.event.getEvent() does not recognize the event
      // in the call stack for "runScript" action from menu click events.
      getRunScriptEvent: function() {
        var ev = window.event;
        if (!ev) {
          var cllr = this.getRunScriptEvent.caller;
          while (cllr) {
            for (var ix = 0; ix < cllr.arguments.length; ++ix) {
              ev = cllr.arguments[ix];
              if (ev && (ev.srcElement || ev.target)) {
                return ev;
              }
            }
            cllr = cllr.caller;
          }
        }
        return undefined;
      },
      checkStorageAuthAndExecute: function(event, cbProcess, authorizationSectionName) {
        var cbOAuthFirst = function(authenticated) {
          if (authenticated === "true") {
            /* go straight to the file prompt, and avoid any more auth code */
            cbProcess();
            return;
          }
          // Save reference to original flow action callback, so we can restore when login flow is completed.
          var cbFlowActionOrig = pega.u.d.performFlowACallback;
          var cbAfterLogin = function(oResponse, containerNode, closeReason) {
            var cbOAuthAfterLogin = function(authenticated) {
              // If logged in, go ahead and upload attachment via callback
              if (authenticated === "true") {
                cbProcess();
              }
            };
            // Restore original callback
            pega.u.d.performFlowACallback = cbFlowActionOrig;
            // Call original callback (closes modal)
            cbFlowActionOrig(oResponse, containerNode, closeReason);
            // Check token again to make sure login successful
            checkAppStorageOkToAttach(cbOAuthAfterLogin)
          };
          if (isBlank(authorizationSectionName)) {
            authorizationSectionName = "pzCheckContentStorageTarget";
          }
          /* need to prompt for some authentication details before we can store the file */
          pega.u.d.performFlowACallback = cbAfterLogin;
          var srcElement = getSourceElem(event);
          pega.u.d.processAction(authorizationSectionName, "", "", "", "", "popup", "", "", "",
                                 srcElement);
        };
        /* need to check if storage is okay on-click because App setting or token status could have changed since form loaded*/
        if (pega.u.d.ServerProxy && pega.u.d.ServerProxy.isDestinationLocal()) {
          cbOAuthFirst("true");
        } else checkAppStorageOkToAttach(cbOAuthFirst);
      },
      checkWebStorageTokenAndExecute: function(event, cbProcess, authorizationSectionName) {
        this.checkStorageAuthAndExecute(event, cbProcess, authorizationSectionName);
      },
      checkTokenAndDownloadAttachment: function(event, strInsKey, pxLinkedRefTo, refClass,
                                                 downloadActivity, docViewerActivity, useInlineView, attachmentMetadataObj, pxLinkedClassTo) {
        var isPIMC = navigator.userAgent.indexOf("PegaMobile") > -1;
        if (pxLinkedRefTo === "" && pega.mobile && pega.mobile.isPegaElectronContainer) {
          // the case is for electron.. BUG-329099, needs proper handling BAJAA added new feildvalue for BUG-329679
          var CannotPerformWhenOffline = pega.u.d.fieldValuesList.get(
            "OfflineApplicationGettingSynchronized");
          alert(CannotPerformWhenOffline);
          if (pega && pega.control && pega.control.Actions) {
            pega.control.Actions.prototype.hideSkeleton();
          }
          return;
        }
        var cbProcess = function() {
          setAttachmentMetadataUniqueID(attachmentMetadataObj);
          downloadAttachment(strInsKey, pxLinkedRefTo, refClass, downloadActivity,
                             docViewerActivity, event, useInlineView, attachmentMetadataObj);
        };
        var isNewAttachMode = navigator.userAgent.indexOf("AmpWebControl") > -1 || navigator.userAgent
        .indexOf("PegaElectronContainer") > -1 || isPIMC;
        var that = this;
        var caseClassName = pega.ui.ClientCache.find("pyWorkPage.pxObjClass") != null ? pega.ui.ClientCache.find("pyWorkPage.pxObjClass").getValue() : null;
        if (haveDocumentViewer()) {
          if (caseClassName != null) {
            var pyOfflineAttachmentsEnabled = pega.offline.Utils.getOfflineSettingsForCase(caseClassName, "pyOfflineAttachmentsEnabled");  
            if ((pyOfflineAttachmentsEnabled !== "false") && isNewAttachMode) {
              console.info("Opening attachment in offline.");
              if (!pxLinkedClassTo) {
                pxLinkedClassTo = "DATA-WORKATTACH-FILE";
              }
              openAttachmentInOffline(pxLinkedClassTo.toUpperCase(), pxLinkedRefTo);
            } else {
              that.checkStorageAuthAndExecute(event, cbProcess);
            }


          } else {
            that.checkStorageAuthAndExecute(event, cbProcess);
          }


        } else if (isPIMC) {
          if (!pxLinkedClassTo) {
            pxLinkedClassTo = "DATA-WORKATTACH-FILE";
          }
          if (caseClassName != null) {
            that.previewPIMCAttachmentOffline(event, caseClassName, pxLinkedClassTo, pxLinkedRefTo, isNewAttachMode, cbProcess);
          } else {
            that.previewPIMCAttachmentOnline(event, pxLinkedRefTo, docViewerActivity, refClass, strInsKey, downloadActivity);
          }
        } else {
          that.checkStorageAuthAndExecute(event, cbProcess);
        }
      },
      checkTokenAndDisplayAttachment_pegaSocial_inline: function(event, attachmentMetadataObj, downloadURL,
                                                                  useInlineView, downloadURLFromInlinePreview) {
        if (useInlineView === "false" || useInlineView === false) {
          useInlineView = false;
        } else {
          useInlineView = true;
        }
        var cbProcess = function() {
          setAttachmentMetadataUniqueID(attachmentMetadataObj);
          displayAttachment(downloadURL, downloadURLFromInlinePreview, event, useInlineView,
                            attachmentMetadataObj);
        };
        this.checkStorageAuthAndExecute(event, cbProcess);
      },
      determineTypeOfAttachment: function(attachmentType) {
        if (isImageAttachment(attachmentType)) return "image";
        if (isVideoAttachment(attachmentType)) return "video";
        if (isAudioAttachment(attachmentType)) return "audio";
        if (isOfficeDocAttachment(attachmentType)) return "doc";
        if (isOfficeExcelAttachment(attachmentType)) return "excel";
        if (isOfficePPTAttachment(attachmentType)) return "ppt";
        if (attachmentType === "pdf") return "pdf";
        return "NA";
      },
      displayEmbeddedAttachment: function(attachmentMetadataObj, downloadURL, displayURL) {
        var cbProcess = function() {
          setAttachmentMetadataUniqueID(attachmentMetadataObj);
          displayAttachment(displayURL, downloadURL, null, true, attachmentMetadataObj);
        };
        var evt = $.Event('onload');
        evt.target = document.getElementById(attachmentMetadataObj.targetDiv);
        this.checkStorageAuthAndExecute(evt, cbProcess);
      },
      downloadEmbeddedAttachment: function(attachmentMetadataObj, downloadURL) {
        var cbProcess = function() {
          setAttachmentMetadataUniqueID(attachmentMetadataObj);
          displayAttachment(downloadURL, downloadURL, null, false, attachmentMetadataObj);
        };
        var evt = $.Event('onload');
        evt.target = document.getElementById(attachmentMetadataObj.targetDiv);
        this.checkStorageAuthAndExecute(evt, cbProcess);
      },

      previewPIMCAttachmentOnline: function(event, pxLinkedRefTo, docViewerActivity,refClass,strInsKey,downloadActivity) {
          if(pxLinkedRefTo.startsWith("DATA-WORKATTACH-URL")){
             var strUrlSF = SafeURL_createFromURL(pega.u.d.url);
             strUrlSF.put("pyActivity", "pzFetchURLDetails");
             strUrlSF.put("linkkey", pxLinkedRefTo); 
             var callBack = {
                success: function(response) {
                var link = response.responseText;
                link = (link.indexOf('://') === -1) ? 'http://' + link : link;
                pega.mobile.sdk.application.openUrl(link).then(function() {
					       	console.debug("Successfully opened the url");
					       	}).catch(function() {
					        console.error("Unable to open the url");
					        });
               }
            };
            pega.u.d.asyncRequest('GET', strUrlSF, callBack, null, null);
        } 
        else {
        var docViewerURL = new SafeURL(refClass + "." + downloadActivity);
				docViewerURL.put("linkInsHandle", strInsKey.trim());
        pega.u.d.convertToRunActivityAction(docViewerURL);
				docViewerURL = docViewerURL.toURL();
				var absoluteUrl = window.location.protocol + "//" + window.location.host + docViewerURL;
				var busyInd = new pega.ui.busyIndicator("", true, null);
				var srcElem = getSourceElem(event);
				if (srcElem) {
					busyInd.setTargetElement(srcElem);
				}
				busyInd.show();
        	pega.mobile.sdk.plugins.documents.preview(absoluteUrl).then(function() {
					console.debug("Attachment downloaded and previewed with success");
					busyInd.hide();
				}).catch(function() {
					console.error("Downloading and previewing attachment failed");
					busyInd.hide();
				});
        }
			
      },

      previewPIMCAttachmentOffline: function(event, caseClassName, pxLinkedClassTo, pxLinkedRefTo, isNewAttachMode, cbProcess) {
        var self = this;
        var pyOfflineAttachmentsEnabled = pega.offline.Utils.getOfflineSettingsForCase(caseClassName, "pyOfflineAttachmentsEnabled");
        
        //BUG-568002 : error message for URL attachment in offline.
        var linkedClassTo = pxLinkedClassTo ? pxLinkedClassTo.toUpperCase() : pxLinkedClassTo;
        if (linkedClassTo === "DATA-WORKATTACH-URL") {
          var CannotOpenUrlOnMobileApp = pega.u.d.fieldValuesList.get("CannotOpenUrlOnMobileApp");
          alert(CannotOpenUrlOnMobileApp);
        }
        if ((pyOfflineAttachmentsEnabled !== "false") && isNewAttachMode) {
          pms.plugins.clientstore.getItems([{type: pxLinkedClassTo.toUpperCase(), handle: pxLinkedRefTo}])
            .then(function(items) {
            if (items.length > 0 && items[0].url) {
              return items[0].url;
            } else {
              return pms.plugins.clientstore.getItemUrl("signature", pxLinkedRefTo, { decodeBase64: true, fileExtension: "jpg" });
            }
          })
            .then(function(documentId) {
            return pms.plugins.documents.preview({id: documentId})
          })
            .catch(function(error) {
            console.error("Cannot preview attachment (type='" + pxLinkedClassTo.toUpperCase() + "', handle='" + pxLinkedRefTo + "'). " + error);
          });
        } else {
          self.checkStorageAuthAndExecute(event, cbProcess);
        }
      },
      shareAttachment: function(event, strInsName, strInsKey, pxLinkedRefTo, strClass, docViewerActivity) {
        var docViewerURL = new SafeURL("Work-." + docViewerActivity);
        docViewerURL.put("LinkedRefTo", pxLinkedRefTo.trim());
        pega.u.d.convertToRunActivityAction(docViewerURL);
        docViewerURL = docViewerURL.toURL();
        var absoluteUrl = window.location.protocol + "//" + window.location.host + docViewerURL;
        var busyInd = new pega.ui.busyIndicator("", true, null);
        var srcElem = getSourceElem(event);
        if (srcElem) {
          busyInd.setTargetElement(srcElem);
        }
        busyInd.show();
        pega.mobile.sdk.plugins.documents.share(absoluteUrl).then(function() {
          console.debug("File shared with success");
          busyInd.hide();
        }).catch(function(error) {
          console.error("Sharing file failed.", error);
          busyInd.hide();
        });
      }
    }
  }
})(pega);
//static-content-hash-trigger-GCC