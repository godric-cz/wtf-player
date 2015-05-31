
var videostream = require('videostream')
var WebTorrent = require('webtorrent')

var client = new WebTorrent()

global.play = function(hash) {

  if(!hash.match(/[0-9a-f]{40}/)) {
    //alert('wrong hash')
    return
  }

  var magnetUri = 'magnet:?xt=urn:btih:' + hash // + '&tr=wss://tracker.webtorrent.io'
  var throbber = document.getElementById('circleG')

  throbber.setAttribute('style', 'display: block');

  client.add(magnetUri, function(torrent) {

    // Got torrent metadata!
    console.log('Torrent info hash:', torrent.infoHash)

    // Let's say the first file is a webm (vp8) or mp4 (h264) video...
    var file = torrent.files[0]

    // Create a video element
    var player = document.getElementById('player')
    var video = document.createElement('video')
    video.autoplay = true
    player.appendChild(video)
    video.setAttribute('style', 'width: 100%')
    video.onloadedmetadata = function() {
      player.setAttribute('style', 'min-height: ' + video.getBoundingClientRect().height + 'px')
      video.controls = true
      throbber.remove();
    }

    // Stream the video into the video tag
    videostream(file, video)

  })

}
