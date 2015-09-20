var mediaInterface = function() {
    
    var videoElementId = document.querySelector('video').id;

    var deviceFilter = function(filterString, devices) {
            var audioInputDevices = [];
            devices.forEach(function(device) {
                if (device.kind === filterString) {
                    audioInputDevices.push(device);
                }
            });
            
            return audioInputDevices;
    };

    var getAudioInputDevices = function(cb, er) {
        var audioFilterFn = currier(deviceFilter, 'audioinput')

        navigator.mediaDevices.enumerateDevices()
        .then(audioFilterFn)
        .then(cb)
        .catch(er);
    };

    var getAudioOutputDevices = function(cb, er) {
        var audioFilterFn = currier(deviceFilter, 'audiooutput')

        navigator.mediaDevices.enumerateDevices()
        .then(audioFilterFn)
        .then(cb)
        .catch(er);
    };

    var getVideoInputDevices = function(cb, er) {
        var videoFilterFn = currier(deviceFilter, 'videoinput')

        navigator.mediaDevices.enumerateDevices()
        .then(videoFilterFn)
        .then(cb)
        .catch(er);
    };

    var stopTrack = function(track) {
        if (track) {
            track.stop();
        }
    };

    var stopAllTracks = function() {
        if (window.stream) {
            window.stream.getTracks().forEach(function(track) { stopTrack(track); });
        }
    };

    var start = function(constraints) {
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream){
            window.stream = stream;
            var videoElement = document.querySelector("video#" + videoElementId);
            attachMediaStream(videoElement, stream);
        })
        .catch(function (error) {
            if (error.name === 'ConstraintNotSatisfiedError') {
                var exactWidth = constraints.video.width ? constraints.video.width.exact : "NA"; 
                var exactHeight = constraints.video.height ? constraints.video.height.exact : "NA";
                alert('The resolution ' + exactWidth + 'x' +
                exactHeight + ' px is not supported by your device.');
            } else if (error.name === 'PermissionDeniedError') {
                alert('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
            }
        });
    };

    var init = function(videoElementId) {
        videoElementId = videoElementId;
    };

    return {
        "init": init,
        "start": start,
        "stopTrack": stopTrack,
        "stopAllTracks": stopAllTracks,
        "getAudioInputDevices": getAudioInputDevices,
        "getAudioOutputDevices": getAudioOutputDevices,
        "getVideoInputDevices": getVideoInputDevices
    };
};