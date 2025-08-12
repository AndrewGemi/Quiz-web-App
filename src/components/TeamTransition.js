function TeamTransition({ team, onContinue }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className=" w-[30rem] p-10 rounded-lg text-center transform animate-fade-in flex flex-col gap-4">
                <h2 className="text-5xl font-bold text-white mb-4">Next Up:</h2>
                <div className="text-7xl font-extrabold text-[#6b05fa] mb-6">
                    {team}
                </div>
                <button
                    onClick={onContinue}
                    className="bg-[#6b05fa] text-2xl self-center hover:bg-[#410596] text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 w-fit"
                >
                    Ready to Play
                </button>
            </div>
        </div>
    );
}

export default TeamTransition;