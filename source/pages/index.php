<?php
// load data
$jsonFile = file_get_contents('data/data.min.json');
$jsonData = json_decode($jsonFile);

$requestUrl = strtok($_SERVER['REQUEST_URI'],'?');
$pageTitle = '';
$loadBackground = '';
$topContainer = '';
$bottomContainer = '';
$infoPosition = '';
$imagePosition = '';
$imageSrc = '';
$subNav = [];
$pageTab = [];
$scrollLists = (array) $jsonData->lists;
$tabs = (array) $jsonData->tabs;
$pageBodyClass = '';
$videoBackground = '';
$map = '';

if($requestUrlPage = requestUrlPageData()){
    loadPage($requestUrlPage);
}else{
    // load 404 page
}

function requestUrlPageData(){
    global $jsonData;
    global $requestUrl;
    $pages = $jsonData->pages;
    foreach($pages as $page){
        if($page->url == $requestUrl){
            return $page;
        }
    }
    return false;
}

function loadPage($page){
    global $loadBackgroundLandscape;
    global $loadBackgroundPortrait;
    global $topContainer;
    global $bottomContainer;
    global $infoPosition;
    global $imagePosition;
    global $imageSrc;
    global $pageTitle;
    global $subNav;
    global $pageBodyClass;
    global $requestUrl;
    global $pageTab;
    global $videoBackground;

    if($page->title != ''){
        $pageTitle = ' - '.$page->title;
    }
    $loadBackgroundLandscape = $page->background->landscape;
    $loadBackgroundPortrait = $page->background->portrait;
    $videoBackground = isset($page->video_background) ? $page->video_background : false;
    $topContainer = $page->content->top->html;
    $bottomContainer = $page->content->bottom->html;
    $infoPosition = json_encode($page->content->position);
    $imagePosition = isset($page->image->position) ? json_encode($page->image->position) : null;
    $imageSrc = isset($page->image) ? $page->image->src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    $subNav = isset($page->sub_nav) ? $page->sub_nav : null;
    $pageTab = isset($page->tab) ? $page->tab : null;

    $pageBodyClass = substr(str_replace('/','-',$requestUrl), 1, -1);
    $pageBodyClass = $pageBodyClass == '' ? 'home' : $pageBodyClass;
}

?><!doctype html>
    <head>
        <title>Pinnacle Law<?php echo $pageTitle; ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="description" content="This Is Law Humanized. For more than 12 years, John M. Rhude has been changing the face of Arizona criminal law."/>
        <link rel="canonical" href="http://azpinnaclelaw.com<?= $requestUrl; ?>" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-64306760-1', 'auto');
            ga('send', 'pageview');
        </script>
        <link rel="stylesheet" href="/css/main.min.css" media="screen" type="text/css">
    </head>
    <body data-url="<?php echo $requestUrl; ?>">
        
        <div id="page_wrap">
            <div id="site-message"><p class="message"></p></div>
            
            <div id="mobile-nav">
                <div class="open"></div>
                <div class="close"></div>
            </div>

            <!-- HEADER -->
            <div id="header">
                <div class="content-wrap">
                    
                    <div class="top">
                        <a class="logo app-link" href="/">
                            <img src="/images/header_logo.png" />
                        </a>
                        <div class="nav">
                            <ul class="type_links">
                                <?php foreach($jsonData->header->type_links as $name => $url){ ?>
                                    <li><a href="<?php echo $url; ?>" class="app-link"><?php echo $name; ?></a></li>
                                <?php } ?>
                            </ul>
                            <hr />
                            <ul class="info_links">
                                <?php foreach($jsonData->header->info_links as $name => $url){ ?>
                                    <li><a href="<?php echo $url; ?>" class="app-link"><?php echo $name; ?></a></li>
                                <?php } ?>
                            </ul>
                        </div>
                    </div>
                    <div class="bottom">
                        <img class="bottom_image" src="/images/header_bottom.png" />
                        <ul class="contact_info">
                            <?php foreach($jsonData->header->contact_info as $type => $info){ ?>
                                <?php if($type == 'phone'){ ?>
                                    <li><a href="tel:+1<?php echo preg_replace('/\D/', '', $info); ?>"><img src="/images/icon_phone.png" /> <?php echo $info; ?></a></li>
                                <?php } ?>
                                <?php if($type == 'email'){ ?>
                                    <li><a href="mailto:<?php echo $info; ?>"><img src="/images/icon_email.png" /> <span class="tx_underline">Email Us</span></a></li>
                                <?php } ?>
                            <?php } ?>
                        </ul>
                        <ul class="social_info">
                            <?php foreach($jsonData->header->social_info as $name => $url){ ?>
                                <li><a href="<?php echo $url; ?>" target="_blank"><img src="/images/icon_<?php echo $name; ?>.png" /></a></li>
                            <?php } ?>
                        </ul>
                        <ul class="privacy">
                            <?php foreach($jsonData->header->privacy as $name => $url){ ?>
                                <li><a href="<?php echo $url; ?>" class="app-link"><?php echo $name; ?></a></li>
                            <?php } ?>
                        </ul>
                    </div>
                </div>
            </div>


            <!-- CONTENT -->
            <div id="content">
                <div class="background active" id="background1" style="background-image:url(<?php echo $loadBackgroundLandscape; ?>)" data-background='{"landscape": "<?php echo $loadBackgroundLandscape; ?>"  ,"portrait": "<?php echo $loadBackgroundPortrait; ?>" }'>
                    <?php if($videoBackground){ ?>
                        <video poster="<?php echo $loadBackgroundLandscape; ?>" reload="auto" autoplay loop muted>
                            <source type="video/mp4" src="<?php echo $videoBackground; ?>.mp4">
                            <source type="video/ogg" src="<?php echo $videoBackground; ?>.ogv">
                            <source type="video/webm" src="<?php echo $videoBackground; ?>.webm">
                        </video>
                    <?php } ?>
                </div>
                <div class="background" id="background2"></div>
                <div id="mask"></div>
                <div id="google-map" style="opacity:<?php if ( strpos($requestUrl,'/contact') !== false )  { echo '1'; } else { echo '0';} ?>">
                    <div id="map" class="map<?php if ( strpos($requestUrl,'/contact') !== false )  { echo ' active'; } else { '';} ?>"></div>
                </div>
                

                <img id="page_image" src="<?php echo $imageSrc; ?>"/>
                
                <div id="page_info">
                    <div id="info_wrapper">
                        <div class="top_container"><?php echo $topContainer; ?></div>
                        
                        <?php
                            $tabDisplay = 'none';
                            if(isset($pageTab)){
                                $tabDisplay = 'table';
                                $pageTabs = $tabs[$pageTab->name];
                            }
                        ?>
                        <ul class="tabs" style="display:<?php echo $tabDisplay; ?>">
                            <?php
                                if(isset($pageTabs)){
                                    foreach($pageTabs as $thisTab){
                                        $active = $pageTab->active == $thisTab->tab ? 'active' : '';
                                        ?>
                                            <li href="<?php echo $thisTab->url; ?>" class="app-link" class="<?php echo $active; ?>"><a href="#"><?php echo $thisTab->html; ?></a></li>
                                        <?php
                                    }
                                }
                            ?>
                        </ul>
                        
                        <div class="bottom_container"><?php echo $bottomContainer; ?></div>
                    </div>
                </div>

                <div id="sub_nav">
                    <?php
                        $scrollDisplay = 'none';
                        $scrollHref = isset($subNav->url) ? $subNav->url : '';
                        $listDisplay = 'none';

                        if(isset($subNav->type) && $subNav->type == 'scroll'){
                            $scrollDisplay = 'block';
                        }
                        if(isset($subNav->type) && $subNav->type == 'list'){
                            $listDisplay = 'block';
                            $scrollList = $scrollLists[$subNav->name];
                        }
                    ?>
                    <div class="scroll" style="display:<?php echo $scrollDisplay; ?>">
                        <a href="<?php echo $scrollHref; ?>" class="app-link"><span class="text-scroll">Scroll</span><span class="text-swipe">Swipe</span></a>
                    </div>

                    <ul class="list" style="display:<?php echo $listDisplay; ?>">
                        <?php
                            if($scrollList){
                                foreach($scrollList->links as $name => $url){
                                    $active = $url == $requestUrl ? 'active' : '';
                                    ?>
                                        <li class="<?php echo $active; ?>"><a href="<?php echo $url; ?>" class="app-link"><?php echo $name; ?></a></li>
                                    <?php
                                }
                            }
                        ?>
                    </ul>
                </div>
                
                <div class="cover"></div>
            </div>
        </div>
        
        <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"></script>
        <script>
          WebFont.load({
            google: {
              families: ['Abel']
            }
          });
        </script>
        
        <!-- SCRIPTS -->
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js"></script>
        <script src="/js/main.min.js"></script>
        <script type="text/javascript">
        /* <![CDATA[ */
        var google_conversion_id = 942888148;
        var google_custom_params = window.google_tag_params;
        var google_remarketing_only = true;
        /* ]]> */
        </script>
        <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
        </script>
        <noscript>
        <div style="display:inline;">
        <img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/942888148/?value=0&amp;guid=ON&amp;script=0"/>
        </div>
        </noscript>
    </body>
</html>