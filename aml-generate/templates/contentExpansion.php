
<div class="offer-item" id="<?= $keyPage.'-en-box'.($indexBox >= 10 ? $indexBox : '0'.$indexBox) ?>" data-desktop="<?= $keyPage.'-d-box-'.($indexSection+1).'-'.$positionItem ?>" data-mobile="<?= $keyPage.'-m-box-'.($indexSection+1).'-'.$positionItem ?>" data-content="<?= $keyPage.'-content-'.($indexSection+1).'-'.$positionItem ?>">
    <div class="offer-item-image" title="<?= strip_tags($item->headline) ?>">
        <?php if($item->imageMobile) { ?>
        <figure class="hidden-xs hidden-sm"><img data-src="<?= process_image($item->imageDesktop) ?>" src="<?= process_image($siteData->logo) ?>" alt="<?= strip_tags($item->headline) ?>" class="img-responsive"></figure>
        <figure class="visible-xs visible-sm"><img data-src="<?= process_image($item->imageMobile) ?>" src="<?= process_image($siteData->logo) ?>" alt="<?= strip_tags($item->headline) ?>" class="img-responsive"></figure>
        <?php } else { ?>
        <figure><img data-src="<?= process_image($item->imageDesktop) ?>" src="<?= process_image($siteData->logo) ?>" alt="<?= strip_tags($item->headline) ?>" class="img-responsive"></figure>
        <?php } ?>
    </div>
    <?php if($item->brandName) { ?>
    <p><?= $item->brandName ?></p>
    <?php } ?>
    <h4><?= $item->headline ?></h4>
    <p><?= $item->leadIn ?> <?= MORE ?></p>
    <?php if($item->tip) { ?>
    <h6><span><?= $item->tip ?></span></h6>
    <?php } ?>
</div>