(() => {
  // ---- Constants ----

  var MAX_SCROLLBAR_WIDTH = "20";
  var DESKTOP_FONT_SIZE_VMIN = "2.4vmin";
  var MOBILE_FONT_SIZE_VMIN = "4.0vmin";
  var DESKTOP_CONTENT_PADDING_HORIZONTAL = "6vw";
  var IMAGE_PRESENTER_ANIMATION_DURATION_MS = 100;
  var NAV_ANIMATION_DURATION_MS = 240;
  var VIMEO_EMBED_PREFIX = "<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://player.vimeo.com/video/"
  var VIMEO_EMBED_SUFFIX = "?playsinline=0' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>"
  var ANIMATION_VIMEO_VIDEO_IDS = ["273060713", "283148908", "227518868", "217353881"];

  // ---- Functions ----

  function isMobile() {
    return $(window).width() < $(window).height();
  }

  function showNavMenu() {
    $(".nav").show(NAV_ANIMATION_DURATION_MS);
    $(".content-overlay").fadeIn(NAV_ANIMATION_DURATION_MS);
  }

  function hideNavMenu() {
    $(".content-overlay").fadeOut(NAV_ANIMATION_DURATION_MS);
    $(".nav").hide(NAV_ANIMATION_DURATION_MS);
  }

  function toggleNavMenu() {
    if ($(".nav").is(":hidden")) {
      showNavMenu();
    } else {
      hideNavMenu();
    }
  }

  function updateNavigationMode() {
    $(".content-overlay").hide();
    $(".nav").outerHeight("100%");

    if (isMobile()) {
      var mobileHeaderPadding = $(".nav-mobile-header").outerHeight();

      $("html").css("font-size", MOBILE_FONT_SIZE_VMIN);
      $(".content").css("padding-right", "");
      $(".content-nav-mobile-header-padder").height(mobileHeaderPadding);
      $(".content-nav-padder").width(0);
      $(".nav").hide();
      $(".nav-desktop-optionals").hide();
      $(".nav-mobile-header-padder").height(mobileHeaderPadding);
      $(".nav-mobile-header").show();
    } else {
      $("html").css("font-size", DESKTOP_FONT_SIZE_VMIN);
      $(".content").css("padding-left", DESKTOP_CONTENT_PADDING_HORIZONTAL);
      $(".content").css("padding-right", DESKTOP_CONTENT_PADDING_HORIZONTAL);
      $(".content-nav-mobile-header-padder").height(0);
      $(".content-nav-padder").width($(".nav").outerWidth());
      $(".nav").show();
      $(".nav").outerHeight("100%");
      $(".nav-desktop-optionals").show();
      $(".nav-mobile-header-padder").height(0);
      $(".nav-mobile-header").hide();
    }
  }

  function refreshContent() {
    if (isMobile()) {
      hideNavMenu();
    }

    // Stop loading any pending images.
    $("#content").find("img").attr("src", "");

    // Clear the content div.
    $("#content").empty();

    // Determine what to put inside the div.
    switch (window.location.hash) {
      case "#graphic-design":
        openGraphicDesignPage();
        break;
      case "#animation":
        openAnimationPage();
        break;
      case "#illustration":
        openIllustrationPage();
        break;
      case "#about":
        openAboutPage();
        break;
      case "#zeehaus":
        openZeehausPage();
        break;
      case "#nor-gal":
        openNorGalPage();
        break;
      case "#seams-when-pigs-fly":
        openSeamsWhenPigsFlyPage();
        break;
      case "#yoon-vintage":
        openYoonVintagePage();
        break;
      default:
        // If the hash is empty or unrecognized, go ahead and open the Graphic Design page.
        window.location.hash = "#graphic-design";
        openGraphicDesignPage();
    }
  }

  function presentImage(path) {
    $(".image-presenter-subject").attr("src", path);
    $(".image-presenter").show(IMAGE_PRESENTER_ANIMATION_DURATION_MS);
  }

  function unpresentImage() {
    $(".image-presenter").hide(IMAGE_PRESENTER_ANIMATION_DURATION_MS);
    $(".image-presenter-subject").removeAttr("src");
  }

  function resizeExhibitItems(containerId, itemClass, itemsPerRow) {
    $("." + itemClass).outerWidth(($("#" + containerId).width() - MAX_SCROLLBAR_WIDTH) / itemsPerRow);
  }

  function loadExhibit(name, containingElement, folder, size, itemsPerRow = 3) {
    // Add the exhibit.
    var exhibitId = "exhibit-" + name;
    var exhibitItemClass = "exhibit-item-" + name;
    containingElement.html("<div class='exhibit' id='" + exhibitId + "'></div>");

    // Add all the exhibit items.
    for (var i = 0; i < size; i++) {
      (i => {
        var imageId = "exhibit-item-" + name + "-" + i;
        var imagePath = folder + "/" + i + ".png";
        var thumbnailImagePath = folder + "/thumbnails/" + i + ".png";

        // Add the image.
        $("#" + exhibitId).append(
          "<img class='exhibit-item " + exhibitItemClass + " exhibit-image' " + 
          "id='" + imageId + "' " + 
          "src='" + thumbnailImagePath + "' />");

        // Allow the image to be opened up in a new tab after clicking it.
        $("#" + imageId).click(() => {
          presentImage(imagePath);
        });
      })(i);
    }

    // Adjust the width of each item.
    resizeExhibitItems(exhibitId, exhibitItemClass, itemsPerRow);
    $(window).resize(() => {
      resizeExhibitItems(exhibitId, exhibitItemClass, itemsPerRow);
    });
  }

  function loadVimeoExhibit(exhibitName, containingElement, videoIds, itemsPerRow = 3) {
    // Add the exhibit.
    var exhibitId = "exhibit-" + exhibitName;
    var exhibitItemClass = "exhibit-item-" + exhibitName;
    containingElement.html("<div class='exhibit' id='" + exhibitId + "'></div>");

    // Add all the embedded videos.
    $.each(videoIds, (i, videoId) => {
      $("#" + exhibitId).append(
        "<div class='exhibit-item vimeo " + exhibitItemClass + "'>" +
          VIMEO_EMBED_PREFIX + videoId + VIMEO_EMBED_SUFFIX +
        "</div>");
    });

    // Adjust the width of each item.
    resizeExhibitItems(exhibitId, exhibitItemClass, itemsPerRow);
    $(window).resize(() => {
      resizeExhibitItems(exhibitId, exhibitItemClass, itemsPerRow);
    });
  }

  function openGraphicDesignPage() {
    $("#content").load("graphic-design.html", () => {
      $("#zeehaus").click(() => {
        window.location.hash = "#zeehaus";
        refreshContent();
      });
      $("#nor-gal").click(() => {
        window.location.hash = "#nor-gal";
        refreshContent();
      });
      $("#seams-when-pigs-fly").click(() => {
        window.location.hash = "#seams-when-pigs-fly";
        refreshContent();
      });
      $("#yoon-vintage").click(() => {
        window.location.hash = "#yoon-vintage";
        refreshContent();
      });
    });
  }

  function openAnimationPage() {
    $("#content").load("animation.html", () => {
      loadVimeoExhibit("animation", $("#animation-content"), ANIMATION_VIMEO_VIDEO_IDS, /* itemsPerRow= */ 2);
    });
  }

  function openIllustrationPage() {
    $("#content").load("illustration.html", () => {
      loadExhibit("illustration", $("#illustration-content"), "illustration", /* size= */ 6);
    });
  }

  function openAboutPage() {
    $("#content").load("about.html");
  }

  function openZeehausPage() {
    $("#content").load("zeehaus/index.html", () => {
      loadExhibit("logo", $("#logo"), "zeehaus/artifacts/logo", /* size= */ 1);
      loadExhibit("iconography", $("#iconography"), "zeehaus/artifacts/iconography", /* size= */ 4);
      loadExhibit("website", $("#website"), "zeehaus/artifacts/website", /* size= */ 4);
    });
  }

  function openNorGalPage() {
    $("#content").load("nor-gal/index.html", () => {
      loadExhibit("logo", $("#logo"), "nor-gal/artifacts/logo", /* size= */ 1);
      loadExhibit("visual-identity", $("#visual-identity"), "nor-gal/artifacts/visual-identity", /* size= */ 3);
      loadExhibit("iconography", $("#iconography"), "nor-gal/artifacts/iconography", /* size= */ 1);
      loadExhibit("social-media", $("#social-media"), "nor-gal/artifacts/social-media", /* size= */ 4, /* itemsPerRow= */ 4);
      loadExhibit("flyers", $("#flyers"), "nor-gal/artifacts/flyers", /* size= */ 2);
      loadExhibit("merchandise", $("#merchandise"), "nor-gal/artifacts/merchandise", /* size= */ 3);
    });
  }

  function openSeamsWhenPigsFlyPage() {
    $("#content").load("seams-when-pigs-fly/index.html", () => {
      loadExhibit("seams-when-pigs-fly", $("#artifacts"), "seams-when-pigs-fly/artifacts", /* size= */ 4, /* itemsPerRow= */ 4);
    });
  }

  function openYoonVintagePage() {
    $("#content").load("yoon-vintage/index.html", () => {
      loadExhibit("yoon-vintage", $("#artifacts"), "yoon-vintage/artifacts", /* size= */ 4, /* itemsPerRow= */ 4);
    });
  }

  // ---- Start of script ----

  // Listen for window resizes.
  $(window).resize(() => {
    updateNavigationMode();
  });
  updateNavigationMode();

  // Listen for browser navgation changes.
  window.addEventListener('popstate', event => {
    refreshContent();
  });

  // Route to the correct page, or initialize the default page if nothing was specified.
  refreshContent();

  // Define click handlers.
  $(".image-presenter-background").click(() => {
    unpresentImage();
  });

  $(".nav-mobile-menu-button").click(() => {
    toggleNavMenu();
  });

  $(".content-overlay").click(() => {
    hideNavMenu();
  });

  $("#graphic-design").click(() => {
    window.location.hash = "graphic-design";
    refreshContent();
  });
  $("#animation").click(() => {
    window.location.hash = "animation";
    refreshContent();
  });
  $("#illustration").click(() => {
    window.location.hash = "illustration";
    refreshContent();
  });
  $("#about").click(() => {
    window.location.hash = "about";
    refreshContent();
  });
  $("#resume").click(() => {
    window.open("Angela Alberto - Resume.pdf");
  });

  // Easter egg.
  var quack = new Audio("quack.ogg");
  $("#nav-footer").click(() => {
    quack.play();
  });
})();