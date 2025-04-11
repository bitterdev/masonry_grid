<?php

namespace Bitter\MasonryGrid\Provider;

use Concrete\Core\Application\Application;
use Concrete\Core\Asset\AssetList;
use Concrete\Core\Foundation\Service\Provider;
use Concrete\Core\Routing\RouterInterface;
use Bitter\MasonryGrid\Routing\RouteList;

class ServiceProvider extends Provider
{
    protected RouterInterface $router;

    public function __construct(
        Application     $app,
        RouterInterface $router
    )
    {
        parent::__construct($app);

        $this->router = $router;
    }

    public function register()
    {
        $this->registerRoutes();
        $this->registerAssets();
    }

    private function registerAssets()
    {
        $al = AssetList::getInstance();

        $al->register("javascript", "macy", "js/macy.js", [], "masonry_grid");
        $al->register("javascript", "photoswipe", "js/photoswipe.min.js", [], "masonry_grid");
        $al->register("javascript", "photoswipe/ui", "js/photoswipe-ui-default.min.js", [], "masonry_grid");
        $al->register("css", "photoswipe", "css/photoswipe.css", [], "masonry_grid");
        $al->register("css", "photoswipe/skin", "css/photoswipe-default-skin/default-skin.css", [], "masonry_grid");

        $al->registerGroup("masonry-grid", [
            ["javascript", "macy"],
            ["javascript", "photoswipe"],
            ["javascript", "photoswipe/ui"],
            ["css", "photoswipe"],
            ["css", "photoswipe/skin"]
        ]);
    }

    private function registerRoutes()
    {
        $this->router->loadRouteList(new RouteList());
    }
}