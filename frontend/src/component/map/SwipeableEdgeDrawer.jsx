import { Drawer } from '@mui/material';
import './SwipeableEdgeDrawer.css';

const SwipeableEdgeDrawer = ({props}) => {
    return <div style={{position: "absolute", height: "70%", top: "50%",
    
    transform: "translateY(-50%)",
    backgroundColor: "#FAFAFA", width: "70px",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    display: "flex",
    alignContent: "center",
    animation: "slideInFromLeft 3s ease-out"
     }}>
        {/* <h4 style={{margin: 0, marginLeft: "auto", alignSelf: "center", writingMode: "vertical-lr",}}>{props.restaurants.results.length === 20 ? props.restaurants.results.length + "++" : props.restaurants.results.length } Results</h4>
        <div style={{width: "5px", height: "50px",
         backgroundColor: "#848484", alignSelf: "center",
        transform: "translateY(-25px)",
         
        marginLeft: "10px", marginRight: "7px",
        borderRadius: "10px"
        }}></div> */}
        <Drawer anchor={"left"}>
            
        </Drawer>
    </div>
}

export default SwipeableEdgeDrawer;