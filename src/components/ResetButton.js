function ResetButton({ dispatch }) {
    const handleReset = () => {
        const confirmReset = window.confirm("Are you sure you want to restart the quiz? All progress will be lost.");
        if (confirmReset) {
            dispatch({ type: "restart" });
        }
    };

    return (
        <button
            className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full 
            transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={handleReset}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Quiz
        </button>
    );
}

export default ResetButton;