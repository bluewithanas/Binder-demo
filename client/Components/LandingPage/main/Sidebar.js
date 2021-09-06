import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, Button, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MatchButton from "./MatchButton";
import { BASE_URL } from "../../../config";
import { AppContext } from "../../../Context/State";
import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";
import axios from "axios";
import FriendsButton from "./FriendsButton";
import router from "next/router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export default function Sidebar() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const { GlobalState, setGlobalState } = useContext(AppContext);
  const [MatchData, setMatchData] = useState([]);
  const [FriendsData, setFriendsData] = useState([]);
  const [listening, setListening] = useState(false);
  const [Token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!listening) {
      //       };

      setInterval(async () => {
        await axios({
          method: "get",
          url: `${BASE_URL}request/${GlobalState.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            setMatchData(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);

      setInterval(async () => {
        await axios({
          method: "get",
          url: `${BASE_URL}friends/${GlobalState.id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            setFriendsData(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);

      setListening(true);
    }
  }, [listening, MatchData]);

  const handleLogout = async(e) => {


await axios({
  url:`${BASE_URL}logout/${GlobalState.id}`,
  method: 'GET',
  headers:{
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})
.then(response=>{
  console.log(response);
  if(response.data.result===1){
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem('id');
    localStorage.removeItem('email')

setGlobalState((prevState) => ({
  ...prevState,
  name: null,
  email: null,
  id: null,
}));

router.push("/");
  }

})
.catch(err=>{
  console.log(err);
})





    
  };

  return (
    <Container>
      <Header>
        <UserAvatar onClick={(e) => handleLogout(e)} />

        <IconsContainer>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Matches" {...a11yProps(0)} />
            <Tab label="Friends" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            {  MatchData.length===0 ? <p>No invites :( </p> :    MatchData.map((key) => (
              <MatchButton key={key.p_id} pid={key.p_id} name={key.name} />
            ))}
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            { FriendsData.length===0 ?  <p>Don't be an introvert, Add some friends!</p> :  FriendsData.map((key) => (
              <FriendsButton key={key.p_id} pid={key.p_id} name={key.name} />
            ))}
          </TabPanel>
        </SwipeableViews>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 60vh;
  z-index: 1;

  border-right: 2px solid gray;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background: linear-gradient(to right, #d4d3e6, #64a1ed);
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 2px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
