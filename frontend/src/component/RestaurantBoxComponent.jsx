import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from "react";

import tomatoImg from '../img/tomato.png';
import decayTomatoImg from '../img/decay_tomato.png'
import greenTomato from '../img/green_tomato.png'


const RestaurantBoxComponent = ({modalData, client, url, handleRestaurantBoxSetModalData}) => {

    const [reviewOpen, setReviewOpen] = useState();

    const styles = {
        boxStyle: {
            width: "345px",
            
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
           

            
        },

        boxStyle2: {
            border: "1px solid black",
            marginTop: "30px",
            marginBottom: "30px",
        }
    }

    return(
        <div style={styles.boxStyle}>
           {
            modalData &&
            <div style={styles.boxStyle2}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image="/static/images/cards/contemplative-reptile.jpg"
                                title="green iguana"
                            />
                            <CardContent>
                               
                                <h1>name: {modalData.name}</h1>
                                <p>current open: {modalData.current_opening_hours?.open_now !== null ? modalData.current_opening_hours?.open_now.toString() : "ignorance"}</p>
                                {
                                modalData.current_opening_hours?.weekday_text &&
                                <>
                                    {
                                    modalData.current_opening_hours.weekday_text.map( (date, index) => 
                                        <p key={index}>{date}</p>
                                    )
                                    }
                                </>
                                }
                                <p>address: {modalData.formatted_address}</p>
                                <p>telephone: {modalData.formatted_phone_number}</p>
                                <p>delivery: {modalData.delivery ? modalData.delivery.toString() : 'ignorance'}</p>
                                <p>takeout: {modalData.takeout ? modalData.takeout.toString() : 'ignorance'}</p>
                                <p>price_level: {modalData.price_level}</p>
                                <p>map: {modalData.url}</p>
                                <p>website: {modalData.website}</p>

                                <p>keyward: {modalData.types ? modalData.types.join(', ') : 'ignorance'}</p>
                                <button onClick={() => setReviewOpen(true)}>review open</button>
                                {
                                reviewOpen && 
                                <div>
                                    <img src={
                                    modalData.reviewEvaluation === "POSITIVE" ? tomatoImg :
                                    modalData.reviewEvaluation === "NEGATIVE" ? decayTomatoImg : greenTomato 
                                    } style={{width: "100px"}}/>

                                    {
                                    modalData.reviews.map( (review, index) => 
                                    <div key={index}>
                                        <h3>{review.author_name}</h3>
                                        <p>{review.text}</p>
                                        <button
                                        onClick={async () => {
                                            const response = await client.post(url + '/search/reviews/translation', {text: review.text})
                                            console.log(response.data.translationText);
                                            handleRestaurantBoxSetModalData(response, review);
                                          
                                        }}
                                        >日本語で機械翻訳</button>
                                        {
                                        review.translationJp &&
                                        <p>{review.translationJp}</p>
                                        }


                                        <p>{review.relative_time_description}</p>
                                        <p>url: {review.author_url}</p>
                                        
                                    </div>
                                    )
                                    }
                                    <button onClick={() => setReviewOpen(false)}>review close</button>
                                </div>
                                }
                                
                            </CardContent>
                            <CardActions>
                                <Button size="small"
                                >More</Button>
                            </CardActions>
                        </Card>
                    </div>
           }
                    
              
        </div>
    )
}

export default RestaurantBoxComponent;