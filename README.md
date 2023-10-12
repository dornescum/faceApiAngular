# FaceRecognitionApp in browser for pictures

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.4.

Properties:

- **@ViewChild('canvas') canvas!**: A reference to the canvas element in the template.
- **selectedImageUrl** : The URL of the image selected by the user.
- **message** : A message to be displayed in case of an error or notification.

Methods:

- **ngAfterViewInit()**: This method loads the necessary models for face detection after the component is fully initialized.
- **constructor()**: The class constructor.
- **ngOnInit()**: A method called immediately after the component is initialized.
- **onFileChanged(event: any)**: This method is triggered when the user uploads an image. It processes the image, detects faces in it, and displays the results on the canvas.
- **loadAllowedFaces()**: Loads the allowed images for comparison from a predefined source.
- **getAllowedFaceDescriptors(allowedFaces: HTMLImageElement[])**: Retrieves descriptors for the allowed faces.
- **compareWithAllowedFaces(uploadedDescriptor: Float32Array)**: Compares the descriptor of the uploaded face with the descriptors of the allowed faces and returns **true** if the faces match and **false** otherwise.
 ![Alt Text](/src/assets/readme/allowed1.png)
 ![Alt Text](/src/assets/readme/allowed2.png)
 ![Alt Text](/src/assets/readme/denied1.png)
 ![Alt Text](/src/assets/readme/denied2.png)
# faceApiAngular
