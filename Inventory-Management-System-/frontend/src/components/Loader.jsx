const Loader = ({ text = 'Loading...' }) => {
    return (
        <div className="loader-overlay">
            <div className="loader">
                <div className="loader-spinner"></div>
                <span className="loader-text">{text}</span>
            </div>
        </div>
    );
};

export default Loader;
