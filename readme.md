# WTF Player

Super simple player with [WebTorrent](https://github.com/feross/webtorrent) and subtitles support. Works best with Chrome. May not work well with files over 1GB.

1. Seed `.mp4` and `.vtt` files (separately) with [WebTorrent Desktop](https://webtorrent.io/desktop/) (recommended) or [Instant.io](https://instant.io/) and copy infohashes.
1. Paste infohashes and press _Play_

See it in action: watch [Sintel with czech subtitles](http://godric-cz.github.io/wtf-player/#v=apdZv/1cCvZTGZeft4MhifTzw10&s=SFO7pbCT5PXh5fWurkf39rIr8Pk) right away.

## Notes

- Convert mkv to mp4 with h264 and aac for best support of seeking: `avconv -i SomeInput.mkv -c:v copy -c:a aac -strict experimental -b:a 128k Output.mp4`.
- Convert srt to utf8 and then with [WebVTT](https://atelier.u-sub.net/srt2vtt/) to vtt.
