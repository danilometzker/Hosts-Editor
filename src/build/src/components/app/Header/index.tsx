import { BiMinus, BiShuffle, BiX } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import "./styles.scss";

const AppHeader = () => {
    const handleMinimize = async () => {
        await window.electron.invoke("minimize-app");
    };

    const handleClose = async () => {
        await window.electron.invoke("close-app");
    };

    return (
        <div className="app-header draggable non-selectable">
            <div className="app-header-title">
                <BiShuffle />
                <h1>Hosts Editor</h1>
            </div>
            <div className="app-header-buttons non-draggable">
                <Button variant="ghost" onClick={handleMinimize}>
                    <BiMinus />
                </Button>
                <Button
                    variant="ghost"
                    className="app-header-close-button"
                    onClick={handleClose}
                >
                    <BiX size={24} />
                </Button>
            </div>
        </div>
    );
};

export default AppHeader;
