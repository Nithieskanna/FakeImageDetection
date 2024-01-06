# FakeImageDetection
The purpose of this research is to create a novel image representation architecture that identifies and visually explains the key areas of a forged image that has been created by both humans and machine-generated images, such as GANs, deepfakes, and photoshopped images.

The model is trained with DL XceptionNet and XAI.

Datasets collected from the following :
> https://www.kaggle.com/datasets/tbourton/photoshopped-faces
> https://www.kaggle.com/datasets/bwandowando/all-these-people-dont-exist
> https://www.kaggle.com/datasets/9f08fe1daad5011ffde26e66c793278810914311cbfb2a2d5d03639f15d3b11a

Every image is resized to 256x256, separated into train, test, and validation sets 6:2:2 ratio respectively.

Trained Model: ExceptionNet with XAI.
