
### sox commands

 - Get file info:  
```
sox \
    --i \
    "audio/songs/conversation.mp3"
```

 - Convert file with bitrate (example):    
```
sox \
    -v 0.99 \
    -t mp3 \
    "audio/fx/Applause Sound Effect HD No Copyright (128 kbps).mp3" \
    -r 48000 \
    -t mp3 \
    "output.mp3
```

 - Get file bitrate (example):    
```
sox \
    --i \
    -B \
    "audio/songs/conversation.mp3"
```

 - Concat two audio files:    
```
sox \
    -t mp3 \
    -v 0.99 \
    -m "audio/songs/conversation.mp3" \
    -t mp3 \
    -v 0.99 \
    "audio/fx/Fart - Gaming Sound Effect (HD) (128 kbps).mp3" \
    -t mp3 \
    "output.mp3"

```