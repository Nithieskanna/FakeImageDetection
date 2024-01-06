 
import * as React from 'react';
import { useEffect, useState } from 'react';
import './review.css';
import AccuracyView from './AccuracyView';
import CircularProgress from '@mui/joy/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

function Review() {

    const type = ['Real', 'Photoshop', 'Deepfake', 'Gan'];
    const [predictedClass, setPredictedClass] = useState('');
    const [prediction, setPrediction] = useState([]);
    const [predHighlight, setPredHighlight] = useState('');
    const [heatMap, setHeatMap] = useState('');
    const [image, setImage] = useState('');
    // const [fileName, setFileName] = useState('');
    const [alignment, setAlignment] = useState("center");
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
    };
    

    useEffect(() => {
        const pred_class = JSON.parse(localStorage.getItem("predicted_class"));
        const pred = JSON.parse(localStorage.getItem("prediction"));
        const filename = JSON.parse(localStorage.getItem("filename"));

        const img = require(`../saved_images/${filename}`);
        const pred_img = require(`../saved_images/prediction_highlight_${filename}`)
        const heatmap_img = require(`../saved_images/heatmap_${filename}`)

        setPredictedClass(pred_class);
        setPrediction(pred);
        setImage(img);
        setPredHighlight(pred_img);
        setHeatMap(heatmap_img);
    },[]);

    const displayOther = prediction.map((item, index) => {
        if(index!==predictedClass){
            var val = parseFloat(item) * 100;
            var percentage = parseInt(val, 10);
            return <Grid item xs={4}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '100px', paddingLeft: '50px'}}>
                        <CircularProgress size="lg" determinate value={percentage}>
                            {percentage}% 
                        </CircularProgress>
                    <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '10px', paddingLeft: '10px'}}>{type[index]}</h4>
                </div>
            </Grid>
            }
        
        });
      

return (
    <Card sx={{ maxWidth: 900, maxHight: 700 }}>
        <CardContent>
            <Typography variant="h2" component="div" align='center' fontFamily={"Apple Color Emoji"}>
                Fake Image Detector Results
            </Typography>
            <Card style={{ backgroundColor: '#80cbc4' }}>
                <CardContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={0}>
                            <Grid item xs={4}>
                                <img src={image} style={{ height: '225px', width: '225px', paddingLeft: '20px' }} alt={"Original_image"} />
                            </Grid>
                            <Grid item xs={4}>
                                <img src={predHighlight} style={{ height: '225px', width: '225px', paddingLeft: '40px' }} alt={"prediction_image"} />
                            </Grid>
                            <Grid item xs={4}>
                                <img src={heatMap} style={{ height: '225px', width: '225px', paddingLeft: '60px' }} alt={"heatmap_image"} />
                            </Grid>
                            <Grid item xs={12} container spacing={0}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '250px' }}>
                                    {AccuracyView(prediction[predictedClass])}
                                    <h2 align={alignment}>{type[predictedClass]}</h2>
                                </div>
                            </Grid>
                            <Grid container spacing={0}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '25px'}}>
                                    {displayOther}
                                </div>
                            </Grid>
                            <Grid>
                                <div>
                                    <br />
                                    <Button variant="contained" onClick={handleClickOpen} color="success">
                                        See Explanation
                                    </Button>
                                    <SimpleDialog
                                        open={open}
                                        onClose={handleClose}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </CardContent>
    </Card>
)

}
  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle><b>Explanation</b>
            <p><b>Figure 1</b> displays the Original image.</p>
            <p><b>Figure 2</b> displays the highlighted areas that that is considered by the model to classify as real or fake.</p>
            <p><b>Figure 3</b> displays a heatmap of the image. The areas that are in dark-blue are considered highly by the model.</p>
        </DialogTitle>
      </Dialog>
    );
  }
  
  export default Review;