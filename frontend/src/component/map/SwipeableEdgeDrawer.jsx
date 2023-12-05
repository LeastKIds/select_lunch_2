import './SwipeableEdgeDrawer.css';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import tomatoImg from '../../img/tomato.png';
import decayTomatoImg from '../../img/decay_tomato.png';
import greenTomato from '../../img/green_tomato.png';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';


const CustomWidthTooltip = (props) => (
    <Tooltip {...props} />
)

const reviewEvaluationExplain = (
    <React.Fragment>
        <div style={{display: "flex"}}>
            <div>
                <img src={decayTomatoImg} alt="bad tomato" style={{width: "100px", height: "100px"}} />
                <p style={{textAlign: "center"}}>bad</p>
            </div>
            <div>
                <img src={greenTomato} alt="bad tomato" style={{width: "100px"}} />
                <p style={{textAlign: "center"}}>normal</p>
            </div>
            <div>
                <img src={tomatoImg} alt="bad tomato" style={{width: "100px"}} />
                <p style={{textAlign: "center"}}>good!</p>
            </div>
        </div>
        
    </React.Fragment>
)


const SwipeableEdgeDrawer = ({props}) => {
    
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerWidth, setDrawerWidth] = useState(0);
    const [restaurant, setRestaurant] = useState(null);
    const [openTime, setOpenTime] = useState(false);
    const [openReview, setOpenReview] = useState(false);
    const [isCopy, setIsCopy] = useState(false);
    const [copySantance, setCoptySantance] = useState('');



    useEffect(() => {
        if(props.restaurants && props.restaurants.results.length !== 0) {
            
            setDrawerWidth(70);
        }
        else {
            
            setDrawerWidth(0);
        }
            
    }, [props.restaurants]);

    const handler = {
        openDrawerHandler: () => {
            if(openDrawer) {
                setOpenDrawer(false);
                setDrawerWidth(70);
            } else {
                setOpenDrawer(true);
                setDrawerWidth(500)
            }
        },
        searchPlaceIdHandler: async (result) => {
            const response = await props.client.post(props.url + "/search/place", {
                place_id: result.place_id,
                keyword: props.keyword,
                startLat: props.position.lat,
                startLng: props.position.lng,
                endLat: result.geometry.location.lat,
                endLng: result.geometry.location.lng
            });
        
            setRestaurant(response.data.result);
            props.setPathHandler(response.data.result.graphHopperResponse)
            console.log(response.data.result)
        },
        openTimeHandler: () => {
            setOpenTime(!openTime);
        },
        copyHandler: async (text) => {
            try {
                await navigator.clipboard.writeText(text);
                setCoptySantance(text);
                setIsCopy(true);
            } catch(error) {
                console.error(error);
            }
        },
        reviewTranslationHandler: async (text, review) => {
            if(review.translationJp === undefined) {
                const response = await props.client.post(props.url + '/search/reviews/translation', {text: text});
                setRestaurant(prevObject => ({
                    ...prevObject,
                    reviews: prevObject.reviews.map(item => item.text === review.text ? {...item, translationJp: response.data.translationText} : item)
                }));
            } else {
                handler.copyHandler(review.translationJp);
            }
            
        },
        resetRestaurantHandler: () => {
            setRestaurant(null);
            props.setPathHandler(null);
        }
    }

    if(props.restaurants && props.restaurants.results.length !== 0)
        return <div style={{position: "absolute", height: "70%",
        top: "15%",
    backgroundColor: "#FAFAFA", width: `${drawerWidth}px`,
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    display: "flex",
    alignContent: "center",
    transition: "width 0.5s ease-in",
    overflow: "hidden"
    }}>
        <div style={{marginLeft: "auto", maxHeight: "100%", overflowY: "auto", scrollbarWidth: "none", /* Firefox를 위한 스타일 */
    msOverflowStyle: "none", /* IE 10+를 위한 스타일 */
    "::-webkit-scrollbar": { /* Chrome, Safari, Opera를 위한 스타일 */
        display: "none",
    
    }, marginRight: "30px", marginTop: "20px", marginBottom: "20px"}} className="no-scrollbar">
            {
                (openDrawer && restaurant === null) && props.restaurants.results.map( (result, index) => (
                    <Card sx={{ width: "400px", margin: "20px auto", cursor: "pointer"}} onClick={() => handler.searchPlaceIdHandler(result)} key={index}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {props.keyword}
                            </Typography>
                            <Typography variant="h5" component="div">
                            {result.name}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            open: {result.opening_hours?.open_now !== null ? result.opening_hours?.open_now.toString() : "ignorance"}
                            </Typography>
                            <Typography variant="body2">
                            {result.vicinity}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            }
            {
                restaurant !== null &&
                <Card sx={{ width: "400px", margin: "20px auto"}}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            
                            </Typography>
                            <Typography variant="h5" component="div">
                            <List>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.name)}>
                                    <ListItemText primary={`name: ${restaurant.name}`}  />
                                </ListItemButton>
                            </List>
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <List>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.formatted_address)}>
                                    <ListItemText primary={`address: ${restaurant.formatted_address}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.current_opening_hours?.open_now !== null ? restaurant.current_opening_hours?.open_now.toString() : "ignorance")}>
                                    <ListItemText primary={`open: ${restaurant.current_opening_hours?.open_now !== null ? restaurant.current_opening_hours?.open_now.toString() : "ignorance"}`} />
                                </ListItemButton>
                                {restaurant.current_opening_hours?.weekday_text &&
                                    <>
                                        <ListItemButton onClick={handler.openTimeHandler}>
                                            <ListItemText primary="open time" />
                                            {openTime ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openTime} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {
                                                    restaurant.current_opening_hours.weekday_text.map( (data, index) =>
                                                                <ListItemButton sx={{ pl: 4 }} key={index} onClick={() => handler.copyHandler(data)}>
                                                                    <ListItemText primary={data} />
                                                                </ListItemButton>
                                                    )
                                                } 
                                            </List>
                                        </Collapse>
                                        
                                    </>
                                }
                               
                                
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.formatted_phone_number)}>
                                    <ListItemText primary={`phone number: ${restaurant.formatted_phone_number}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.delivery ? restaurant.delivery.toString() : 'ignorance')}>
                                    <ListItemText primary={`delivery: ${restaurant.delivery ? restaurant.delivery.toString() : 'ignorance'}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.takeout ? restaurant.takeout.toString() : 'ignorance')}>
                                    <ListItemText primary={`takeout: ${restaurant.delivery ? restaurant.delivery.toString() : 'ignorance'}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.price_level)}>
                                    <ListItemText primary={`price_level: ${restaurant.price_level}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.url)}>
                                    <ListItemText primary={`map: ${restaurant.url}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.website)}>
                                    <ListItemText primary={`website: ${restaurant.website}`} />
                                </ListItemButton>
                                <ListItemButton onClick={() => handler.copyHandler(restaurant.types ? restaurant.types.join(', ') : 'ignorance')}>
                                    <ListItemText primary={`keyward: ${restaurant.types ? restaurant.types.join(', ') : 'ignorance'}`} />
                                </ListItemButton>
                                {
                                    restaurant.reviews && 
                                    <>
                                        <ListItemButton onClick={() => setOpenReview(!openReview)} >
                                            <ListItemText primary="reviews" />
                                            {openReview ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openReview} timeout="auto" unmountOnExit>
                                                <div style={{marginLeft: "auto", marginRight: "auto", textAlign: "center"}}>
                                                    <CustomWidthTooltip title={reviewEvaluationExplain} placement="top">
                                                        <img src={
                                                            restaurant.reviewEvaluation === "POSITIVE" ? tomatoImg :
                                                            restaurant.reviewEvaluation === "NEGATIVE" ? decayTomatoImg : greenTomato 
                                                        } style={{width: "100px"}}/>
                                                    </CustomWidthTooltip>
                                                </div>
                                                {
                                                    restaurant.reviews.map( (review, index) => 
                                                    <List component="div" disablePadding key={index} sx={{
                                                        border: 1, // 1px 테두리
                                                        borderColor: 'grey.500', // 테두리 색상 설정
                                                        borderStyle: 'dotted', // 점선 스타일
                                                        borderRadius: 1, // 테두리 둥글게 설정 (선택적)
                                                        padding: 1, // 내부 여백 (선택적)
                                                        margin: 1, // 외부 여백 (선택적)
                                                    }}>
                                                        <ListItemButton onClick={() => handler.copyHandler(review.author_name)}>
                                                            <ListItemText primary={`name: ${review.author_name}`} />
                                                        </ListItemButton>
                                                        <ListItemButton onClick={() => handler.copyHandler(review.text)}>
                                                            <ListItemText primary={`review: ${review.text}`} />
                                                        </ListItemButton>
                                                        <ListItemButton onClick={() => handler.reviewTranslationHandler(review.text, review)}>
                                                            <ListItemText primary={`日本語で機械翻訳: ${review.translationJp === undefined ? '' : review.translationJp}`} />
                                                        </ListItemButton>
                                                    </List>
                                                    )
                                                }
                                            
                                        </Collapse>
                                    </>
                                }
                            </List>
                            </Typography>
                            <Typography variant="body2">
                                <Button size="small" onClick={handler.resetRestaurantHandler}>back</Button>
                            </Typography>
                        </CardContent>
                </Card>
            }
        </div>
        <div style={{display: "flex", alignSelf: "center", cursor: "pointer"}} onClick={handler.openDrawerHandler}>
            <h4 style={{margin: 0, marginLeft: "auto", alignSelf: "center", writingMode: "vertical-lr",transform: "translateY(-20px)"}}>{props.restaurants.results.length === 20 ? props.restaurants.results.length + "++" : props.restaurants.results.length } Results</h4>
            <div style={{width: "5px", height: "50px",
            backgroundColor: "#848484", alignSelf: "center",
            transform: "translateY(-25px)",
            
            marginLeft: "10px", marginRight: "7px",
            borderRadius: "10px"
            }}></div>
        </div>
        
        {/* <Box sx={{ width: 500 }}> */}
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal : "center" }}
            open={isCopy}
            onClose={() => setIsCopy(false)}
            message={`"${copySantance}" copied successfully`}
            key={"top" + "center"}
            />
        {/* </Box> */}
       
        
        
    </div>
    else
        return <></>
        
    


}

export default SwipeableEdgeDrawer;