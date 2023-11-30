import { Paper } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import { useState } from "react";

const SearchCard = () => {

    const [paperOpacity, setPaperOpacity] = useState(100);

    const styles = {
        paperStyle: {
            width: "300px",
            // height: "300px",
            position: "absolute",
            zIndex: "999",
            right: "20px",
            top: "20px",
            padding: "10px",
            opacity: paperOpacity * 0.01
        },

    }

    const handle = {
        paperSliderOpacityHandler: (event, newvalue) => {
            setPaperOpacity(newvalue)
        }
    }

    return <Paper elevation={6} style={styles.paperStyle}>
            <h1 style={{margin: 0, textAlign: "center"}}>Lunch!</h1>
            <div>
                <TextField label="Keyword" style={{width: "205px"}} />
                <Button variant="contained" size="medium" style={{height: "55px", marginLeft: "5px"}}>
                    Search
                </Button>
            </div>
            <div style={{marginTop: "10px"}}>
                <Button variant="contained" color="success" style={{borderRadius: "50px", width: "50px", height: "30px"}}>test</Button>
            </div>
            <div style={{display: "flex", alignContent: "center", padding: "10px"}}>
                <p style={{margin: 0, paddingRight: "10px"}}>opacity</p>
                <Slider defaultValue={paperOpacity} aria-label="Default" valueLabelDisplay="auto" style={{width: "200px"}} onChange={handle.paperSliderOpacityHandler}/>
            </div>
        </Paper>
    
}

export default SearchCard;