import { useMediaQuery, useTheme } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
const DialogComponent = ({ open, handleClose, title, component, size }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down(size));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            maxWidth={size}
            fullWidth
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle sx={{ position: "relative", padding: "24px" }}>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {component}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};

export default DialogComponent;
