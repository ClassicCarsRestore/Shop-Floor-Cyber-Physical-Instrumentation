export default function PlugStatus(props: { status: boolean }) {
    
  return (
    <div className="flex flex-wrap ">
      {props.status ? (
        <div className="bg-white hover:bg-green hover:text-white py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="bg-white hover:bg-red hover:text-white py-1 px-2 rounded rounded-lg border border-red focus:outline-none focus:border-red">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
