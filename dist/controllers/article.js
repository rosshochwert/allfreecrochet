window.ArticleController = {

  index: function () {

 //  document.addEventListener("deviceready", function(){

    steroids.view.navigationBar.show("Articles");
    google.load("feeds", "1");

       // google.load("feeds", "1");
       // google.setOnLoadCallback(OnLoad);


    document.addEventListener("DOMContentLoaded", function () {
        $("#loading").show();
        $("#error").hide();
        $("#refresh").hide();
        $('#refresh').click(function () {
             location.reload(); 
             });

  //  });


    });


    var append ="";
    var results ="";

    // Our callback function, for when a feed is loaded.
    function feedLoaded(result) {
      if (!result.error) {
         var items = result.xmlDocument.getElementsByTagName('item');

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
            var description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
            var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
            var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;


            if (item.getElementsByTagName('enclosure').item(0)!=null){
                var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
            }
            else{
                var image = "/icons/iTunesArtwork@2x.png";
            }
            append = append + '<li class="opensLayer crop topcoat-list__item" data-location="/views/article/show.html?id=' + i + '&title=' + escape(title) + '&description=' + escape(description) + '&link=' + escape(link) + '&pubDate=' + escape(pubDate) + '&image=' + escape(image) + '"><img src="' + image + '"><h4>' + title + '</h4></li>';
        }
                    
        $("#loading").hide();
        $("#error").hide();
        $(".topcoat-list").append(append);


      }
      else{
        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }

    addLinks();


    }

  function addLinks(){
      $(".opensLayer").hammer().on("tap", function() {
      // Create a new WebView that...
      webView = new steroids.views.WebView({ location: this.getAttribute("data-location") });

      // ...is pushed to the navigation stack, opening on top of the current WebView.
      steroids.layers.push({ view: webView });
    });
    }


    function OnLoad() {
      // Create a feed instance that will grab Digg's feed.
      if (google.feeds!=undefined){
        var feed = new google.feeds.Feed("http://allfreecrochet.com/rss-feed");
        feed.setNumEntries(20);
        feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
        feed.load(feedLoaded);

      }
      else{
        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }
      //var feed = new google.feeds.Feed("http://allfreecrochet.com/rss-feed");
      // Calling load sends the request off.  It requires a callback function.
    }

    
       google.setOnLoadCallback(OnLoad);



  },

  show: function () {

    // Fetch a value from query parameters ?id=x
    var showId = steroids.view.params["id"];
    var title = decodeURIComponent(steroids.view.params["title"]);
    var image = decodeURIComponent(steroids.view.params["image"]);
    var description = decodeURIComponent(steroids.view.params["description"]);
    var pubDate = decodeURIComponent(steroids.view.params["pubDate"]);
    var link = decodeURIComponent(steroids.view.params["link"]);

    var pubDateStrip = pubDate.split(' ');
    pubDateStrip.pop();
    pubDateStrip.pop();
    pubDateStrip.pop();

    pubDateStrip= pubDateStrip.join(' ');

    var imageButton = new steroids.buttons.NavigationBarButton();
    imageButton.onTap = function() {
     window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
    }
    imageButton.imagePath = "/icons/share@2x.png"

    steroids.view.navigationBar.setButtons({
        right: [imageButton]
    });





    // Just to demonstrate the control flow of the application, hook your own code here
    document.addEventListener("DOMContentLoaded", function() {

    // window.plugins.socialsharing.available(function(avail) {
    //   if (avail) {
    //     steroids.view.navigationBar.setButtons({
    //       right: [imageButton]
    //     });
    //   } else {
    //     // Social not supported
    //   }
    // });

      document.getElementById("description").textContent = description;
      document.getElementById("show-id").textContent = title;
      document.getElementById("pubDate").textContent = pubDateStrip;

      document.addEventListener("deviceready", onDeviceReady, false);
      
      $("#image").attr("src", image);
      var viewportWidth = $(window).width()-50;

      $(".read").css("width", viewportWidth);
      $(".read").hammer().on("tap", openLink);
  //    $(".googleplus").hammer().on("tap", googlePlusAuth);

  //    $(".email").hammer().on("tap", email);
  //    $(".googleplus").hammer().on("tap", googlePlusAuth);
  //    $(".share").hammer().on("tap", facebookShare);

    });
    var code = ""

            var googleapi = {
              authorize: function(options) {
                  var deferred = $.Deferred();
                  var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                  client_id: options.client_id,
                  redirect_uri: options.redirect_uri,
                  response_type: 'code',
                  scope: options.scope
                  });

              var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

               $(authWindow).on('loadstart', function(e) {
                      alert("one shot");
                      var url = e.originalEvent.url;
                      var code = /\?code=(.+)$/.exec(url);
                      var error = /\?error=(.+)$/.exec(url);

                      if (code || error) {
                          //Always close the browser when match is found
                          authWindow.close();
                      }

                      if (code) {
                          //Exchange the authorization code for an access token
                          $.post('https://accounts.google.com/o/oauth2/token', {
                              code: code[1],
                              client_id: options.client_id,
                              client_secret: options.client_secret,
                              redirect_uri: options.redirect_uri,
                              grant_type: 'authorization_code'
                          }).done(function(data) {
                              deferred.resolve(data);
                          }).fail(function(response) {

                            //alert(response);
                            //alert(response.responseJSON);
                            deferred.resolve(response);

                            //  deferred.reject(response.responseJSON);
                          });
                      } else if (error) {
                          //The user denied access to the app
                          deferred.reject({
                              error: error[1]
                          });
                      }
                  });

              return deferred.promise();
            }
        };

        function onDeviceReady() {
            try {
                FB.init({
                    appId: "672715112769165",
                    nativeInterface: CDV.FB,
                });
            } catch (e) {
                alert(e);
            }
            

        }

        function nothing(){}

      function googlePlusAuth(){
          googleapi.authorize({
                client_id: '460715297260-1oo3l7dfq6gq54pjr9s603ik875easfn.apps.googleusercontent.com',
                client_secret: 'D78M-bTbyuikbIbbzTBcp2Gl',
                redirect_uri: 'http://localhost/',
                scope: 'https://www.googleapis.com/auth/plus.login'
              }).done(function(data) {
               code = 'Access Token: ' + data.access_token;
               alert(code);
              }).fail(function(data) {
               code = data.error;
                alert(code);
              });
            }

        function facebookShare(){
            FB.ui(
                  {
                    method: 'feed',
                    name: 'Look at this article from AllFreeCrochet!',
                    link: link,
                    picture: image,
                    description: 'I just read an amazing article about ' + title + '!'
                  },
                  function(response) {
                    if (response && response.post_id) {
                      navigator.notification.alert(
                        'The article was shared!',  // message
                        nothing(),         // callback
                        'Posted',            // title
                        'Ok'                  // buttonName
                     );
                    } 
                    else {
                      navigator.notification.alert(
                      'The article was not shared. Please try again.',  // message
                      nothing(),         // callback
                      'Not Posted',            // title
                      'Ok'                  // buttonName
                    );  
                  }
                  }
                );
        }

    function openLink(){
        window.open(link, '_blank', 'location=yes');
    }

    function email() {
          var content = "I wanted to share this amazing crochet article with you. Here's the description of the article:<br>" + description + ". You can read the entire article online here: <a href='" + link + "'>AllFreeCrochet.com</a>." ;
          var ops = {
                  subject: "Look at this AllFreeCrochet article!",
                  body: content,
                  toRecipients: [],
                  ccRecipients: [],
                  bccRecipients: [],
                  isHTML: true,
                  attachments: []
               }

          window.plugins.emailComposer.showEmailComposerWithCallback(nothing, ops.subject, ops.body, ops.toRecipients, ops.ccRecipients, ops.bccRecipients, ops.isHTML, ops.attachments);
        }

  }

};


// Handle tap events on views

document.addEventListener("DOMContentLoaded", function() {

  $(".opensLayer").hammer().on("tap", function() {
    // Create a new WebView that...
    webView = new steroids.views.WebView({ location: this.getAttribute("data-location") });

    // ...is pushed to the navigation stack, opening on top of the current WebView.
    steroids.layers.push({ view: webView });

  });

});