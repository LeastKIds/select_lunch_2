import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const RestaurantBoxComponent = ({restaurants}) => {

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
            restaurants.map( (data, index) => 
                    <div style={styles.boxStyle2} key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image="/static/images/cards/contemplative-reptile.jpg"
                                title="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                {data["name"]}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    open: {data["opening_hours"]?.open_now == null ? "Undetermined" : data["opening_hours"].open_now}<br/>
                                    price_level: {data["price_level"] ? data["price_level"] : "nothing" }<br/>
                                    vicinity: {data["vicinity"]}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Share</Button>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    </div>
                )
           }
        </div>
    )
}

export default RestaurantBoxComponent;