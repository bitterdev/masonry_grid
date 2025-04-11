// Globale Definition von initPhotoSwipeFromDOM
var initPhotoSwipeFromDOM = function (gallerySelector) {
    // Parse slide data from DOM elements
    var parseThumbnailElements = function (el) {
        let items = [];
        let thumbElements = el.childNodes;

        for (let i = 0; i < thumbElements.length; i++) {
            let figureEl = thumbElements[i];

            // Nur Elementknoten berücksichtigen
            if (figureEl.nodeType !== 1) {
                continue;
            }

            let linkEl = figureEl.children[0]; // <a> Element
            if (!linkEl || !linkEl.dataset.size) {
                continue;
            }

            let size = linkEl.dataset.size.split('x');
            if (size.length !== 2) {
                continue;
            }

            // Slide-Objekt erstellen
            let item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
            };

            if (figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML; // <figcaption> Inhalt
            }

            if (linkEl.children.length > 0) {
                item.msrc = linkEl.children[0].getAttribute('src'); // Thumbnail-URL
            }

            item.el = figureEl; // Element für getThumbBoundsFn speichern
            if ($(figureEl).is(':visible')) {
                items.push(item);
            }
        }

        return items;
    };

    // Nächstes übergeordnetes Element finden
    var closest = function (el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // Klick auf Thumbnail behandeln
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        let eTarget = e.target || e.srcElement;
        let clickedListItem = closest(eTarget, function (el) {
            return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
        });

        if (!clickedListItem) {
            return;
        }

        let clickedGallery = clickedListItem.parentNode;
        let childNodes = clickedGallery.childNodes;
        let nodeIndex = 0;
        let index;

        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }

            if ($(childNodes[i]).is(':visible')) {
                nodeIndex++;
            }
        }

        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // URL-Hash parsen (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        let hash = window.location.hash.substring(1);
        let params = {};

        if (hash.length < 5) {
            return params;
        }

        let vars = hash.split('&');
        for (let i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            let pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    // PhotoSwipe öffnen
    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        let pswpElement = document.querySelectorAll('.pswp')[0];
        if (!pswpElement) {
            console.error('PhotoSwipe-Element (.pswp) nicht gefunden.');
            return;
        }

        let items = parseThumbnailElements(galleryElement);
        let options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function (index) {
                let thumbnail = items[index].el.getElementsByTagName('img')[0];
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                let rect = thumbnail.getBoundingClientRect();
                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },
        };

        if (fromURL) {
            if (options.galleryPIDs) {
                for (let j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        try {
            let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        } catch (e) {
            console.error('PhotoSwipe konnte nicht initialisiert werden:', e);
        }
    };

    // Alle Galerie-Elemente durchlaufen und Events binden
    let galleryElements = document.querySelectorAll(gallerySelector);
    for (let i = 0; i < galleryElements.length; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // URL-Hash parsen und Galerie öffnen
    let hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid && galleryElements[hashData.gid - 1]) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};

// Globale Definition von masonryGrid
window.masonryGrid = function (settings) {
    // PhotoSwipe-Markup hinzufügen, falls nicht vorhanden
    if ($('.pswp').length === 0) {
        $('body').append(
            '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">' +
            '<div class="pswp__bg"></div>' +
            '<div class="pswp__scroll-wrap">' +
            '<div class="pswp__container">' +
            '<div class="pswp__item"></div>' +
            '<div class="pswp__item"></div>' +
            '<div class="pswp__item"></div>' +
            '</div>' +
            '<div class="pswp__ui pswp__ui--hidden">' +
            '<div class="pswp__top-bar">' +
            '<div class="pswp__counter"></div>' +
            '<button class="pswp__button pswp__button--close" title="' +
            settings.i18n.close +
            '"></button>' +
            '<button class="pswp__button pswp__button--share" title="' +
            settings.i18n.share +
            '"></button>' +
            '<button class="pswp__button pswp__button--fs" title="' +
            settings.i18n.fullscreen +
            '"></button>' +
            '<button class="pswp__button pswp__button--zoom" title="' +
            settings.i18n.zoom +
            '"></button>' +
            '<div class="pswp__preloader">' +
            '<div class="pswp__preloader__icn">' +
            '<div class="pswp__preloader__cut">' +
            '<div class="pswp__preloader__donut"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">' +
            '<div class="pswp__share-tooltip"></div>' +
            '</div>' +
            '<button class="pswp__button pswp__button--arrow--left" title="' +
            settings.i18n.prev +
            '"></button>' +
            '<button class="pswp__button pswp__button--arrow--right" title="' +
            settings.i18n.next +
            '"></button>' +
            '<div class="pswp__caption">' +
            '<div class="pswp__caption__center"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    }

    let $el = $(settings.bID);
    if ($el.length === 0) {
        console.error('Masonry-Container nicht gefunden:', settings.bID);
        return;
    }

    // Macy initialisieren
    try {
        $el.data(
            'masonry',
            new Macy({
                container: settings.bID + ' .images',
                trueOrder: true,
                waitForImages: true,
                margin: {
                    x: 0,
                    y: 0,
                },
                columns: 6,
                breakAt: {
                    1200: { columns: 5 },
                    940: { columns: 5 },
                    520: { columns: 3 },
                    400: { columns: 1 },
                },
            })
        );
    } catch (e) {
        console.error('Macy konnte nicht initialisiert werden:', e);
        return;
    }

    // Filter-Logik
    $el.find('.filter li').off('click').on('click', function () {
        let fileSetId = $(this).data('fileSetId') || '';

        if (fileSetId === '') {
            $el.find('.image').removeClass('d-none');
        } else {
            $el.find('.image').each(function () {
                let $image = $(this);
                let fileSetIds = $image.data('fileSetIds');
                let isVisible = false;

                if (typeof fileSetIds === 'number') {
                    isVisible = parseInt(fileSetIds) === parseInt(fileSetId);
                } else if (typeof fileSetIds === 'string') {
                    isVisible = fileSetIds.split(',').includes(fileSetId.toString());
                }

                $image.toggleClass('d-none', !isVisible);
            });
        }

        $el.find('.filter li').removeClass('active');
        $(this).addClass('active');

        let masonry = $el.data('masonry');
        if (masonry) {
            masonry.reInit();
        }

        // PhotoSwipe neu initialisieren
        $(settings.bID + ' .images').each(function () {
            $(this).removeAttr('data-pswp-uid').off('click');
        });
        initPhotoSwipeFromDOM(settings.bID + ' .images');
    });

    // Initialen Filter auslösen
    let $activeFilter = $el.find('.filter li.active');
    if ($activeFilter.length) {
        $activeFilter.trigger('click');
    } else {
        console.warn('Kein aktiver Filter gefunden.');
    }
};