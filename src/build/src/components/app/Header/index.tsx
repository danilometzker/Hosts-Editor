import { BiMinus, BiQuestionMark, BiX } from 'react-icons/bi';
import { MdOutlineEditNote } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import './styles.scss';
import { useNavigate } from 'react-router';

const AppHeader = () => {
  const navigate = useNavigate();
  const handleMinimize = async () => {
    await window.electron.invoke('minimize-app');
  };

  const handleClose = async () => {
    await window.electron.invoke('close-app');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  return (
    <div className="app-header draggable non-selectable">
      <div className="app-header-title">
        <MdOutlineEditNote size={28} />
        <h1>Hosts Editor</h1>
      </div>
      <div className="app-header-buttons non-draggable">
        <Button variant="ghost" onClick={handleAbout}>
          <BiQuestionMark />
        </Button>
        <Button variant="ghost" onClick={handleMinimize}>
          <BiMinus />
        </Button>
        <Button variant="ghost" className="app-header-close-button" onClick={handleClose}>
          <BiX size={24} />
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
