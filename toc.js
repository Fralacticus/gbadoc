// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="intro.html"><strong aria-hidden="true">1.</strong> Intro</a></li><li class="chapter-item expanded "><a href="cpu.html"><strong aria-hidden="true">2.</strong> CPU</a></li><li class="chapter-item expanded "><a href="memory.html"><strong aria-hidden="true">3.</strong> Memory</a></li><li class="chapter-item expanded "><a href="graphics.html"><strong aria-hidden="true">4.</strong> Graphics Hardware Overview</a></li><li class="chapter-item expanded "><a href="backgrounds.html"><strong aria-hidden="true">5.</strong> Backgrounds</a></li><li class="chapter-item expanded "><a href="sprites.html"><strong aria-hidden="true">6.</strong> OAM (Sprites)</a></li><li class="chapter-item expanded "><a href="windowing.html"><strong aria-hidden="true">7.</strong> Windowing</a></li><li class="chapter-item expanded "><a href="interrupts.html"><strong aria-hidden="true">8.</strong> Hardware Interrupts</a></li><li class="chapter-item expanded "><a href="bios.html"><strong aria-hidden="true">9.</strong> BIOS (Software Interrupts)</a></li><li class="chapter-item expanded "><a href="registers.html"><strong aria-hidden="true">10.</strong> Memory-Mapped Hardware Registers</a></li><li class="chapter-item expanded "><a href="audio/introduction.html"><strong aria-hidden="true">11.</strong> Audio</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="audio/directsound.html"><strong aria-hidden="true">11.1.</strong> Direct Sound</a></li><li class="chapter-item expanded "><a href="audio/sound1.html"><strong aria-hidden="true">11.2.</strong> Sound Channel 1</a></li><li class="chapter-item expanded "><a href="audio/sound2.html"><strong aria-hidden="true">11.3.</strong> Sound Channel 2</a></li><li class="chapter-item expanded "><a href="audio/sound3.html"><strong aria-hidden="true">11.4.</strong> Sound Channel 3</a></li><li class="chapter-item expanded "><a href="audio/sound4.html"><strong aria-hidden="true">11.5.</strong> Sound Channel 4</a></li><li class="chapter-item expanded "><a href="audio/registers.html"><strong aria-hidden="true">11.6.</strong> Sound Registers</a></li></ol></li><li class="chapter-item expanded "><a href="fixed-point-math.html"><strong aria-hidden="true">12.</strong> Fixed-Point Math for Newbies</a></li><li class="chapter-item expanded "><a href="bootleg-carts/introduction.html"><strong aria-hidden="true">13.</strong> Bootleg Carts</a></li><li class="chapter-item expanded "><a href="ack.html"><strong aria-hidden="true">14.</strong> Acknowledgements</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);