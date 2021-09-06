import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { AppContext } from "../../../Context/State";

import Snackbar from "@material-ui/core/Snackbar";
// import IconButton from '@material-ui/core/IconButton';
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    width: "300%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));
export default function UserCard({ key, data }) {
  const { GlobalState, setGlobalState } = useContext(AppContext);
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  // const handleClick = (message) => () => {
  //   setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  // };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleConnect = (e, userId) => {
    console.log(GlobalState.id);
    console.log(userId);

    axios({
      url: `${BASE_URL}connect/${GlobalState.id}/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response, "connection sent response is here");
        let message = response.data.msg;
        setSnackPack((prev) => [
          ...prev,
          { message, key: new Date().getTime() },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card style={{ width: "100%" }}>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        onExited={handleExited}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            {/* <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button> */}
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />

      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.name}
        subheader={data.age + " years , " + data.location}
      />

      <CardContent>
        <ContentDiv>
          <h5>Book list :</h5>
          {data?.book_list.map((key) => (
            <p>{key}</p>
          ))}
        </ContentDiv>
        <Divider variant="middle" />

        <ContentDiv>
          <h5>Interest</h5>
          {data?.interest.map((key) => (
            <p>{key}</p>
          ))}
        </ContentDiv>
        <Divider variant="middle" />

        <ContentDiv>
          <h5>Book offering:</h5>
          <p>{data.book_offering}</p>
        </ContentDiv>
        <Divider variant="middle" />

        <ContentDiv>
          <h5>Quote: </h5>
          <p>{data.fav_quote}</p>
          <Divider variant="middle" />
        </ContentDiv>

        <ContentDiv>
          <h5>Social URL </h5>
          <p>{data.social_url}</p>
          <Divider variant="middle" />
        </ContentDiv>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

        <ConnectButton onClick={(e) => handleConnect(e, data.userId)}>
          Connect
        </ConnectButton>
      </CardActions>
    </Card>
  );
}

const ConnectButton = styled(Button)`
  &&& {
    background-color: #78aaec;

    :hover {
      background-color: whitesmoke;
    }
  }
`;

const ContentDiv = styled.div`
  width: 50vh;
  display: flex;
  justify-content: space-around;
`;
