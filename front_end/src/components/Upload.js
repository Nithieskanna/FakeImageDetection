
import * as React from 'react'
import { useState } from 'react'
import * as axios from "axios";
import { useNavigate } from "react-router-dom";
import './upload.css'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


function Upload() {

    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState("No selected file")
    const [targetImage, setTargetImage] = useState(null)


    const navigate = useNavigate();

    const navigateToReview = () => {
        navigate('/review');
    };

    const onAnalyzeClick = async (event) => {
        event.preventDefault();
        console.log(targetImage)

        const formData = new FormData();
        formData.append("image", targetImage);
        try {
            const { data } = await axios.default.post('http://127.0.0.1:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(data);
            if (data) {
                localStorage.setItem("predicted_class", JSON.stringify(data.predicted_class));
                localStorage.setItem("prediction", JSON.stringify(data.prediction));
                localStorage.setItem("filename", JSON.stringify(fileName));
                navigateToReview()
            }

        } catch (error) {
            console.log(error);
        }

    };


    return (
        <Card sx={{ maxWidth: 700, maxHight: 200 }}>
            <CardContent>
                <Typography variant="h2" component="div" align='center' fontFamily={"Apple Color Emoji"}>
                    Fake Image Detector
                </Typography>

                <Card style={{ backgroundColor: '#80cbc4' }}>
                    <CardContent>
                        <form onClick={() => document.querySelector(".input-field").click()}>
                            <input type="file" accept='image/*' className='input-field' hidden
                                onChange={({ target: { files } }) => {
                                    files[0] && setFileName(files[0].name)
                                    if (files) {
                                        console.log(files)
                                        setTargetImage(files[0])
                                        setImage(URL.createObjectURL(files[0]))
                                    }
                                }}
                            />

                            {image ?
                                <img src={image} style={{ height: '250px', width: '250px' }} alt={fileName} />
                                :
                                <>
                                    <MdCloudUpload color='#1475cf' size={60} />
                                    <p>Browse Files to upload</p>
                                </>

                            }
                        </form>

                        <section className='uploaded-row'>
                            <AiFillFileImage color='#1475cf' />
                            <span className='upload-content'>
                                {fileName}
                                <MdDelete
                                    onClick={() => {
                                        setFileName("No file selected")
                                        setImage(null)
                                    }}
                                />
                            </span>
                        </section>

                        <Button style={{ paddingLeft: '250px', paddingRight: '250px' }} variant="contained" color="success" size="large" onClick={onAnalyzeClick}>Analyze</Button>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

    )
}

export default Upload