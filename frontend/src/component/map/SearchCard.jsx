import { Paper } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import { useEffect, useState } from "react";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

const SearchCard = ({props}) => {

    const [paperOpacity, setPaperOpacity] = useState(100);
    const [keywordsButton, setKeywordsButton] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isOption, setIsOption] = useState(false);

    const [isLat, setIsLat] = useState(35.6667076);
    const [isLatError, setIsLatError] = useState(false);
    const [isLng, setIsLng] = useState(139.7143023);
    const [isLngError, setIsLngError] = useState(false);
    const [isPosition, setIsPosition] = useState(false);

    const styles = {
        paperStyle: {
            width: "300px",
            
            position: "absolute",
            zIndex: "999",
            right: "20px",
            top: "20px",
            padding: "10px",
            opacity: paperOpacity * 0.01 + 0.4
        },

    }

    const handle = {
        paperSliderOpacityHandler: (event, newvalue) => {
            setPaperOpacity(newvalue)
        },
        keywordsSearchTextFieldHandler: (event) => {
            setKeyword(event.target.value);
        },
        keywordsSearchButtonHandler: () => {
            (async () => {
                const response = await props.client.post(props.url + '/search/' + keyword, {
                    lat: props.position.lat,
                    lng: props.position.lng,
                    next_page_token: null
                });
                console.log(response.data);
                props.handleSetRestaurants(response.data);
                props.setRestaurantHandler(null);
            })();
        },
        keywordsButtonHandler: (k) => {
            (async () => {
                try {
                    const response = await props.client.get(props.url + '/search/best/' + k);
                    props.handleSetRestaurants(null);
                    props.handleSetBestRestaurant(response.data);
                    console.log(response.data);
                } catch(error) {
                    console.log(error);
                }
            })();
        },

        nextPageButtonhandler: () => {
            (async () => {
                try{
                    const response = await props.client.post(props.url + '/search/' + keyword, {
                        lat: 0.0,
                        lng: 0.0,
                        next_page_token: props.restaurants.next_page_token
                    })
                    props.handleSetRestaurants(response.data);
                } catch(error) {
                    console.error(error);
                }
            })();
        },

        latInputErrorHandler: (event) => {
            const { value } = event.target;
            setIsLat(value);  
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setIsLatError(false);
                setIsLat(value);    
            } else {
                setIsLatError(true);
            }
        },
        lngInputErrorHandler: (event) => {
            const { value } = event.target;
            setIsLng(value);
            if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setIsLngError(false);
                    
            } else {
                setIsLngError(true);
            }
        },
        setIsPositionHandler: () => {
            props.handleSetPosition({lat: isLat, lng: isLng});
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await props.client.get(props.url + '/search/keywords');
                setKeywordsButton(response.data.keywords);
            } catch(error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        if(!isLatError && !isLatError)
            setIsPosition(false);
        else
            setIsPosition(true);
    }, [isLatError, isLngError])

    return <Paper elevation={6} style={styles.paperStyle}>
            <h1 style={{margin: 0, textAlign: "center"}}>Lunch!</h1>
            <div>
                <TextField label="Keyword" style={{width: "205px"}} value={keyword} onChange={handle.keywordsSearchTextFieldHandler}/>
                <Button variant="contained" 
                    size="medium" 
                    onClick={handle.keywordsSearchButtonHandler}
                    style={{height: "55px", marginLeft: "5px"}}>
                    Search
                </Button>
            </div>
            {
                (props.restaurants && props.restaurants.next_page_token) ?
                <div style={{paddingTop: "5px"}} onClick={handle.nextPageButtonhandler}>
                    <Button variant="outlined">
                        Next Page
                    </Button>
                </div> : 
                <div style={{paddingTop: "5px"}}>
                    <Button variant="outlined" disabled>
                        Next Page
                    </Button>
                </div>
            }
            <div style={{marginTop: "10px", display: "flex"}}>
                {
                    (keywordsButton && keywordsButton.length !==0) &&
                    <>
                        {
                            keywordsButton.map( (keywordButton, index) => (
                                <Button variant="contained" 
                                    key={index}
                                    color="success" 
                                    onClick={() => handle.keywordsButtonHandler(keywordButton)}
                                    style={{borderRadius: "50px", height: "30px", marginRight: "5px"}}>
                                    {keywordButton}
                                </Button>
                            ))
                        }
                    </>
                }
            </div>
            <SettingsSuggestIcon color="primary" style={{marginTop: "10px", cursor: "pointer"}} onClick={() => setIsOption(!isOption)}>add_circle</SettingsSuggestIcon>
            <div style={{alignContent: "center", maxHeight: isOption ? "300px" : "0px", overflow: 'hidden', transition: 'max-height 0.5s ease-in-out', marginTop: "10px"}}>
                <div style={{display: "flex", }}>
                    <p style={{margin: 0, paddingRight: "10px"}}>opacity</p>
                    <Slider defaultValue={paperOpacity} aria-label="Default" valueLabelDisplay="auto" style={{width: "200px"}} onChange={handle.paperSliderOpacityHandler}/>
                </div>
                
                <div>
                    
                    <div style={{display: "flex", alignItems: "center"}}>
                        <TextField id="standard-basic" label="lat" variant="standard" style={{width: "100px", margin: "5px"}} error={isLatError} value={isLat} onChange={handle.latInputErrorHandler}/>
                        <TextField id="standard-basic" label="lng" variant="standard" style={{width: "100px", margin: "5px"}} error={isLngError} value={isLng} onChange={handle.lngInputErrorHandler}/>
                        <Button variant="outlined" color="error" style={{height: "25px"}} disabled={isPosition} onClick={handle.setIsPositionHandler}>
                            이동
                        </Button>
                    </div>
                    
                </div>
            </div>
            <div style={{paddingBottom: "10px"}}></div>
        </Paper>
    
}

export default SearchCard;