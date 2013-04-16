/* 
 * Component: UrlTimestamp
 * Description: Add hidden component to update URL with timestamp (#mm:ss) on seek 
 * Usage:
    var player = _V_(videoId, {
       urltimestamp: true
    });
 * 
 * 
 */

_V_.options.components['UrlTimestamp'] = {};
_V_.options.urltimestamp = false;
_V_.UrlTimestamp = _V_.Component.extend({
  
  firstPlay: true,
  seekToSeconds: 0,
  
  init: function(player, options){
    this._super(player, options);
    if (this.player.options.urltimestamp) {
      // check url for timestampe
      this.checkUrlForTimestamp();
      // add a mouseup event to add timestamp to url
      this.player.controlBar.addEvent("mouseup", this.proxy(this.onMouseUp)); 
    }
      
  },
  
  checkUrlForTimestamp: function() {
    var that = this;
    this.seekToSeconds = this._getSecondsFromUrl();
    if (this.seekToSeconds) {
      // add play event handler
      this.player.addEvent("play", function(){
        that.onPlay();
      });
      this.player.play();
    }
  },
  
  onPlay: function() {
    var that = this;
    // if first play, and seekToSeconds set, seek then pause
    if ( this.firstPlay ) {
      this.firstPlay = false;
      if ( this.seekToSeconds ) {
        setTimeout( function(){          
          that.player.currentTime( that.seekToSeconds );
          setTimeout( function(){
            that.player.pause();
          }, 200 );
        }, 200)
        
      }
    }
  },
  
  onMouseUp: function(event) {
    var seconds, string;
    seconds = this.player.currentTime();
    string = this._formatTime(seconds);
    // put it in the hash
    window.location.hash = '#'+string; 
  },
  
  createElement: function(){
    return this._super("div", {
      className: "hide"
    });
  },
  
  _formatTime: function( seconds ) {
    var s = parseInt( seconds ) || 0, 
        h = parseInt( s / 3600 ) % 24,
        m = parseInt( s / 60 ) % 60,
        s = s % 60,
        string;
    // create format hh:mm:ss
    string = (h > 0 ? h + ':' : '') + (m < 10 ? '0' + m : m ) + ':' + (s < 10 ? '0' + s : s);
    // remove starting zeros
    if ( string[0] == '0' ) string = string.substring(1, string.length);
    return string;
  },
  
  _getSecondsFromUrl: function(){
    var hash, time, s, m, h, seconds = 0;
    if(window.location.hash) {
      hash = window.location.hash.substring(1);
      time = hash.split(/:/);
      time.reverse();
      s = parseInt( time[0] ) || 0;
      m = parseInt( time[1] ) || 0;
      h = parseInt( time[2] ) || 0;
      seconds = h * 3600 + m * 60 + s; 
    }
    return seconds;
  }
  
});

/* 
 * Component: SourcesButton
 * Description: Add button/menu to change sources
 * Usage:
    var player = _V_(videoId, {
       videoTracks: [
        {
          "label": "128 kbps",
          "url": "http://path_to_128.mp4"
        },{
          "label": "256 kbps",       
          "url": "http://path_to_256.mp4"
        },{
          "label": "512 kbps",
          "url": "http://path_to_512.mp4"
        }
       ],
       videoTracksTitle: 'Quality'
    });
 * 
 * 
 */

_V_.SourceMenuItem = _V_.MenuItem.extend({

  init: function(player, options){
    this._super(player, options);
    this.player.addEvent("sourcechange", _V_.proxy(this, this.update));
  },
  
  createElement: function(type, attrs){
    return this._super("li", _V_.merge({
      className: "vjs-menu-item",
      innerHTML: this.options.label
    }, attrs));
  },

  onClick: function(){
    var that = this,
        currentTime = this.player.currentTime(),
        isPlaying = !this.player.paused();
    this._super();
    this.player.src(this.options.url);
    this.player.removeEvent("loadstart");
    this.player.addEvent("loadstart",function(){
      var player = this;
      this.triggerEvent("sourcechange");
      this.play();
      if ( currentTime ) {
        setTimeout( function(){ 
          player.currentTime(currentTime);
          if ( !isPlaying ) {
            setTimeout( function(){
              player.pause();
            }, 200);
          }
        }, 200 );        
      }
    });   
  },
  
  update: function(){
    if (this.options.url==this.player.currentSrc()) {
      this.selected(true);
    } else {
      this.selected(false);
    }
  }

});

_V_.SourcesButton = _V_.TextTrackButton.extend({
  
  kind: "sources",
  buttonText: "Sources",
  className: "vjs-sources-button",

  createMenu: function(){
    var menu = new _V_.Menu(this.player),
        title;
    
    title = this.player.options.videoTracksTitle || _V_.uc(this.kind);
    
    // Add a title list item to the top
    menu.el.appendChild(_V_.createElement("li", {
      className: "vjs-menu-title",
      innerHTML: title
    }));

    this.items = this.createItems();

    // Add menu items to the menu
    this.each(this.items, function(item){
      menu.addItem(item);
    });

    // Add list to element
    this.addComponent(menu);

    return menu;
  },
  
  // Create a menu item for each text track
  createItems: function(){
    var that = this,
        items = [],
        sources = [],
        sourceTech,
        currentUrl = this.player.currentSrc() || this.player.options.src ;
        
    if ( this.player.options.videoTracks ) {
      sources = this.player.options.videoTracks;
    }    
    this.each(sources, function(source){
      // select the correct source if array
      if (source.url instanceof Array) {
        sourceTech = that.player.selectSource(source.url);
        source.url = sourceTech.source;
      }
      items.push(new _V_.SourceMenuItem(this.player, {
        label: source.label,
        url: source.url,
        selected: ( source.url == currentUrl )
      }));
    });
    return items;
  }

});

// Add Buttons to controlBar
_V_.merge(_V_.ControlBar.prototype.options.components, {
  "SourcesButton": {}
});
