function Progress({ index, numQuestions, points, totalPoints, answer }) {
  return (
    <header className="progress w-full max-w-[720px] space-y-2 anim-fade-up">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <div className="flex justify-between w-full">
        <p className="m-0 text-[1.3rem] md:text-[1.6rem]">
          Question <strong>{index + 1}</strong> / {numQuestions}
        </p>
        <p className="m-0 text-[1.3rem] md:text-[1.6rem]">
          <strong>{Math.ceil(points)}</strong> / {Math.ceil(totalPoints)}
          <span className="text-gray-500"> points</span>
        </p>
      </div>
    </header>
  );
}

export default Progress;
