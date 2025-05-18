import './Loader.css';

const Loader = ({ fullscreen = false }) => {
  return (
    <div className={fullscreen ? 'spinner-overlay' : 'spinner-container'}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
