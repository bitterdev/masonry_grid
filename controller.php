<?php

namespace Concrete\Package\MasonryGrid;

use Bitter\MasonryGrid\Provider\ServiceProvider;
use Concrete\Core\Entity\Package as PackageEntity;
use Concrete\Core\Package\Package;

class Controller extends Package
{
    protected string $pkgHandle = 'masonry_grid';
    protected string $pkgVersion = '0.0.4';
    protected $appVersionRequired = '9.0.0';
    protected $pkgAutoloaderRegistries = [
        'src/Bitter/MasonryGrid' => 'Bitter\MasonryGrid',
    ];

    public function getPackageDescription(): string
    {
        return t('Display multiple file sets in a stylish, filterable masonry grid.');
    }

    public function getPackageName(): string
    {
        return t('Masonry Grid ');
    }

    public function on_start()
    {
        /** @var ServiceProvider $serviceProvider */
        /** @noinspection PhpUnhandledExceptionInspection */
        $serviceProvider = $this->app->make(ServiceProvider::class);
        $serviceProvider->register();
    }

    public function install(): PackageEntity
    {
        $pkg = parent::install();
        $this->installContentFile("data.xml");
        return $pkg;
    }

    public function upgrade()
    {
        parent::upgrade();
        $this->installContentFile("data.xml");
    }
}