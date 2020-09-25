import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";

import {
    TextField,
    Paper,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Modal,
    Button,
} from "@material-ui/core";
import { Assignment as AssignmentIcon } from "@material-ui/icons";
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

const Movie = (props) => {
    const { classes } = props;
    const [expanded] = React.useState(false);
    const [movie, setMovie] = useState([]);
    const [movie2, setMovie2] = useState([]);
    const [openReview, setOpenReview] = useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [headerModalReview, setHeaderModalReview] = useState("");
    const [bodyModalReview, setBodyModalReview] = useState("");

    const handleCloseReview = () => {
        setOpenReview(false);
    };

    useEffect(() => {
        Axios.get("https://backendexample.sanbersy.com/api/data-movie", {
            headers: { "Content-Type": "application/json" },
        }).then((res) => {
            setMovie(res.data);
            setMovie2(res.data);
        });
    }, []);
    const handleClickReview = (id) => {
        Axios.get(`https://backendexample.sanbersy.com/api/data-movie/${id}`, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => {
            setHeaderModalReview("Review : " + res.data.title);
            setBodyModalReview(res.data.review);
            setOpenReview(true);
        });
    };
    const handleSearch = async (e) => {

        const searchTerm = e.target.value.toLowerCase();
        try {
            let tmpMovie = [];
            movie.forEach(el => {
                if (el.title.toLowerCase().includes(searchTerm))
                    tmpMovie.push(el);
            });
            setMovie2(tmpMovie);
            console.log("Results for " + searchTerm);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickSearch = (event) => {
        const innerHTML = event.target.innerHTML;
        const filterData = movie.filter((el) => {
            return el.genre.toLowerCase().includes(innerHTML.toLowerCase());
        });
        setMovie(filterData);
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
                        {movie2 !== [] &&
                            movie2
                                .map((el) => {
                                    return (
                                        <Button
                                            key={1 + el.id}
                                            variant="outlined"
                                            className={classes.button}
                                            onClick={handleClickSearch}
                                        >
                                            {el.genre}
                                        </Button>
                                    );
                                })
                                .slice(0, 8)}
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {movie2.map((el, index) => {
                    return (
                        <Grid item xs={10} sm={6} md={3} key={2 + el.id}>
                            <Paper className={classes.paper}>
                                <Card className={classes.root}>
                                    <CardHeader
                                        titleTypographyProps={{
                                            variant: "h6",
                                        }}
                                        title={el.title}
                                        subheader={`${el.rating} ★ (${el.year})`}
                                    />
                                    {/* <StarIcon /> */}
                                    <CardMedia
                                        className={classes.media}
                                        image={el.image_url}
                                        title={el.title} />
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Duration : {el.duration}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Genre : {el.genre}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            Description : {el.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            className={clsx(classes.expand, {
                                                [classes.expandOpen]: expanded,
                                            })}
                                            onClick={() => {
                                                handleClickReview(el.id);
                                            }}
                                        >
                                            <AssignmentIcon />
                                            <Typography>Review</Typography>
                                        </IconButton>
                                    </CardActions>
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

Movie.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Movie);
