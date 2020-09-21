import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import { Button, Grid, TextField, Snackbar } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Axios from "axios";
import MuiAlert from "@material-ui/lab/Alert/";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: "title",
        numeric: false,
        disablePadding: true,
        label: "Title",
    },
    { id: "rating", numeric: true, disablePadding: false, label: "Rating" },
    { id: "year", numeric: true, disablePadding: false, label: "Year" },
    { id: "genre", numeric: true, disablePadding: false, label: "Genre" },
    {
        id: "duration",
        numeric: true,
        disablePadding: false,
        label: "Duration",
    },
    { id: "img", numeric: true, disablePadding: false, label: "Img" },
    { id: "review", numeric: true, disablePadding: false, label: "Review" },
    {
        id: "description",
        numeric: true,
        disablePadding: false,
        label: "Description",
    },
    {
        id: "Edit",
        numeric: true,
        disablePadding: false,
        label: "Edit",
    },
];

function EnhancedTableHead(props) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "select all desserts" }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === "light"
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85),
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark,
              },
    title: {
        flex: "1 1 100%",
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    if (props.tipe === "table") {
        return (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                {numSelected > 0 ? (
                    <Typography
                        className={classes.title}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        className={classes.title}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        List
                    </Typography>
                )}

                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton
                            aria-label="delete"
                            onClick={props.handleDelete}
                        >
                            <DeleteIcon onClick={props.handleDelete} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            {/* <FilterListIcon /> */}
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        );
    } else if (props.tipe === "form") {
        return (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                {numSelected > 0 ? (
                    <Typography
                        className={classes.title}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} Form - Update
                    </Typography>
                ) : (
                    <Typography
                        className={classes.title}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                        
                    >
                        Form - Add
                    </Typography>
                )}

                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton></IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        );
    }
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        width: "100%",
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),

        // padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    table: {
        minWidth: 750,
    },
    form: {
        margin: theme.spacing(1),
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
    btn_save: {
        textAlign: "center",
        marginBottom: theme.spacing(2),
    },
}));

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense /*, setDense*/] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);
    const [rows, setRows] = React.useState([]);
    const [input, setInput] = React.useState({
        title: "",
        rating: "",
        year: "",
        genre: "",
        img: "",
        duration: "",
        review: "",
        description: "",
    });
    const [open, setOpen] = React.useState(false);

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };
    useEffect(() => {
        console.log("input : ");
        console.log(input);
    }, [input]);
    const loadList = () => {
        Axios.get("https://fajrika-a39f.restdb.io/rest/Movies", {
            baseURL: "",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "5f39419568a7ed76e035d33d",
            },
        }).then((res) => {
            setRows(res.data);
        });
    };
    useEffect(() => {
        loadList();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.title);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);

        if (newSelected.length === 0) {
            setInput({
                title: "",
                rating: "",
                year: "",
                genre: "",
                img: "",
                duration: "",
                review: "",
                description: "",
            });
        } else {
            rows.forEach((el) => {
                if (el.id === id) {
                    setInput(el);
                    return 0;
                }
            });
        }
        console.log(id);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = () => {
        console.log("test delete");
        console.log(selected);
        selected.forEach((el1) => {
            rows.forEach((el2) => {
                if (el2.id === el1) {
                    Axios.delete(
                        `https://fajrika-a39f.restdb.io/rest/movies/${el2._id}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "x-apikey": "5f39419568a7ed76e035d33d",
                            },
                        }
                    ).then((res) => {
                        loadList();
                        setOpen(true);
                        setSelected([]);
                    });
                    return 0;
                }
            });
        });
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let d = new Date();
        let dNow =
            d.getFullYear() +
            "/" +
            ("0" + d.getMonth()).slice(-2) +
            "/" +
            ("0" + d.getDate()).slice(-2) +
            " " +
            d.getHours() +
            ":" +
            d.getMinutes() +
            ":" +
            d.getSeconds();
        if (input.title && input.year && input.rating && input.genre) {
            if (selected.length === 0) {
                console.log(e.target.name);
                Axios.post(
                    "https://fajrika-a39f.restdb.io/rest/movies",
                    { ...input, created_at: dNow, updated_at: dNow },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-apikey": "5f39419568a7ed76e035d33d",
                        },
                    }
                ).then((res) => {
                    loadList();
                    setOpen(true);
                });
            } else {
                console.log(selected);
                let tmp = 0;
                rows.forEach((el) => {
                    if (el.id === selected[selected.length - 1]) {
                        tmp = el._id;
                        return 0;
                    }
                });
                Axios.put(
                    `https://fajrika-a39f.restdb.io/rest/movies/${tmp}`,
                    { ...input, updated_at: dNow },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-apikey": "5f39419568a7ed76e035d33d",
                        },
                    }
                ).then((res) => {
                    loadList();
                    setOpen(true);
                });
            }
        }
        setInput({
            title: "",
            rating: "",
            year: "",
            genre: "",
            img: "",
            duration: "",
            review: "",
            description: "",
        });
    };
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    tipe="table"
                    numSelected={selected.length}
                    handleDelete={handleDelete}
                />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(event, row.id)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                // component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                className="td-title"
                                            >
                                                {row.title}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-rating"
                                            >
                                                {row.rating}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-year"
                                            >
                                                {row.year}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-genre"
                                            >
                                                {row.genre}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-genre"
                                            >
                                                {row.duration}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-img"
                                            >
                                                {row.img}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-review"
                                            >
                                                {row.review}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                className="td-description"
                                            >
                                                {row.description}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={9} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[3, 6, 9, 12]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <EnhancedTableToolbar
                            tipe="form"
                            numSelected={selected.length}
                        />

                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                        >
                            <Snackbar
                                open={open}
                                autoHideDuration={6000}
                                onClose={handleCloseSnackBar}
                            >
                                <Alert
                                    onClose={handleCloseSnackBar}
                                    severity="success"
                                >
                                    Input / Update / Delete berhasil di lakukan
                                </Alert>
                            </Snackbar>
                            <TextField
                                className={classes.form}
                                id="inp-title"
                                label="Title"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="title"
                                value={input.title}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-rating"
                                label="Rating"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="rating"
                                type="number"
                                value={input.rating}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-year"
                                label="Year"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="year"
                                type="number"
                                value={input.year}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-genre"
                                label="Genre"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="genre"
                                value={input.genre}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-duration"
                                label="Duration"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="duration"
                                value={input.duration}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-img"
                                label="Img"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="img"
                                value={input.img}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-review"
                                label="Review"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="review"
                                value={input.review}
                                onChange={handleChange}
                            />
                            <TextField
                                className={classes.form}
                                id="inp-description"
                                label="Description"
                                // defaultValue="Default Value"
                                helperText="Required"
                                name="description"
                                value={input.description}
                                onChange={handleChange}
                            />
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.btn_save}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
