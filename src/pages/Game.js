import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import {
    TextField,
    Paper,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    Modal,
    Button,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Axios from "axios";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = (theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: "none",
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),

        // padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    paperModal: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    media: {
        height: 0,
        paddingTop: "100%", // 16:9
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
});

const Game = (props) => {
    const { classes } = props;
    const [game, setGame] = useState([]);
    const [openReview, setOpenReview] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [headerModalReview] = useState("");
    const [bodyModalReview] = useState("");

    const handleCloseReview = () => {
        setOpenReview(false);
    };

    useEffect(() => {
        Axios.get(
            // "https://fajrika-a39f.restdb.io/rest/games",
            "https://backendexample.sanbersy.com/api/data-game",
            {
                baseURL: "",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": "5f39419568a7ed76e035d33d",
                    // "cache-control": "no-cache",
                    // "Access-Control-Allow-Origin": "*",
                    // "Access-Control-Request-Headers": "*",
                },
            }
        ).then((res) => {
            setGame(res.data);
        });
    }, []);

    //const handleSearch = (event) => {
    //const value = event.target.value;
    //setInput(value);
    //const filterData = game.filter((el) => {
    //return el.name.toLowerCase().includes(value.toLowerCase());
    //});
    //setGame(filterData);
    //};
    let cancelToken;
    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        // setInput(searchTerm);
        //Check if there are any previous pending requests
        if (typeof cancelToken != typeof undefined) {
            cancelToken.cancel("Operation canceled due to new request.");
        }
        //Save the cancel token for the current request
        cancelToken = Axios.CancelToken.source();
        try {
            let url = "";
            if (searchTerm === "") {
                url = `https://fajrika-a39f.restdb.io/rest/games`;
            } else {
                url = `https://fajrika-a39f.restdb.io/rest/games?q={"name":{"$regex":"${searchTerm}"}}`;
            }
            const results = await Axios.get(
                url,
                {
                    cancelToken: cancelToken.token,
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": "5f39419568a7ed76e035d33d",
                    },
                } //Pass the cancel token to the current request
            ).then((res) => {
                setGame(res.data);
            });
            console.log("Results for " + searchTerm + ": ", results.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickSearch = (event) => {
        const innerHTML = event.target.innerHTML;
        const filterData = game.filter((el) => {
            return el.genre.toLowerCase().includes(innerHTML.toLowerCase());
        });
        setGame(filterData);
    };

    return (
        <div className={classes.root}>
            <Modal
                open={openReview}
                onClose={handleCloseReview}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paperModal}>
                    <h2 id="simple-modal-title">{headerModalReview}</h2>
                    <p id="simple-modal-description">{bodyModalReview}</p>
                </div>
            </Modal>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            onChange={handleSearch}
                        />
                    </Paper>
                    <div>
                        {game !== [] &&
                            game
                                .map((el) => {
                                    return (
                                        <Button
                                            key={el.id}
                                            variant="outlined"
                                            size="large"
                                            className={classes.button}
                                            onClick={handleClickSearch}
                                        >
                                            {el.genre}
                                        </Button>
                                    );
                                })
                                .slice(0, 5)}
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {game.map((el, index) => {
                    return (
                        <Grid item xs={10} sm={6} md={3} key={el._id}>
                            <Paper className={classes.paper}>
                                <Card className={classes.root}>
                                    <CardHeader
                                        titleTypographyProps={{
                                            variant: "h6",
                                        }}
                                        title={el.name}
                                        subheader={`${el.release}`}
                                    />

                                    {/* <StarIcon /> */}
                                    <CardMedia
                                        className={classes.media}
                                        image={el.img}
                                        title={el.name}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            Platform : {el.platform}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            Genre : {el.genre}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            component="p"
                                        >
                                            Multi Player :{" "}
                                            {el.multiPlayer ? "Yes" : "No"}{" "}
                                            <br></br>
                                            Single Player :{" "}
                                            {el.singlePlayer ? "Yes" : "No"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* <Button
                variant="contained"
                color="primary"
                aria-label="add"
                className={classes.button}
            >
                <AddIcon />
            </Button>
            <Button
                variant="contained"
                color="secondary"
                aria-label="edit"
                className={classes.button}
            >
                <AddIcon />
            </Button>
            <Button
                variant="contained"
                disabled
                aria-label="delete"
                className={classes.button}
            >
                <DeleteIcon />
            </Button> */}
        </div>
    );
};

Game.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Game);
