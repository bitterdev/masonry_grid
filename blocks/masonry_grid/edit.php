<?php

use Concrete\Core\Support\Facade\Url;
use Concrete\Core\View\View;

defined('C5_EXECUTE') or die('Access denied');

/** @var array $fileSets */
/** @var array $selectedFileSets */

View::element("dashboard/help_blocktypes", [], "masonry_grid");

/** @noinspection PhpUnhandledExceptionInspection */
View::element("dashboard/did_you_know", [], "masonry_grid");
?>

<?php if (count($fileSets) === 0): ?>
    <div class="alert alert-warning">
        <?php echo t("You don't have any file sets. Click %s to create one.", sprintf("<a href=\"%s\">%s</a>", Url::to("/dashboard/files/add_set"), t("here"))); ?>
    </div>
<?php else: ?>
    <?php foreach ($fileSets as $fileSetId => $fileSetName): ?>
        <div class="checkbox">
            <label>
                <input name="fileSets[]" type="checkbox"
                       value="<?php echo h($fileSetId); ?>" <?php echo in_array($fileSetId, $selectedFileSets) ? " checked=\"checked\"" : ""; ?>>

                <?php echo $fileSetName; ?>
            </label>
        </div>
    <?php endforeach; ?>
<?php endif; ?>
