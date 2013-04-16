video-js-plugins
================

Useful plug-ins for video-js players, including url timestamps, and multiple video sources

##Overview

These are a set of plug-ins that extend the default VideoJS functionality. Current plug-ins include the ability to update the current URL with the current timestamp (#mm:ss) when you seek, and provide multiple video sources for the user to select from (e.g. multiple videos with different bitrates)

##Setup

Include the VideoJS libraries (tested with version 3.2.0) and plug-ins in the head as follows:

```html
<link href="http://vjs.zencdn.net/c/video-js.css" rel="stylesheet">
<link href="css/videojs.plugin.css" rel="stylesheet">
<script src="http://vjs.zencdn.net/c/video.js"></script>
<script type="text/javascript" src="js/videojs.plugin.js"></script>
```

##Usage

Use the player as you normally would, but pass in the appropriate options to activate the plug-ins

###Options

- **urltimestamp [Boolean]** - if true, url will automatically update with timestamp (#mm:ss) onseek, and seek to a timestamp when a player loads if there's one in the url
- **videoTracks [Array of Objects]** - array of objects that represent videos, which will load as a menu in the video control bar
  - **videoTracks.url [String or Array]** - a url or array of url that represents the video to load
  - **videoTracks.label [String]** - the label of this video
- **videoTracksTitle [String]** - the title of the VideoTracks menu (e.g. *Video Quality*)

###Examples

Example will activate the URL timestamp and give the user the ability to select from one of three video qualities

```javascript
var player = _V_("my_video", {
   urltimestamp: true,
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
   videoTracksTitle: "Quality"
});
```

##Contact

Feel free to send any questions/comments/feedback to [brianfoo@nypl.org](mailto:brianfoo@nypl.org)
