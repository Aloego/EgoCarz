// Image Protection Script
// Prevents users from copying, downloading, or right-clicking on images

(function () {
  "use strict";

  // Disable right-click on images - more aggressive
  function disableRightClick(e) {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  // Disable drag on images
  function disableDrag(e) {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  // Disable keyboard shortcuts for saving images
  function disableKeyboardShortcuts(e) {
    // Ctrl+S or Cmd+S (Save)
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      return false;
    }
  }

  // Prevent long press on mobile
  function preventLongPress(e) {
    if (e.target.tagName === "IMG") {
      e.preventDefault();
      return false;
    }
  }

  // Initialize protection when DOM is ready
  function initImageProtection() {
    // Apply to all images
    const images = document.querySelectorAll("img");

    images.forEach(function (img) {
      // Disable context menu - multiple event phases
      img.addEventListener("contextmenu", disableRightClick, true);
      img.addEventListener("contextmenu", disableRightClick, false);

      // Disable drag
      img.addEventListener("dragstart", disableDrag, true);
      img.addEventListener("dragstart", disableDrag, false);

      // Prevent long press (mobile)
      img.addEventListener("touchstart", preventLongPress);
      img.addEventListener("touchend", preventLongPress);
      img.addEventListener("touchmove", preventLongPress);

      // Add attribute to prevent saving
      img.setAttribute("draggable", "false");
      img.setAttribute("oncontextmenu", "return false;");
    });

    // Add event listeners to document - both capture and bubble phases
    document.addEventListener("contextmenu", disableRightClick, true);
    document.addEventListener("contextmenu", disableRightClick, false);
    document.addEventListener("dragstart", disableDrag, true);
    document.addEventListener("dragstart", disableDrag, false);
    document.addEventListener("keydown", disableKeyboardShortcuts);

    // Watch for dynamically added images
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.tagName === "IMG") {
            node.addEventListener("contextmenu", disableRightClick, true);
            node.addEventListener("contextmenu", disableRightClick, false);
            node.addEventListener("dragstart", disableDrag, true);
            node.addEventListener("dragstart", disableDrag, false);
            node.addEventListener("touchstart", preventLongPress);
            node.addEventListener("touchend", preventLongPress);
            node.addEventListener("touchmove", preventLongPress);
            node.setAttribute("draggable", "false");
            node.setAttribute("oncontextmenu", "return false;");
          } else if (node.querySelectorAll) {
            const newImages = node.querySelectorAll("img");
            newImages.forEach(function (img) {
              img.addEventListener("contextmenu", disableRightClick, true);
              img.addEventListener("contextmenu", disableRightClick, false);
              img.addEventListener("dragstart", disableDrag, true);
              img.addEventListener("dragstart", disableDrag, false);
              img.addEventListener("touchstart", preventLongPress);
              img.addEventListener("touchend", preventLongPress);
              img.addEventListener("touchmove", preventLongPress);
              img.setAttribute("draggable", "false");
              img.setAttribute("oncontextmenu", "return false;");
            });
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initImageProtection);
  } else {
    initImageProtection();
  }
})();
