<?php

namespace Bitter\MasonryGrid\Routing;

use Bitter\MasonryGrid\API\V1\Middleware\FractalNegotiatorMiddleware;
use Bitter\MasonryGrid\API\V1\Configurator;
use Concrete\Core\Routing\RouteListInterface;
use Concrete\Core\Routing\Router;

class RouteList implements RouteListInterface
{
    public function loadRoutes(Router $router)
    {
        $router
            ->buildGroup()
            ->setNamespace('Concrete\Package\MasonryGrid\Controller\Dialog\Support')
            ->setPrefix('/ccm/system/dialogs/masonry_grid')
            ->routes('dialogs/support.php', 'masonry_grid');
    }
}