(function($) {
  var items = function() {
    this.list = [];

    return {
      setList: function(list) {
        this.list = list && list.Search || [];
      },
      getList: function() {
        return this.list;
      }
    };
  };

	var variable = {
		domain: "http://www.omdbapi.com/",
    apikey: "aba065d3",
    defaultImageUrl: "http://via.placeholder.com/120x160"
	}

  var debounce = function(func, delay) {
    var timer;

    return function() {
      var cx = this;
      var argus = arguments;

      clearTimeout(timer);

      timer = setTimeout(function() {
        func.apply(cx, argus);
      }, delay)
    }
  };

  var list = new items();

	function getData(query) {
		var url = variable.domain + "?apikey=" + variable.apikey + query;

    return $.ajax({
      url: url,
      method: "GET"
    });
  };

  function addListener() {
    var movieItem = document.getElementsByClassName("movie-item");

    for(var i = 0; i < movieItem.length; i++) {
      movieItem[i].addEventListener("mouseenter", function(evt) {
        var query = "&i=" + evt.target.dataset.id;

        $(".movie-item").addClass("hide");
        evt.target.className = "movie-item";

        getData(query).done(function(data) {
          evt.target.innerHTML = renderLiContent(data);
        }).fail(function(xhr) {
          console.log('error', xhr);
        })
      }, false);

      movieItem[i].addEventListener("mouseleave", function(event) {
        $(".movie-item").addClass("hide");
      }, false);
    }
  };

  function renderLiContent(asset) {
    var imageUrl = /\b(http|https)/.test(asset.Poster)
      ? asset.Poster
      : variable.defaultImageUrl;

    return '<div class="image-container">'
      + '<img src="'+ imageUrl +'">'
      + '</div>'
      + '<div class="title-container">'
         + '<span class="title">'+ asset.Title +'</span>'
         + '<span class="type">'+ asset.Type +'</span>'
      + '</div>'
      + '<div class="fly-out-modal">'
         + '<div class="flyout-title">'+ asset.Title +'</div>'
         + '<div class="flyout-year">'+ asset.Year +'</div>'
         + '<div class="flyout-director">'+ asset.Director +'</div>'
         + '<div class="flyout-rate">'+ asset.Rated +'</div>'
      + '</div>'
  };

  function renderLi(asset) {
    var hide = asset.Director ? "" : "hide";
  	return '<li class="movie-item '+ hide +'" data-id="'+asset.imdbID+'">'
      + renderLiContent(asset)
    + '</li>';
  };

  function loopAsset(assets) {
  	var content = ""
  	for (var index = 0; index < assets.length; index++) {
  		if (index === 0) {
  			content += "<ul class='movie-row'>";
  		}
  		content += renderLi(assets[index]);
  		if (index === (assets.length -1)) {
  			content += "</ul>"
  		}
  	}
  	document.getElementsByClassName("images-content-container")[0].innerHTML = content;
    addListener();
  };

  function render(inputValue) {
    var query = "&s=" + inputValue;
    getData(query).done(function(data) {
      list.setList(data);
      loopAsset(list.getList());
    }).fail(function(xhr) {
      console.log('error', xhr);
    })
  };

  document.getElementById("search-box").addEventListener("keyup", debounce(function(evt) {
		render(evt.target.value);
  }, 1000));
})(jQuery)
