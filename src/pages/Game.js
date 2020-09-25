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
    const [game2, setGame2] = useState([]);
    const [openReview, setOpenReview] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [headerModalReview] = useState("");
    const [bodyModalReview] = useState("");

    const handleCloseReview = () => {
        setOpenReview(false);
    };

    useEffect(() => {
        Axios.get(
            "https://backendexample.sanbersy.com/api/data-game",
            {
                baseURL: "",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((res) => {
            setGame2(res.data);
            setGame(res.data);
        });
    }, []);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        try {
            let tmpGame = [];
            game.forEach(el => {
                if (el.name.toLowerCase().includes(searchTerm))
                    tmpGame.push(el);
            });
            setGame2(tmpGame);
            console.log("Results for " + searchTerm);

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
                        {game2 !== [] &&
                            game2
                                .map((el) => {
                                    return (
                                        <Button
                                            key={1 + el.id}
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
                {game2.map((el, index) => {
                    return (
                        <Grid item xs={10} sm={6} md={3} key={2 + el.id}>
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
                                        image={el.image_url}
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
                                            Multi Player : {el.multiplayer === 1 ? "Yes" : "No"}
                                            <br />
                                            Single Player : {el.singlePlayer === 1 ? "Yes" : "No"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};

Game.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Game);
