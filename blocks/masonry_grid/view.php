<?php

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Identifier;

/** @var array $images */
/** @var array $fileSets */
/** @var array $selectedFileSets */

$app = Application::getFacadeApplication();
/** @var Identifier $identifier */
$identifier = $app->make(Identifier::class);

$c = Page::getCurrentPage();

$id = "masonry-grid-" . $identifier->getString();
?>

<?php if ($c instanceof Page && $c->isEditMode()) { ?>
    <div class="ccm-edit-mode-disabled-item">
        <?php echo t('Masonry Grid is disabled in edit mode.') ?>
    </div>
<?php } else { ?>
    <div id="<?php echo $id; ?>" class="masonry-grid">
        <?php if (count($fileSets) > 1) { ?>
            <ul class="filter">
                <li class="active" data-file-set-id="">
                    <?php echo t("View All"); ?>
                </li>

                <?php $firstIteration = true; ?>

                <?php foreach ($fileSets as $fileSetId => $fileSetName) { ?>
                    <?php
                    $className = "";

                    if ($firstIteration) {
                        $className = "active";
                        $firstIteration = false;
                    }
                    ?>

                    <li data-file-set-id="<?php echo h($fileSetId); ?>" class="<?php echo h($className); ?>">
                        <?php echo $fileSetName; ?>
                    </li>
                <?php } ?>
            </ul>
        <?php } ?>

        <div class="images" itemscope itemtype="https://schema.org/ImageGallery">
            <?php foreach ($images as $image): ?>
                <figure itemprop="associatedMedia" itemscope itemtype="https://schema.org/ImageObject" class="image"
                        data-file-set-ids="<?php echo h(implode(",", $image["fileSets"])); ?>">
                    <a href="<?php echo h($image["url"]); ?>" itemprop="contentUrl"
                       data-size="<?php echo h(sprintf("%sx%s", $image["width"], $image["height"])); ?>">
                        <img src="<?php echo h($image["thumbnail"]); ?>" itemprop="thumbnail"
                             alt="<?php echo h($image["description"]); ?>"/>
                    </a>

                    <figcaption itemprop="caption description">
                        <strong>
                            <?php echo $image["title"]; ?>
                        </strong>

                        <br>

                        <?php echo $image["description"]; ?>
                    </figcaption>
                </figure>
            <?php endforeach; ?>
        </div>
    </div>

    <script type="text/javascript">
        (function ($) {
            $(document).ready(function () {
                masonryGrid({
                    bID: '#<?php echo $id; ?>',
                    i18n: {
                        close: "<?php echo t("Close (Esc)"); ?>",
                        share: "<?php echo t("Share"); ?>",
                        fullscreen: "<?php echo t("Toggle fullscreen"); ?>",
                        zoom: "<?php echo t("Zoom in/out"); ?>",
                        prev: "<?php echo t("Previous (arrow left)"); ?>",
                        next: "<?php echo t("Next (arrow right)"); ?>"
                    }
                });
            });
        })(jQuery);
    </script>
<?php } ?>