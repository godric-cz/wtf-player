
// non-browserify loads
var client = new WebTorrent()
var Buffer = buffer.Buffer

function hobluj() {

    var loader = document.getElementById('loader')

    var err;
    if(err = validate()) {
        alert(err)
        return
    }

    var videoHash = document.getElementById('videoHash').value.toLowerCase()
    var subtitlesHash = document.getElementById('subtitlesHash').value.toLowerCase()

    loader.style.visibility = 'visible' // display loader

    var prefix = 'magnet:?xt=urn:btih:'
    var trackers = '&tr=wss%3A%2F%2Ftracker.openwebtorrent.com'

    var video       = prefix + videoHash + trackers
    var subtitles   = prefix + subtitlesHash + trackers

    client.add(video, function(torrent) {
        // got torrent metadata!
        console.log('Downloading video:', torrent.infoHash)

        // find first .mp4 file
        var file = torrent.files.find(function(file) {
            return file.name.endsWith('.mp4')
        })

        file.renderTo(document.getElementById('player')) // TODO what if no file?

        // update url
        hashEncode({
            v:  hexToBase(videoHash).slice(0, -1),
            s:  hexToBase(subtitlesHash).slice(0, -1)
        })
    })

    var useTorrentForSubtitles = function(torrent) {
        console.log('Downloading subtitles:', torrent.infoHash)

        var file = torrent.files.find(function(file) {
            return file.name.endsWith('.vtt')
        })

        file.getBlobURL(function(err, url) {
            if(err) throw err
            console.log('Subtitles ready.')
            document.getElementById('subtitles').src = url
            document.getElementById('player').textTracks[0].mode = 'showing'
        })
    }

    // hack to use local subtitles for sintel (subtitles are not usually seeded)
    if(subtitlesHash == '4853bba5b093e4f5e1e5f5aeae47f7f6b22bf0f9') {
        urlToBuffer('sintel.vtt', function(buf) {
            buf.name = 'sintel.vtt'
            client.seed(buf, null, useTorrentForSubtitles)
        })
    } else {
        client.add(subtitles, useTorrentForSubtitles)
    }

}

function validate() {
    document.getElementById('videoHash').value = document.getElementById('videoHash').value.toUpperCase()
    document.getElementById('subtitlesHash').value = document.getElementById('subtitlesHash').value.toUpperCase()
    var videoHash = document.getElementById('videoHash').value
    var subtitlesHash = document.getElementById('subtitlesHash').value
    if(!isInfoHash(videoHash)) return 'špatný formát v poli video'
    if(!isInfoHash(subtitlesHash)) return 'špatný formátv poli titulky'
}

function isInfoHash(str) {
    return str.match(/^[A-F0-9]{40}$/) != null
}

function hashEncode(params) {
    out = []
    for(var key in params) {
        out.push(key + '=' + params[key])
    }
    window.location.hash = out.join('&')
}

function hashDecode() {
    var hash = window.location.hash
    if(hash.length > 1) {
        var out = {};
        hash.slice(1).split('&').forEach(function(e) {
            var item = e.split('=')
            out[item[0]] = item[1]
        })
        return out;
    } else {
        return null
    }
}

function animateResize(e, h) {
    var duration = 1000
    e.style.transition = 'height ' + duration + 'ms, line-height ' + duration + 'ms'
    e.style.height = h + 'px'
    e.style.lineHeight = h + 'px'
    setTimeout(function(){
        e.style.transition = 'none'
    }, duration)
}

function hexToBase(myHexString) {
    var hexArray = myHexString
        .replace(/\r|\n/g, "")
        .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
        .replace(/ +$/, "")
        .split(" ")
    var byteString = String.fromCharCode.apply(null, hexArray)
    var base64string = window.btoa(byteString)
    return base64string
}

function baseToHex(base) {
    var bin = window.atob(base)
    var hex = ''
    for(var i = 0; i < bin.length; i++) {
        var ch = bin.charCodeAt(i).toString(16)
        hex += ch.length < 2 ? '0' + ch : ch
    }
    return hex
}

function urlToBuffer(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            callback(new Buffer(xhr.responseText))
        }
    }
    xhr.open('GET', url)
    xhr.send()
}

window.addEventListener('load', function() {
    var params = hashDecode()
    if(params) {
        videoHash.value = baseToHex(params.v + '=').toUpperCase()
        subtitlesHash.value = baseToHex(params.s + '=').toUpperCase()
    }
    var player = document.getElementById('player')
    player.addEventListener('loadeddata', function() {
        animateResize(document.getElementById('videoblock'), player.offsetHeight)
        player.controls = true
    })
})
