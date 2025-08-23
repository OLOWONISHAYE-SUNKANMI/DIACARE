import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Settings,
  Maximize,
  Minimize,
  Camera,
  Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface VideoCallInterfaceProps {
  isHost: boolean;
  patientName?: string;
  professionalName?: string;
  onEndCall: () => void;
  onCallStarted?: () => void;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  isHost,
  patientName,
  professionalName,
  onEndCall,
  onCallStarted
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [callDuration, setCallDuration] = useState(0);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const callStartTime = useRef<number>(0);

  useEffect(() => {
    initializeCall();
    
    // Update call duration every second
    const interval = setInterval(() => {
      if (isCallActive && callStartTime.current) {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      endCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Initialize peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        const [stream] = event.streams;
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current?.connectionState;
        if (state === 'connected') {
          setConnectionStatus('connected');
          setIsCallActive(true);
          callStartTime.current = Date.now();
          onCallStarted?.();
          toast({
            title: t('videoCall.connected'),
            description: t('videoCall.callStarted'),
          });
        } else if (state === 'disconnected' || state === 'failed') {
          setConnectionStatus('disconnected');
          setIsCallActive(false);
        }
      };

      // Handle ICE candidates (simplified for demo)
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real implementation, send this to the other peer via signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };

      // Simulate successful connection for demo purposes
      setTimeout(() => {
        setConnectionStatus('connected');
        setIsCallActive(true);
        callStartTime.current = Date.now();
        onCallStarted?.();
      }, 2000);

    } catch (error) {
      console.error('Error initializing call:', error);
      toast({
        title: t('videoCall.error'),
        description: t('videoCall.initializationError'),
        variant: 'destructive'
      });
      setConnectionStatus('disconnected');
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
        toast({
          title: isVideoEnabled ? t('videoCall.videoDisabled') : t('videoCall.videoEnabled'),
        });
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
        toast({
          title: isAudioEnabled ? t('videoCall.audioDisabled') : t('videoCall.audioEnabled'),
        });
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const endCall = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsCallActive(false);
    setConnectionStatus('disconnected');
    onEndCall();

    toast({
      title: t('videoCall.callEnded'),
      description: t('videoCall.thankYou'),
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`h-screen bg-gray-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <div>
            <h2 className="font-semibold">
              {isHost ? `${t('videoCall.consultationWith')} ${patientName}` : 
                       `${t('videoCall.consultationWith')} Dr. ${professionalName}`}
            </h2>
            <p className="text-sm text-gray-300">
              {connectionStatus === 'connected' ? 
                `${t('videoCall.duration')}: ${formatDuration(callDuration)}` :
                t(`videoCall.${connectionStatus}`)
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote Video (main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          poster="/placeholder-avatar.jpg"
        />
        
        {/* Remote video placeholder */}
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-lg">
                {connectionStatus === 'connecting' ? 
                  t('videoCall.waitingForParticipant') : 
                  t('videoCall.participantVideoOff')
                }
              </p>
            </div>
          </div>
        )}

        {/* Local Video (picture-in-picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="w-8 h-8 text-gray-500" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1 rounded">
            {t('videoCall.you')}
          </div>
        </div>

        {/* Connection status overlay */}
        {connectionStatus !== 'connected' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Card className="p-6 text-center">
              <CardContent>
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-lg font-semibold">
                  {t(`videoCall.${connectionStatus}`)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-12 h-12 p-0 text-white hover:bg-gray-700"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">
            {t('videoCall.controlsHint')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterface;