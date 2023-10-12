import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as faceapi from 'face-api.js';


@Component({
  selector: 'app-face-detect', templateUrl: './face-detect.component.html', styleUrls: ['./face-detect.component.scss']
})
export class FaceDetectComponent implements OnInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  selectedImageUrl: string | null = null;
  message: string | null = '';

  constructor() {
  }

  async ngAfterViewInit() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await faceapi.nets.ageGenderNet.loadFromUri('/assets/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
  }

  ngOnInit(): void {
  }

  async onFileChanged(event: any) {
    this.message = '';
    const img = await faceapi.bufferToImage(event.target.files[0]);
    const displaySize = {width: img.width, height: img.height};

    this.canvas.nativeElement.width = img.width;
    this.canvas.nativeElement.height = img.height;


    // Draw the uploaded image onto the canvas
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx?.clearRect(0, 0, img.width, img.height); // Clear any previous drawings.
    ctx?.drawImage(img, 0, 0, img.width, img.height);


    faceapi.matchDimensions(this.canvas.nativeElement, displaySize);

    const detections = await faceapi.detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withAgeAndGender()
      .withFaceDescriptors()
      .withFaceExpressions();
    // console.log('detections ', detections)

    if (detections.length === 0) {
      console.error('No face detected in the uploaded image.');
      return;
    }
    const uploadedDescriptor = detections[0].descriptor;

    const isAllowedFace = await this.compareWithAllowedFaces(uploadedDescriptor);
    console.log('isAllowedFace ', isAllowedFace)

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    faceapi.draw.drawDetections(this.canvas.nativeElement, resizedDetections);
    faceapi.draw.drawFaceLandmarks(this.canvas.nativeElement, resizedDetections);
    faceapi.draw.drawFaceExpressions(this.canvas.nativeElement, resizedDetections);

// detections
    resizedDetections.forEach(detection => {
      const {age, gender, genderProbability, alignedRect, expressions} = detection;
      const box = detection.detection.box;
      const text = `${Math.round(age)} years - ${gender} (${Math.round(genderProbability * 100)}%)
      -  ${expressions.asSortedArray()[0].expression} `;
      const drawBox = new faceapi.draw.DrawBox(box, {label: text});
      drawBox.draw(this.canvas.nativeElement);
    });


    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.selectedImageUrl = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }


    const uploadedImg = await faceapi.bufferToImage(event.target.files[0]);
    const detectionResult = await faceapi
      .detectSingleFace(uploadedImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detectionResult) {
      const uploadedDescriptor = detectionResult.descriptor;
      await this.compareWithAllowedFaces(uploadedDescriptor);
    }
  }

  async loadAllowedFaces() {
    const allowedImages = ['1.jpg', '2.jpg'];
    const allowedFacesPromises = allowedImages.map(imgName => faceapi.fetchImage(`assets/allowedPerson/${imgName}`));
    ``

    const allowedFaces = await Promise.all(allowedFacesPromises);

    if (allowedFaces.length === 0) {
      throw new Error('No allowed faces detected');
    }
    return allowedFaces;
  }

  async getAllowedFaceDescriptors(allowedFaces: HTMLImageElement[]) {
    const descriptorPromises = allowedFaces.map(face => faceapi.detectSingleFace(face).withFaceLandmarks().withFaceDescriptor());
    const descriptors = await Promise.all(descriptorPromises);

    return descriptors.map(d => d?.descriptor);
  }

  async compareWithAllowedFaces(uploadedDescriptor: Float32Array): Promise<boolean> {
    const allowedDescriptors = await this.getAllowedFaceDescriptors(await this.loadAllowedFaces());

    const validDescriptors = allowedDescriptors.filter(desc => desc !== undefined) as Float32Array[];

    const labeledAllowedDescriptors = validDescriptors.map((desc, i) => new faceapi.LabeledFaceDescriptors(`allowedFace_${i}`, [desc]));

    const faceMatcher = new faceapi.FaceMatcher(labeledAllowedDescriptors);
    const bestMatch = faceMatcher.findBestMatch(uploadedDescriptor);
    if (bestMatch.distance > 0.5) {
      this.message = 'not allowed person'
    } else {
      this.message = 'allowed person';
    }
    return bestMatch.distance < 0.5;
  }


}
