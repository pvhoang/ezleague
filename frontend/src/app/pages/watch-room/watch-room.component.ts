import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'p5';
import 'p5/lib/addons/p5.sound';
declare var p5: any;
@Component({
  selector: 'app-watch-room',
  template: `
    <video id="video" controls #videoElement></video>
    <div #p5Canvas></div>
  `,
  styleUrls: ['./watch-room.component.scss'],
})
export class WatchRoomComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;

  video: HTMLVideoElement;
  @ViewChild('p5Canvas') p5Canvas!: ElementRef;
  constructor() {}
  ngAfterViewInit() {
    // this.video = this.videoElement.nativeElement;
    // //clone và Xử lý insertable stream từ camera
    // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    //   const videoTrack = stream.getVideoTracks()[0];
    //   this.processVideo(videoTrack);
    // });
  }

  // processVideo(videoTrack: MediaStreamVideoTrack) {
  //   const trackProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
  //   const trackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
  //   const transformer = new TransformStream({
  //     async transform(videoFrame, controller) {
  //       // Xử lý videoFrame
  //       //vẽ hình tròn vào videoFrame
  //       const canvas = new OffscreenCanvas(videoFrame.width, videoFrame.height);
  //       const ctx = canvas.getContext('2d');
  //       ctx.drawImage(videoFrame, 0, 0);
  //       ctx.beginPath();
  //       ctx.arc(100, 75, 50, 0, 2 * Math.PI);
  //       ctx.stroke();
  //       const processedVideoFrame = new VideoFrame(canvas, {
  //         timestamp: videoFrame.timestamp,
  //       });
  //       videoFrame.close();
  //       controller.enqueue(processedVideoFrame);
  //     },
  //   });
  //   const readableStream = trackProcessor.readable.pipeThrough(transformer);
  //   readableStream.pipeTo(trackGenerator.writable);
  //   const processedStream = new MediaStream();
  //   processedStream.addTrack(trackGenerator);
  //   this.video.srcObject = processedStream;
  //   this.video.play();
  // }
  ngOnInit(): void {}
}
