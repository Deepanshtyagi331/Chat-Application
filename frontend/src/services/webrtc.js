import socket from './socket';

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.configuration = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        },
        {
          urls: 'stun:stun1.l.google.com:19302'
        }
      ]
    };
  }

  // Initialize peer connection
  initPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.configuration);

    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          targetUserId: this.targetUserId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      // Update UI with remote stream
      this.onRemoteStream?.(this.remoteStream);
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      switch (this.peerConnection.connectionState) {
        case 'connected':
          this.onConnectionStateChange?.('connected');
          break;
        case 'disconnected':
          this.onConnectionStateChange?.('disconnected');
          break;
        case 'failed':
          this.onConnectionStateChange?.('failed');
          break;
        case 'closed':
          this.onConnectionStateChange?.('closed');
          break;
      }
    };
  }

  // Get user media (camera/microphone)
  async getUserMedia(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  // Create offer for outgoing call
  async createOffer(targetUserId) {
    this.targetUserId = targetUserId;
    this.initPeerConnection();

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    return offer;
  }

  // Create answer for incoming call
  async createAnswer(offer, targetUserId) {
    this.targetUserId = targetUserId;
    this.initPeerConnection();

    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    return answer;
  }

  // Set remote description
  async setRemoteDescription(description) {
    await this.peerConnection.setRemoteDescription(description);
  }

  // Add ICE candidate
  async addIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  // End call
  endCall() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.remoteStream = null;
    this.targetUserId = null;
  }

  // Toggle mute audio
  toggleAudio() {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        return audioTracks[0].enabled;
      }
    }
    return false;
  }

  // Toggle video
  toggleVideo() {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        return videoTracks[0].enabled;
      }
    }
    return false;
  }

  // Set callbacks
  setOnRemoteStream(callback) {
    this.onRemoteStream = callback;
  }

  setOnConnectionStateChange(callback) {
    this.onConnectionStateChange = callback;
  }
}

export default new WebRTCService();