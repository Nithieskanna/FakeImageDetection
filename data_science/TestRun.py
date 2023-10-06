
from flask import Flask, request, jsonify
import tensorflow as tf
import cv2
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from flask_cors import CORS

from lime import lime_image

from skimage.segmentation import mark_boundaries


app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def test():
    image = request.files['image']
    r1 = CNN_Module(image)
    results = r1.predict()
    return jsonify(results)

class CNN_Module(object):
    new_model = tf.keras.models.load_model('saved_model/final_model.h5')
    #Creating XAI instance
    explainer = lime_image.LimeImageExplainer()
    

    def __init__(self, image):
        self.image = image

    def preprocess(img):
        if img.shape[-1] == 4:
            # Convert the image from RGBA to RGB
            img = np.array(img)
            img = img[:, :, :3]
        img = cv2.resize(img, (256,256)) # Resize the image to match the input size of the model
        img = img.astype('float32') / 255.0 # Normalize the image
        img = img.reshape((-1,) + img.shape)
        print("Done...")
        return img
    

    def explanation_heatmap(exp, exp_class, img_name):
        # Using heat-map to highlight the importance of each super-pixel for the model prediction
        dict_heatmap = dict(exp.local_exp[exp_class])
        heatmap = np.vectorize(dict_heatmap.get)(exp.segments) 
        plt.clf()

        plt.imshow(heatmap, cmap = 'RdBu', vmin  = -heatmap.max(), vmax = heatmap.max())
        plt.colorbar()
        plt.axis('off')
        #Saving the figure
        hmap_path = "../front_end/src/saved_images/heatmap_"+img_name
        plt.savefig(hmap_path, bbox_inches='tight')
        
        # Read the image
        # h_img = cv2.imread('prediction_heatmap.jpg')
        # with open("saved_images/prediction_heatmap.jpg", "rb") as f:
        #     h_img = base64.b64encode(f.read()).decode('utf-8')
        return hmap_path



    def generate_prediction_sample(exp, exp_class, show_positive, hide_background, img_name):
        image, mask = exp.get_image_and_mask(exp_class, 
                                            positive_only=show_positive, 
                                            num_features=10, 
                                            hide_rest=hide_background,
                                            )
        plt.clf()
        plt.imshow(mark_boundaries(image, mask, outline_color=(0, 1, 0)))
        plt.axis('off')
        #Saving the figure
        filename = "../front_end/src/saved_images/prediction_highlight_"+img_name
        plt.savefig(filename, bbox_inches='tight')
        
        # Read the image
        # hl_img = cv2.imread('prediction_highlight.jpg')
        # with open("saved_images/prediction_highlight.jpg", "rb") as f:
        #     hl_img = base64.b64encode(f.read()).decode('utf-8')
        return filename
    
    def predict(self):
        img = cv2.imdecode(np.frombuffer(self.image.read(), np.uint8), cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        test_image = CNN_Module.preprocess(img_rgb)

        path = "../front_end/src/saved_images/"+self.image.filename
        cv2.imwrite(path, img)

        prediction = CNN_Module.new_model.predict(test_image)
        predicted_class = np.argmax(prediction)

        exp = CNN_Module.explainer.explain_instance(test_image[0],  CNN_Module.new_model.predict, top_labels=4, hide_color=0, num_samples=4)

        pred_highlight = CNN_Module.generate_prediction_sample(exp, exp.top_labels[0], True, False, self.image.filename)

        heat_map = CNN_Module.explanation_heatmap(exp, exp.top_labels[0], self.image.filename)

        return {
            'predicted_class': int(predicted_class),
            'prediction': prediction[0].tolist(),
            # 'pred_highlight': pred_highlight,
            # 'heat_map': heat_map,
            'image_name': self.image.filename
        }
    

if __name__ == "__main__":
    app.run()




# flask --app TestRun run